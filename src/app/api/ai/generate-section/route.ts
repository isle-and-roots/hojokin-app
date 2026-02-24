import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getJizokukaPrompt } from "@/lib/ai/prompts/jizokuka";
import { getPrompt } from "@/lib/ai/prompts";
import { getSubsidyById } from "@/lib/subsidies";

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
    recentRevenue: z.any().nullable().optional(),
    recentProfit: z.any().nullable().optional(),
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

    // Business プランは Opus を使用
    const modelId =
      userProfile?.plan === "business"
        ? "claude-sonnet-4-20250514" // TODO: Opus 利用可能時に切替
        : "claude-sonnet-4-20250514";

    const message = await anthropic.messages.create({
      model: modelId,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

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

    return NextResponse.json({
      content,
      modelUsed: modelId,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("AI generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容を確認してください" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "申請書の生成に失敗しました。もう一度お試しください。",
      },
      { status: 500 }
    );
  }
}
