/**
 * Vercel 環境変数同期スクリプト
 *
 * .env.local の Polar 関連環境変数を Vercel プロジェクトに設定する。
 *
 * 前提:
 *   - Vercel CLI がインストール済み (`npm i -g vercel`)
 *   - `vercel login` でログイン済み
 *   - `vercel link` でプロジェクトがリンク済み
 *
 * 実行: npm run setup:polar:vercel
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

// ---------- 同期対象の環境変数キー ----------

const POLAR_ENV_KEYS = [
  "POLAR_ACCESS_TOKEN",
  "POLAR_WEBHOOK_SECRET",
  "POLAR_MODE",
  "POLAR_STARTER_PRODUCT_ID",
  "POLAR_PRO_PRODUCT_ID",
  "POLAR_BUSINESS_PRODUCT_ID",
] as const;

// ---------- メイン ----------

function main() {
  console.log("\n========================================");
  console.log("  Vercel 環境変数同期");
  console.log("========================================\n");

  // 1. Vercel CLI 存在チェック
  try {
    execSync("vercel --version", { stdio: "pipe" });
  } catch {
    console.error("Vercel CLI が見つかりません。");
    console.error("  インストール: npm i -g vercel");
    console.error("  ログイン:     vercel login");
    console.error("  リンク:       vercel link");
    process.exit(1);
  }

  // 2. .env.local を読み込み
  const envPath = resolve(process.cwd(), ".env.local");
  let envContent: string;

  try {
    envContent = readFileSync(envPath, "utf-8");
  } catch {
    console.error(`.env.local が見つかりません: ${envPath}`);
    process.exit(1);
  }

  // 環境変数をパース（コメント行とバックアップ行を除外）
  const envVars = new Map<string, string>();
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex);
    const value = trimmed.slice(eqIndex + 1);
    envVars.set(key, value);
  }

  // 3. 対象の環境変数を収集
  const updates: Array<{ key: string; value: string }> = [];
  const missing: string[] = [];

  for (const key of POLAR_ENV_KEYS) {
    const value = envVars.get(key);
    if (value && value !== `YOUR_${key}`) {
      updates.push({ key, value });
    } else {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.log("  [WARN] 以下の変数が .env.local に未設定です:");
    for (const key of missing) {
      console.log(`    - ${key}`);
    }
    console.log("");
  }

  if (updates.length === 0) {
    console.error("  同期する環境変数がありません。");
    process.exit(1);
  }

  // 4. Vercel に環境変数を設定
  console.log("--- Vercel 環境変数を設定中 ---\n");

  let successCount = 0;
  let errorCount = 0;

  for (const { key, value } of updates) {
    const displayValue = key.includes("SECRET") || key.includes("TOKEN")
      ? `${value.slice(0, 8)}...`
      : value;

    try {
      // まず既存の値を削除（エラーは無視）
      try {
        execSync(
          `vercel env rm ${key} production -y`,
          { stdio: "pipe" }
        );
      } catch {
        // 存在しない場合は無視
      }

      // 新しい値を設定（printf で末尾改行なし）
      execSync(
        `printf '%s' "${value}" | vercel env add ${key} production`,
        { stdio: "pipe" }
      );

      console.log(`  [OK] ${key}=${displayValue}`);
      successCount++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  [ERROR] ${key}: ${message}`);
      errorCount++;
    }
  }

  // 5. サマリー
  console.log(`\n========================================`);
  console.log(`  同期完了: ${successCount} 成功, ${errorCount} 失敗`);
  console.log(`========================================\n`);

  if (errorCount > 0) {
    console.log("  エラーが発生しました。以下を確認してください:");
    console.log("    - vercel login でログイン済みか");
    console.log("    - vercel link でプロジェクトがリンク済みか");
    process.exit(1);
  }

  console.log("次のステップ:");
  console.log("  vercel --prod で再デプロイしてください。");
}

main();
