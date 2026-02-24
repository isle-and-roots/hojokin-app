import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPolar } from "@/lib/polar/config";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "ログインしてください" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("polar_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.polar_customer_id) {
      return NextResponse.json(
        { error: "サブスクリプションが見つかりません" },
        { status: 404 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const polar = getPolar();
    const session = await polar.customerSessions.create({
      customerId: profile.polar_customer_id,
      returnUrl: `${origin}/pricing`,
    });

    return NextResponse.json({ url: session.customerPortalUrl });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "顧客ポータルの作成に失敗しました" },
      { status: 500 }
    );
  }
}
