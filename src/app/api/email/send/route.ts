import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
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

const sendSchema = z.object({
  userId: z.string().uuid("無効なユーザーIDです"),
  templateKey: z.enum([
    "welcome",
    "subsidy_guide",
    "try_ai",
    "pro_upsell",
    "deadline_urgency",
    "success_tips",
    "limited_offer",
  ] as const),
});

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

export async function POST(request: NextRequest) {
  try {
    // 内部 API キーチェック
    const internalApiKey = request.headers.get("x-internal-api-key");
    const expectedKey = process.env.CRON_SECRET;

    if (!expectedKey || internalApiKey !== expectedKey) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = sendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容を確認してください", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, templateKey } = parsed.data;

    // Supabase からユーザーのメールアドレスを取得
    const supabase = createServiceClient();
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    const userEmail = typeof profile.email === "string" ? profile.email : null;
    if (!userEmail) {
      return NextResponse.json(
        { error: "ユーザーのメールアドレスが登録されていません" },
        { status: 422 }
      );
    }

    // テンプレート生成
    const { subject, html } = getEmailTemplate(
      templateKey as EmailTemplateKey
    );

    // Resend でメール送信（未設定時はコンソールログにフォールバック）
    const resend = getResend();
    if (!resend) {
      console.info("[Email] Dev fallback — would send:", {
        to: userEmail,
        template: templateKey,
        subject,
      });
      return NextResponse.json({
        success: true,
        emailId: null,
        to: userEmail,
        template: templateKey,
        devMode: true,
      });
    }

    const { data, error: sendError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: userEmail,
      subject,
      html,
    });

    const posthog = getPostHogServer();

    if (sendError) {
      console.error("[Email] Send failed:", sendError);
      posthog?.capture({
        distinctId: userId,
        event: EVENTS.EMAIL_SEQUENCE_FAILED,
        properties: { template: templateKey, error: sendError.message },
      });
      return NextResponse.json(
        { error: "メール送信に失敗しました" },
        { status: 500 }
      );
    }

    posthog?.capture({
      distinctId: userId,
      event: EVENTS.EMAIL_SEQUENCE_SENT,
      properties: { template: templateKey, emailId: data?.id },
    });

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      to: userEmail,
      template: templateKey,
    });
  } catch (error) {
    console.error("[Email] Unexpected error:", error);
    return NextResponse.json(
      { error: "メール送信中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
