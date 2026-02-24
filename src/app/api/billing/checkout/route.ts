import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPolar } from "@/lib/polar/config";
import { PLAN_LIST } from "@/lib/plans";
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

    const planInfo = PLAN_LIST.find((p) => p.key === plan);
    if (!planInfo || !planInfo.productId) {
      return NextResponse.json(
        { error: "プランの Product ID が未設定です" },
        { status: 500 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const polar = getPolar();
    const checkout = await polar.checkouts.create({
      products: [planInfo.productId],
      externalCustomerId: user.id,
      customerEmail: user.email ?? undefined,
      successUrl: `${origin}/pricing?success=true`,
      metadata: { plan },
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
