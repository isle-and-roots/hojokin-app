import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

    const { data: userProfile, error } = await supabase
      .from("user_profiles")
      .select(
        "plan, polar_customer_id, polar_subscription_id, ai_generations_used, ai_generations_reset_at"
      )
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "プロフィール取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ userProfile });
  } catch (err) {
    console.error("User plan GET error:", err);
    return NextResponse.json(
      { error: "サーバーエラー" },
      { status: 500 }
    );
  }
}
