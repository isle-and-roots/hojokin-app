import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe/helpers";
import { rateLimit } from "@/lib/rate-limit";

const CHECKOUT_RATE_LIMIT = 5; // 1時間あたり最大5回
const CHECKOUT_WINDOW_MS = 60 * 60 * 1000; // 1時間

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "ログインしてください" },
        { status: 401 }
      );
    }

    // レート制限チェック
    const { success: withinLimit } = rateLimit(
      `checkout:${user.id}`,
      CHECKOUT_RATE_LIMIT,
      CHECKOUT_WINDOW_MS
    );
    if (!withinLimit) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくしてからお試しください" },
        { status: 429 }
      );
    }

    const { plan } = await request.json();

    if (!["starter", "pro", "business"].includes(plan)) {
      return NextResponse.json(
        { error: "無効なプランです" },
        { status: 400 }
      );
    }

    // 既存の Stripe 顧客 ID を取得（重複防止）
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const session = await createCheckoutSession(
      user.id,
      user.email || "",
      plan,
      `${origin}/pricing`,
      profile?.stripe_customer_id || undefined
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "チェックアウトの作成に失敗しました" },
      { status: 500 }
    );
  }
}
