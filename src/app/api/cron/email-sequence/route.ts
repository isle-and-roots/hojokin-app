import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getResend } from "@/lib/email/client";
import {
  getEmailTemplate,
  type EmailTemplateKey,
} from "@/lib/email/templates";
import { getPostHogServer } from "@/lib/posthog/server";
import { EVENTS } from "@/lib/posthog/events";

const EMAIL_FROM =
  process.env.EMAIL_FROM || "noreply@hojokin.isle-and-roots.com";

/** Service Role Key を使って Supabase クライアントを作成（RLS バイパス） */
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase 環境変数が設定されていません");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

type UserProfile = {
  id: string;
  email: string | null;
  plan: string;
  created_at: string;
  ai_generations_used: number;
};

/** 日数前の ISO 文字列を返す（開始・終了の範囲用） */
function daysAgoRange(
  daysAgo: number,
  windowHours = 24
): { start: string; end: string } {
  const end = new Date();
  end.setDate(end.getDate() - daysAgo);

  const start = new Date(end);
  start.setHours(start.getHours() - windowHours);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

type SequenceStep = {
  daysAgo: number;
  templateKey: EmailTemplateKey;
  /** null の場合は条件なし（全ユーザー対象） */
  condition: "no_ai_usage" | "free_plan" | null;
  label: string;
};

const SEQUENCE_STEPS: SequenceStep[] = [
  {
    daysAgo: 0,
    templateKey: "welcome",
    condition: null,
    label: "Day 0: ウェルカム",
  },
  {
    daysAgo: 1,
    templateKey: "subsidy_guide",
    condition: null,
    label: "Day 1: 補助金の選び方",
  },
  {
    daysAgo: 3,
    templateKey: "try_ai",
    condition: "no_ai_usage",
    label: "Day 3: AI生成試用促進",
  },
  {
    daysAgo: 7,
    templateKey: "pro_upsell",
    condition: null,
    label: "Day 7: Pro訴求",
  },
  {
    daysAgo: 14,
    templateKey: "deadline_urgency",
    condition: "free_plan",
    label: "Day 14: 締切緊急性",
  },
  {
    daysAgo: 21,
    templateKey: "success_tips",
    condition: null,
    label: "Day 21: 採択のコツ",
  },
  {
    daysAgo: 30,
    templateKey: "limited_offer",
    condition: "free_plan",
    label: "Day 30: 期間限定オファー",
  },
];

async function sendEmailToUser(
  resend: NonNullable<ReturnType<typeof getResend>>,
  user: UserProfile,
  templateKey: EmailTemplateKey
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  if (!user.email) {
    return { success: false, error: "メールアドレスなし" };
  }

  const { subject, html } = getEmailTemplate(templateKey);

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: user.email,
    subject,
    html,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, emailId: data?.id };
}

export async function GET(request: NextRequest) {
  try {
    // Vercel Cron Secret チェック
    const cronSecret = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || cronSecret !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    const supabase = createServiceClient();
    const resend = getResend();
    const posthog = getPostHogServer();

    // RESEND_API_KEY 未設定時は開発環境フォールバック
    if (!resend) {
      console.info("[EmailCron] Dev mode — RESEND_API_KEY 未設定のためスキップ");
      return NextResponse.json({
        success: true,
        totalSent: 0,
        totalFailed: 0,
        results: [],
        devMode: true,
      });
    }

    const results: Array<{
      step: string;
      sent: number;
      failed: number;
      skipped: number;
    }> = [];

    for (const step of SEQUENCE_STEPS) {
      let sent = 0;
      let failed = 0;
      let skipped = 0;

      // Day 0 は直近1時間以内に登録したユーザーを対象
      const windowHours = step.daysAgo === 0 ? 1 : 24;
      const { start, end } = daysAgoRange(step.daysAgo, windowHours);

      // 登録日時の範囲でユーザーを取得
      let query = supabase
        .from("user_profiles")
        .select("id, email, plan, created_at, ai_generations_used")
        .gte("created_at", start)
        .lte("created_at", end);

      // 条件フィルタ
      if (step.condition === "free_plan") {
        query = query.eq("plan", "free");
      }

      const { data: users, error: queryError } = await query;

      if (queryError) {
        console.error(`[EmailCron] Query error for step ${step.label}:`, queryError);
        results.push({ step: step.label, sent: 0, failed: 0, skipped: 0 });
        continue;
      }

      if (!users || users.length === 0) {
        results.push({ step: step.label, sent: 0, failed: 0, skipped: 0 });
        continue;
      }

      for (const user of users as UserProfile[]) {
        // no_ai_usage 条件: AI生成未使用ユーザーのみ
        if (
          step.condition === "no_ai_usage" &&
          user.ai_generations_used > 0
        ) {
          skipped++;
          posthog?.capture({
            distinctId: user.id,
            event: EVENTS.EMAIL_SEQUENCE_SKIPPED,
            properties: { template: step.templateKey, reason: "ai_usage_found" },
          });
          continue;
        }

        const result = await sendEmailToUser(resend, user, step.templateKey);

        if (result.success) {
          sent++;
          posthog?.capture({
            distinctId: user.id,
            event: EVENTS.EMAIL_SEQUENCE_SENT,
            properties: { template: step.templateKey, emailId: result.emailId },
          });
        } else {
          failed++;
          console.error(
            `[EmailCron] Failed to send ${step.templateKey} to user ${user.id}: ${result.error}`
          );
          posthog?.capture({
            distinctId: user.id,
            event: EVENTS.EMAIL_SEQUENCE_FAILED,
            properties: { template: step.templateKey, error: result.error },
          });
        }
      }

      results.push({ step: step.label, sent, failed, skipped });
    }

    const totalSent = results.reduce((sum, r) => sum + r.sent, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);

    return NextResponse.json({
      success: true,
      totalSent,
      totalFailed,
      results,
    });
  } catch (error) {
    console.error("[EmailCron] Unexpected error:", error);
    return NextResponse.json(
      { error: "メールシーケンス処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
