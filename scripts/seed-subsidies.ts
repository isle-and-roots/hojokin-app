/**
 * 既存の静的補助金データをSupabaseにシード
 *
 * 冪等: 何度実行しても安全（UPSERT使用）
 * Usage: npx tsx scripts/seed-subsidies.ts
 */

import { createClient } from "@supabase/supabase-js";

// 静的データを直接インポート（tsconfig paths対応）
import { ALL_SUBSIDIES } from "../src/lib/data/subsidies/index";
import type { SubsidyInfo } from "../src/types/index";

function toDbData(s: SubsidyInfo) {
  return {
    id: s.id,
    name: s.name,
    name_short: s.nameShort,
    department: s.department,
    summary: s.summary,
    description: s.description,
    max_amount: s.maxAmount,
    min_amount: s.minAmount,
    subsidy_rate: s.subsidyRate,
    deadline: s.deadline,
    application_period_start: s.applicationPeriod?.start ?? null,
    application_period_end: s.applicationPeriod?.end ?? null,
    url: s.url,
    categories: s.categories,
    target_scale: s.targetScale,
    target_industries: s.targetIndustries,
    tags: s.tags,
    eligibility_criteria: s.eligibilityCriteria,
    excluded_cases: s.excludedCases,
    required_documents: s.requiredDocuments,
    application_sections: s.applicationSections,
    prompt_support: s.promptSupport,
    subsidy_type: s.subsidyType,
    popularity: s.popularity,
    difficulty: s.difficulty,
    is_active: s.isActive,
    last_updated: s.lastUpdated,
    source: "manual" as const,
    updated_at: new Date().toISOString(),
  };
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が必要です");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  console.log(`シード開始: ${ALL_SUBSIDIES.length} 件の補助金データ`);

  // バッチ20件ずつUPSERT
  const BATCH_SIZE = 20;
  let upserted = 0;
  let errors = 0;

  for (let i = 0; i < ALL_SUBSIDIES.length; i += BATCH_SIZE) {
    const batch = ALL_SUBSIDIES.slice(i, i + BATCH_SIZE);
    const rows = batch.map(toDbData);

    const { error } = await supabase
      .from("subsidies")
      .upsert(rows, { onConflict: "id" });

    if (error) {
      console.error(`バッチ ${i / BATCH_SIZE + 1} エラー:`, error.message);
      errors += batch.length;
    } else {
      upserted += batch.length;
      console.log(`  ${upserted} / ${ALL_SUBSIDIES.length} 完了`);
    }
  }

  console.log(`\nシード完了: ${upserted} 件成功, ${errors} 件エラー`);

  // 検証: DBのレコード数を確認
  const { count } = await supabase
    .from("subsidies")
    .select("*", { count: "exact", head: true });

  console.log(`DB内の補助金レコード数: ${count}`);

  if (errors > 0) {
    process.exit(1);
  }
}

main();
