import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { PlanKey } from "@/lib/plans";
import { canUseFeature } from "@/lib/plans";
import {
  getChatModelForPlan,
  getChatDailyLimit,
  CHAT_MAX_HISTORY,
} from "@/lib/ai/chat-config";
import { classifyError, getErrorMessage, type AiErrorKind } from "@/lib/ai/config";
import { buildChatSystemPrompt, buildUserContext } from "@/lib/ai/chat-prompt";
import { searchSubsidies } from "@/lib/subsidies";
import { getBusinessProfile } from "@/lib/db/business-profiles";
import { logger } from "@/lib/datadog/logger";

const anthropic = new Anthropic();

const chatSchema = z.object({
  message: z.string().min(1, "メッセージを入力してください").max(4000, "メッセージが長すぎます"),
  sessionId: z.string().uuid().optional(),
  context: z
    .object({
      subsidyId: z.string().optional(),
    })
    .optional(),
});

type MessageParam = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "ログインしてください" }, { status: 401 });
    }

    // リクエストバリデーション
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容を確認してください", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, sessionId, context } = parsed.data;

    // プラン・ビジネスプロフィール・補助金データを並列取得
    const [userProfileResult, businessProfile, subsidiesResult] = await Promise.all([
      supabase.from("user_profiles").select("plan").eq("id", user.id).single(),
      getBusinessProfile(user.id),
      searchSubsidies({}),
    ]);

    const plan: PlanKey = (userProfileResult.data?.plan as PlanKey) ?? "free";

    // 申請書テキスト検出（200文字以上の連続した文章を申請書とみなす）
    const isReviewRequest = message.length >= 200;

    // レビューモードのプランゲート
    if (isReviewRequest && !canUseFeature(plan, "chatReview")) {
      return NextResponse.json(
        {
          error:
            "申請書のレビューはProプラン以上でご利用いただけます。Proプランにアップグレードすると、AIが申請書の強み・弱みを分析し、採択されやすくするための具体的な修正案を提案します。",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // 日次レート制限チェック（chat_messages の当日カウント）
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count: todayCount } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "user")
      .gte("created_at", todayStart.toISOString());

    const dailyLimit = getChatDailyLimit(plan);
    if ((todayCount ?? 0) >= dailyLimit) {
      return NextResponse.json(
        {
          error: `本日のチャット上限（${dailyLimit}回）に達しました。${
            plan === "free"
              ? "Starterプランにアップグレードすると1日10回までご利用いただけます。"
              : plan === "starter"
                ? "Proプランにアップグレードすると1日20回までご利用いただけます。"
                : ""
          }`,
        },
        { status: 429 }
      );
    }

    // セッション取得または作成
    let activeSessionId = sessionId;

    if (!activeSessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title: message.slice(0, 50) })
        .select("id")
        .single();

      if (sessionError || !newSession) {
        return NextResponse.json({ error: "セッションの作成に失敗しました" }, { status: 500 });
      }
      activeSessionId = newSession.id;
    } else {
      // セッションの所有権確認
      const { data: session } = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("id", activeSessionId)
        .eq("user_id", user.id)
        .single();

      if (!session) {
        return NextResponse.json({ error: "セッションが見つかりません" }, { status: 404 });
      }
    }

    // 会話履歴取得（最新 CHAT_MAX_HISTORY 件）
    const { data: historyRows } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", activeSessionId)
      .order("created_at", { ascending: true })
      .limit(CHAT_MAX_HISTORY);

    const history: MessageParam[] = (historyRows ?? []).map((row) => ({
      role: row.role as "user" | "assistant",
      content: row.content,
    }));

    // ユーザーメッセージをDBに保存
    await supabase.from("chat_messages").insert({
      session_id: activeSessionId,
      user_id: user.id,
      role: "user",
      content: message,
      metadata: context ? { subsidyId: context.subsidyId } : null,
    });

    // Prompt Caching 対象: ペルソナ + 補助金ナレッジベース（静的部分）
    const systemPromptText = buildChatSystemPrompt(
      subsidiesResult.items,
      canUseFeature(plan, "chatReview")
    );

    // ユーザーコンテキスト（動的部分 — キャッシュ外、初回メッセージに注入）
    const userContextText = buildUserContext(businessProfile);

    // メッセージリスト構築（初回のみコンテキスト注入）
    const messages: MessageParam[] =
      history.length === 0 && userContextText
        ? [{ role: "user", content: `${userContextText}\n\n${message}` }]
        : [...history, { role: "user", content: message }];

    // モデル選択
    const modelId = getChatModelForPlan(plan);

    // SSE ストリーミングレスポンス
    const encoder = new TextEncoder();
    let assistantContent = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = anthropic.messages.stream({
            model: modelId,
            max_tokens: 1024,
            system: [
              {
                // ナレッジベースを含む静的部分を Prompt Caching でキャッシュ
                type: "text" as const,
                text: systemPromptText,
                cache_control: { type: "ephemeral" as const },
              },
            ],
            messages,
          });

          // sessionId をまず送信
          const initData = JSON.stringify({ type: "init", sessionId: activeSessionId });
          controller.enqueue(encoder.encode(`data: ${initData}\n\n`));

          stream.on("text", (text) => {
            assistantContent += text;
            const data = JSON.stringify({ type: "delta", text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          });

          const finalMessage = await stream.finalMessage();

          // Datadog: トークン使用量 + キャッシュヒット率ログ
          logger.info("chat.generation.complete", {
            model: modelId,
            input_tokens: finalMessage.usage.input_tokens,
            output_tokens: finalMessage.usage.output_tokens,
            cache_creation_input_tokens: finalMessage.usage.cache_creation_input_tokens ?? 0,
            cache_read_input_tokens: finalMessage.usage.cache_read_input_tokens ?? 0,
            user_plan: plan,
            has_profile: businessProfile !== null,
          });

          // アシスタント返答をDBに保存
          await supabase.from("chat_messages").insert({
            session_id: activeSessionId,
            user_id: user.id,
            role: "assistant",
            content: assistantContent,
          });

          // セッションの updated_at を更新
          await supabase
            .from("chat_sessions")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", activeSessionId);

          const doneData = JSON.stringify({ type: "done" });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
          controller.close();
        } catch (error) {
          const errorKind: AiErrorKind = classifyError(error);

          logger.error("chat.generation.failed", {
            error_kind: errorKind,
            error_message: error instanceof Error ? error.message : String(error),
            user_plan: plan,
          });

          if (error instanceof Error && error.name === "AbortError") {
            controller.close();
            return;
          }

          const errData = JSON.stringify({
            type: "error",
            message: getErrorMessage(errorKind),
          });
          controller.enqueue(encoder.encode(`data: ${errData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const errorKind: AiErrorKind = classifyError(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力内容を確認してください" }, { status: 400 });
    }

    const statusMap: Record<AiErrorKind, number> = {
      rate_limit: 429,
      timeout: 504,
      server_error: 502,
      invalid_request: 400,
      unknown: 500,
    };

    return NextResponse.json(
      { error: getErrorMessage(errorKind) },
      { status: statusMap[errorKind] }
    );
  }
}
