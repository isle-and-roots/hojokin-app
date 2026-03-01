import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "ログインしてください" }, { status: 401 });
    }

    const { id } = await params;

    // セッションの所有権確認
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id, title, created_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: "セッションが見つかりません" }, { status: 404 });
    }

    // メッセージ取得（古い順）
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("session_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "メッセージの取得に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ session, messages: messages ?? [] });
  } catch {
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
