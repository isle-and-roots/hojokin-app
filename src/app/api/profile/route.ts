import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBusinessProfile, upsertBusinessProfile } from "@/lib/db/business-profiles";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "ログインしてください" }, { status: 401 });
    }

    const profile = await getBusinessProfile(user.id);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "プロフィールの取得に失敗しました" },
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
    const { profileId, ...profileData } = body;

    const profile = await upsertBusinessProfile(user.id, profileData, profileId);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json(
      { error: "プロフィールの保存に失敗しました" },
      { status: 500 }
    );
  }
}
