import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { checkEnvironment, type EnvCheckResult } from "@/lib/env-check";

/**
 * ヘルスチェックエンドポイント
 *
 * 各テーブルのクリティカルカラムに対して limit(0) クエリを実行し、
 * カラム存在を検証する（データは返さず実質ゼロコスト）。
 * 環境変数の存在チェックも含む。
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

interface DbCheckResult {
  table: string;
  status: "ok" | "fail";
  error?: string;
  durationMs: number;
}

function readAppVersion(): string {
  try {
    const pkgPath = join(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { version?: string };
    return pkg.version ?? "unknown";
  } catch {
    return "unknown";
  }
}

export async function GET() {
  const startTime = Date.now();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Env checks
  const envResults: EnvCheckResult[] = checkEnvironment();
  const envHealthy = envResults
    .filter((r) => r.required)
    .every((r) => r.status === "ok");

  // DB checks
  const dbChecks: DbCheckResult[] = [];
  let dbHealthy = true;

  if (url && key) {
    const supabase = createClient(url, key);

    for (const [table, columns] of Object.entries(TABLE_CHECKS)) {
      const t0 = Date.now();
      const { error } = await supabase.from(table).select(columns).limit(0);
      const durationMs = Date.now() - t0;

      if (error) {
        dbChecks.push({ table, status: "fail", error: error.message, durationMs });
        dbHealthy = false;
      } else {
        dbChecks.push({ table, status: "ok", durationMs });
      }
    }
  } else {
    dbHealthy = false;
    dbChecks.push({
      table: "_connection",
      status: "fail",
      error: "Supabase 環境変数が未設定",
      durationMs: 0,
    });
  }

  const allHealthy = dbHealthy && envHealthy;
  const status = allHealthy ? "healthy" : "degraded";
  const httpStatus = allHealthy ? 200 : 503;
  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status,
      version: readAppVersion(),
      checks: {
        db: dbChecks,
        env: envResults,
      },
      responseTimeMs,
    },
    { status: httpStatus }
  );
}
