import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "メールアドレスが必要です" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("email_leads")
      .upsert({ email: email.toLowerCase().trim(), source: source || "lp" }, { onConflict: "email" });

    if (error) {
      return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
