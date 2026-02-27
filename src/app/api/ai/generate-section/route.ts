import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getJizokukaPrompt } from "@/lib/ai/prompts/jizokuka";
import { getPrompt } from "@/lib/ai/prompts";
import { getSubsidyById } from "@/lib/subsidies";
import type { PlanKey } from "@/lib/plans";
import {
  AI_CONFIG,
  SYSTEM_PROMPT,
  getModelForPlan,
  classifyError,
  getErrorMessage,
  type AiErrorKind,
} from "@/lib/ai/config";
import { trackServerEvent } from "@/lib/posthog/track";
import { EVENTS } from "@/lib/posthog/events";
import { withSpan } from "@/lib/datadog";
import { logger } from "@/lib/datadog/logger";

const anthropic = new Anthropic();

// リクエストバリデーション
const generateSectionSchema = z.object({
  sectionKey: z.string().min(1, "sectionKey は必須です"),
  profile: z.object({
    companyName: z.string().min(1),
    representative: z.string().optional().default(""),
    address: z.string().optional().default(""),
    phone: z.string().optional().default(""),
    email: z.string().optional().default(""),
    industry: z.string().optional().default(""),
    employeeCount: z.number().optional().default(0),
    annualRevenue: z.number().nullable().optional(),
    foundedYear: z.number().nullable().optional(),
    businessDescription: z.string().optional().default(""),
    products: z.string().optional().default(""),
    targetCustomers: z.string().optional().default(""),
    salesChannels: z.string().optional().default(""),
    strengths: z.string().optional().default(""),
    challenges: z.string().optional().default(""),
    recentRevenue: z.array(z.object({ year: z.number(), amount: z.number() })).nullable().optional(),
    recentProfit: z.array(z.object({ year: z.number(), amount: z.number() })).nullable().optional(),
  }),
  subsidyId: z.string().optional(),
  additionalContext: z.string().optional(),
});

