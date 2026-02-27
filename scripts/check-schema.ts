/**
 * Pre-deploy スキーマチェック
 *
 * コードが参照する全カラムが本番 DB に存在するか検証する。
 * 不足カラムがあれば exit code 1 で失敗し、デプロイをブロックする。
 *
 * Usage: npm run db:check
 */

import { createClient } from "@supabase/supabase-js";

const EXPECTED_SCHEMA: Record<string, string[]> = {
  user_profiles: [
    "id",
    "plan",
    "polar_customer_id",
    "polar_subscription_id",
    "subscription_interval",
    "ai_generations_used",
    "ai_generations_reset_at",
    "created_at",
    "updated_at",
  ],
  business_profiles: [
    "id",
    "user_id",
    "company_name",
    "representative",
    "address",
    "phone",
    "email",
    "industry",
    "prefecture",
    "employee_count",
    "annual_revenue",
    "founded_year",
    "business_description",
    "products",
    "target_customers",
    "sales_channels",
    "strengths",
    "challenges",
    "created_at",
    "updated_at",
  ],
  applications: [
    "id",
    "user_id",
    "profile_id",
    "subsidy_id",
    "subsidy_name",
    "status",
    "requested_amount",
    "created_at",
    "updated_at",
  ],
  application_sections: [
    "id",
    "application_id",
    "section_key",
    "section_title",
    "order_index",
    "ai_generated_content",
    "user_edited_content",
    "final_content",
    "model_used",
    "generated_at",
    "created_at",
    "updated_at",
  ],
  email_leads: ["id", "email", "source", "created_at"],
};

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("ERROR: Supabase 環境変数が未設定です");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase.rpc("get_table_columns", {
    p_schema: "public",
  });

  if (error) {
    console.error("ERROR: get_table_columns RPC 呼び出し失敗:", error.message);
    console.error(
      "HINT: supabase db push でマイグレーションを適用してください"
    );
    process.exit(1);
  }

  // DB のカラムをテーブルごとにグループ化
  const actual = new Map<string, Set<string>>();
  for (const row of data as { table_name: string; column_name: string }[]) {
    if (!actual.has(row.table_name)) {
      actual.set(row.table_name, new Set());
    }
    actual.get(row.table_name)!.add(row.column_name);
  }

  let hasError = false;

  for (const [table, expectedColumns] of Object.entries(EXPECTED_SCHEMA)) {
    const actualColumns = actual.get(table);

    if (!actualColumns) {
      console.error(`MISSING TABLE: ${table}`);
      hasError = true;
      continue;
    }

    for (const col of expectedColumns) {
      if (!actualColumns.has(col)) {
        console.error(`MISSING COLUMN: ${table}.${col}`);
        hasError = true;
      }
    }
  }

  if (hasError) {
    console.error("\nSchema check FAILED");
    console.error(
      "上記の不足カラム/テーブルに対応するマイグレーションを作成してください"
    );
    process.exit(1);
  }

  console.log("Schema check PASSED");
}

main();
