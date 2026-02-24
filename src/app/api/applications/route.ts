import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getApplications,
  createApplication,
  deleteApplication,
} from "@/lib/db/applications";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "ログインしてください" }, { status: 401 });
    }

    const applications = await getApplications(user.id);
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Applications GET error:", error);
    return NextResponse.json(
      { error: "申請一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "ログインしてください" }, { status: 401 });
    }

    const body = await request.json();
    const application = await createApplication(user.id, body);
    return NextResponse.json({ application });
  } catch (error) {
    console.error("Applications POST error:", error);
    return NextResponse.json(
      { error: "申請の作成に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "ログインしてください" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
    }

    await deleteApplication(id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Applications DELETE error:", error);
    return NextResponse.json(
      { error: "申請の削除に失敗しました" },
      { status: 500 }
    );
  }
}
