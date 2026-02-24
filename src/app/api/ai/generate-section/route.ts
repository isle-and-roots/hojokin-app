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
  isRetryable,
  type AiErrorKind,
} from "@/lib/ai/config";
import { trackServerEvent } from "@/lib/posthog/track";
import { EVENTS } from "@/lib/posthog/events";

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

/** 指数バックオフ付きリトライで Anthropic API を呼び出す */
async function callAnthropicWithRetry(
  modelId: string,
  prompt: string,
  signal?: AbortSignal
): Promise<Anthropic.Message> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= AI_CONFIG.maxRetries; attempt++) {
    try {
      const message = await anthropic.messages.create(
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
          signal,
        }
      );
      return message;
    } catch (error) {
      lastError = error;
      const kind = classifyError(error);

      // リトライ不可能なエラー or 最終試行 → 即座にスロー
      if (!isRetryable(kind) || attempt === AI_CONFIG.maxRetries) {
        throw error;
      }

      // 指数バックオフ: 1秒 → 3秒
      const delay = AI_CONFIG.retryBaseDelayMs * (attempt === 0 ? 1 : 3);
      console.warn(
        `[AI] Retry ${attempt + 1}/${AI_CONFIG.maxRetries} after ${delay}ms (${kind})`,
        error instanceof Error ? error.message : error
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

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

    // リトライ付き API 呼び出し
    const message = await callAnthropicWithRetry(modelId, prompt, request.signal);

    const textContent = message.content.find((block) => block.type === "text");
    const content = textContent ? textContent.text : "";

    // 使用量インクリメント
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
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      section_key: sectionKey,
      subsidy_id: subsidyId || "jizokuka-001",
      plan,
    });

    return NextResponse.json({
      content,
      modelUsed: modelId,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    // 構造化エラーログ（将来の Sentry 対応準備）
    const errorKind: AiErrorKind = classifyError(error);

    // PostHog サーバーサイドエラートラッキング（userId が取れる場合のみ）
    try {
      const supabaseForError = await createClient();
      const { data: { user: errorUser } } = await supabaseForError.auth.getUser();
      if (errorUser) {
        trackServerEvent(errorUser.id, EVENTS.AI_GENERATION_FAILED, {
          error_kind: errorKind,
          error_message: error instanceof Error ? error.message : String(error),
        });
      }
    } catch {
      // エラートラッキング自体の失敗は無視
    }

    console.error("[AI] Generation failed:", {
      kind: errorKind,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容を確認してください" },
        { status: 400 }
      );
    }

    // キャンセル（AbortController）
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "生成がキャンセルされました", errorKind: "cancelled" },
        { status: 499 }
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