// プラン別 AI 生成上限
const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 15,
  pro: 100,
  business: 500,
};

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "ログインしてください" },
        { status: 401 }
      );
    }

    // 使用量チェック
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("plan, ai_generations_used, ai_generations_reset_at")
      .eq("id", user.id)
      .single();

    if (userProfile) {
      // 月初リセットチェック
      const resetAt = new Date(userProfile.ai_generations_reset_at);
      const now = new Date();
      if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
        await supabase
          .from("user_profiles")
          .update({ ai_generations_used: 0, ai_generations_reset_at: now.toISOString() })
          .eq("id", user.id);
        userProfile.ai_generations_used = 0;
      }

      const limit = PLAN_LIMITS[userProfile.plan] ?? 3;
      if (userProfile.ai_generations_used >= limit) {
        trackServerEvent(user.id, EVENTS.QUOTA_EXCEEDED, {
          plan: userProfile.plan,
          limit,
          used: userProfile.ai_generations_used,
        });
        return NextResponse.json(
          {
            error: `今月の AI 生成回数の上限（${limit}回）に達しました。${
              userProfile.plan === "free"
                ? "Starter プランにアップグレードすると月15回までご利用いただけます。"
                : userProfile.plan === "starter"
                  ? "Pro プランにアップグレードすると月100回までご利用いただけます。"
                  : ""
            }`,
          },
          { status: 429 }
        );
      }
    }

    // リクエストバリデーション
    const body = await request.json();
    const parsed = generateSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容を確認してください", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sectionKey, profile: profileData, subsidyId, additionalContext } = parsed.data;

    // Zod parsed data を BusinessProfile 互換に変換
    const profile = {
      ...profileData,
      id: "",
      createdAt: "",
      updatedAt: "",
    } as import("@/types").BusinessProfile;

    let prompt: string;

    if (subsidyId) {
      const subsidy = await getSubsidyById(subsidyId);
      if (!subsidy) {
        return NextResponse.json(
          { error: `補助金が見つかりません: ${subsidyId}` },
          { status: 404 }
        );
      }
      prompt = getPrompt(subsidy, sectionKey, profile, additionalContext);
    } else {
      // Backward compatibility: default to JIZOKUKA
      prompt = getJizokukaPrompt(sectionKey, profile, additionalContext);
    }

    // プラン別モデル選択（Business → Opus, 他 → Sonnet）
    const plan: PlanKey = (userProfile?.plan as PlanKey) ?? "free";
    const modelId = getModelForPlan(plan);

    // SSE ストリーミングレスポンス
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          await withSpan(
            'ai.generate-section',
            {
              resource: 'generate-section',
              tags: {
                'user.plan': plan,
                'subsidy.id': subsidyId || 'jizokuka-001',
                'ai.model': modelId,
              },
            },
            async () => {
              const stream = anthropic.messages.stream(
                {
                  model: modelId,
                  max_tokens: AI_CONFIG.maxTokens,
                  temperature: AI_CONFIG.temperature,
                  system: [
                    {
                      type: "text" as const,
                      text: SYSTEM_PROMPT,
                      cache_control: { type: "ephemeral" as const },
                    },
                  ],
                  messages: [{ role: "user", content: prompt }],
                },
                {
                  timeout: AI_CONFIG.timeoutMs,
                  signal: request.signal,
                }
              );

              stream.on('text', (text) => {
                const data = JSON.stringify({ type: "delta", text });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              });

              const finalMessage = await stream.finalMessage();

              // トークン使用量・キャッシュヒット率のログ記録 (LLM Observability)
              logger.info('anthropic.generation.complete', {
                model: modelId,
                input_tokens: finalMessage.usage.input_tokens,
                output_tokens: finalMessage.usage.output_tokens,
                cache_creation_input_tokens: finalMessage.usage.cache_creation_input_tokens ?? 0,
                cache_read_input_tokens: finalMessage.usage.cache_read_input_tokens ?? 0,
                subsidy_id: subsidyId || 'jizokuka-001',
                user_plan: plan,
                section_key: sectionKey,
              });

              // 使用量インクリメント（ストリーム完了後のみ）
              if (userProfile) {
                await supabase
                  .from("user_profiles")
                  .update({
                    ai_generations_used: (userProfile.ai_generations_used || 0) + 1,
                  })
                  .eq("id", user.id);
              }

              trackServerEvent(user.id, EVENTS.AI_GENERATION_SUCCESS, {
                model: modelId,
                input_tokens: finalMessage.usage.input_tokens,
                output_tokens: finalMessage.usage.output_tokens,
                section_key: sectionKey,
                subsidy_id: subsidyId || "jizokuka-001",
                plan,
              });

              // done イベント送信
              const doneData = JSON.stringify({
                type: "done",
                usage: {
                  inputTokens: finalMessage.usage.input_tokens,
                  outputTokens: finalMessage.usage.output_tokens,
                },
              });
              controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
              controller.close();
            }
          );
        } catch (error) {
          // エラー分類
          const errorKind: AiErrorKind = classifyError(error);

          // PostHog サーバーサイドエラートラッキング
          try {
            trackServerEvent(user.id, EVENTS.AI_GENERATION_FAILED, {
              error_kind: errorKind,
              error_message: error instanceof Error ? error.message : String(error),
            });
          } catch {
            // エラートラッキング自体の失敗は無視
          }

          console.error("[AI] Generation failed:", {
            kind: errorKind,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });

          // キャンセル時はストリームを静かに閉じる
          if (error instanceof Error && error.name === "AbortError") {
            controller.close();
            return;
          }

          // エラーイベントを送信してストリームを閉じる
          const errData = JSON.stringify({
            type: "error",
            message: getErrorMessage(errorKind),
            errorKind,
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
    // ストリーム開始前のエラー（認証・バリデーション等）
    const errorKind: AiErrorKind = classifyError(error);

    console.error("[AI] Pre-stream error:", {
      kind: errorKind,
      message: error instanceof Error ? error.message : String(error),
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容を確認してください" },
        { status: 400 }
      );
    }

    const statusMap: Record<AiErrorKind, number> = {
      rate_limit: 429,
      timeout: 504,
      server_error: 502,
      invalid_request: 400,
      unknown: 500,
    };

    return NextResponse.json(
      {
        error: getErrorMessage(errorKind),
        errorKind,
      },
      { status: statusMap[errorKind] }
    );
  }
}
