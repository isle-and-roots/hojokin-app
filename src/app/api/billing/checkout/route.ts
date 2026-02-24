import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe/helpers";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "ログインしてください" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (plan !== "pro" && plan !== "business") {
      return NextResponse.json({ error: "無効なプランです" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const session = await createCheckoutSession(
      user.id,
      user.email || "",
      plan,
      `${origin}/pricing`
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
