import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPolar } from "@/lib/polar/config";
import { PLAN_LIST } from "@/lib/plans";
import { rateLimit } from "@/lib/rate-limit";
import { trackServerEvent } from "@/lib/posthog/track";
import { EVENTS } from "@/lib/posthog/events";

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

    const { plan, billingInterval } = await request.json();

    if (!["starter", "pro", "business"].includes(plan)) {
      return NextResponse.json(
        { error: "無効なプランです" },
        { status: 400 }
      );
    }

    if (billingInterval && !["monthly", "annual"].includes(billingInterval)) {
      return NextResponse.json(
        { error: "無効な請求間隔です" },
        { status: 400 }
      );
    }

    const planInfo = PLAN_LIST.find((p) => p.key === plan);
    if (!planInfo || !planInfo.productId) {
      return NextResponse.json(
        { error: "プランの Product ID が未設定です" },
        { status: 500 }
      );
    }

    const isAnnual = billingInterval === "annual";
    if (isAnnual && !planInfo.annualProductId) {
      return NextResponse.json(
        { error: "年額プランは現在準備中です" },
        { status: 400 }
      );
    }

    const productId = isAnnual ? planInfo.annualProductId : planInfo.productId;
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const polar = getPolar();
    const checkout = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: user.id,
      successUrl: `${origin}/pricing?success=true`,
      metadata: { plan, billingInterval: billingInterval ?? "monthly" },
      currency: "jpy",
      ...(user.email ? { customerEmail: user.email } : {}),
    });

    trackServerEvent(user.id, EVENTS.CHECKOUT_INITIATED, {
      plan,
      billing_interval: billingInterval ?? "monthly",
      product_id: productId,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "チェックアウトの作成に失敗しました" },
      { status: 500 }
    );
  }
}
