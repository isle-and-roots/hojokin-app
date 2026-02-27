import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * ヘルスチェックエンドポイント
 *
 * 各テーブルのクリティカルカラムに対して limit(0) クエリを実行し、
 * カラム存在を検証する（データは返さず実質ゼロコスト）。
 *
 * Vercel Cron で 6 時間ごとに実行。
 */

const TABLE_CHECKS: Record<string, string> = {
  user_profiles: "id, plan, ai_generations_used",
  business_profiles: "id, user_id, company_name, prefecture",
  applications: "id, user_id, subsidy_id, status",
  application_sections: "id, application_id, section_key, ai_generated_content",
  email_leads: "id, email",
};

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { status: "error", message: "Supabase 環境変数が未設定" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, key);
  const checks: { table: string; status: string; error?: string }[] = [];
  let allHealthy = true;

  for (const [table, columns] of Object.entries(TABLE_CHECKS)) {
    const { error } = await supabase.from(table).select(columns).limit(0);

    if (error) {
      checks.push({ table, status: "fail", error: error.message });
      allHealthy = false;
    } else {
      checks.push({ table, status: "ok" });
    }
  }

  const status = allHealthy ? "healthy" : "degraded";
  const httpStatus = allHealthy ? 200 : 503;

  return NextResponse.json({ status, checks }, { status: httpStatus });
}
