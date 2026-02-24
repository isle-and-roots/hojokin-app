/**
 * Polar.sh セットアップスクリプト（Sandbox / Production 両対応）
 *
 * 前提: .env.local に POLAR_ACCESS_TOKEN が設定済み
 *
 * 実行:
 *   Sandbox:    npx tsx scripts/setup-polar.ts
 *   Production: npx tsx scripts/setup-polar.ts --production
 *
 * 処理:
 *   1. モード判定（--production フラグ or POLAR_MODE 環境変数）
 *   2. Production 時は対話的確認（"yes" 入力必須）
 *   3. Polar SDK 初期化
 *   4. Products 3つ作成（冪等: 同名があればスキップ）
 *   5. Webhook エンドポイント作成（冪等: 同URL があればスキップ）
 *   6. .env.local を実際の値で更新（旧値はコメントでバックアップ）
 */

import { Polar } from "@polar-sh/sdk";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

// ---------- 型定義 ----------

type PolarMode = "sandbox" | "production";

// ---------- 設定 ----------

const WEBHOOK_URL =
  process.env.POLAR_WEBHOOK_URL ||
  "https://hojokin-app-beta.vercel.app/api/webhooks/polar";

// Polar はデフォルト通貨（USD）の価格が必須。JPY を表示通貨として追加。
// USD 価格は概算レート（1 USD ≈ 150 JPY）で設定。
const PRODUCTS = [
  { name: "Starter", priceUsdCents: 700, priceYen: 980, envKey: "POLAR_STARTER_PRODUCT_ID" },
  { name: "Pro", priceUsdCents: 2000, priceYen: 2980, envKey: "POLAR_PRO_PRODUCT_ID" },
  { name: "Business", priceUsdCents: 6500, priceYen: 9800, envKey: "POLAR_BUSINESS_PRODUCT_ID" },
] as const;

const WEBHOOK_EVENTS = [
  "subscription.created",
  "subscription.active",
  "subscription.updated",
  "subscription.canceled",
  "subscription.revoked",
] as const;

// ---------- ユーティリティ ----------

function detectMode(): PolarMode {
  // CLI フラグ優先
  if (process.argv.includes("--production")) return "production";
  if (process.argv.includes("--sandbox")) return "sandbox";

  // 環境変数フォールバック
  if (process.env.POLAR_MODE === "production") return "production";
  return "sandbox";
}

async function promptConfirmation(message: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });
}

// ---------- メイン ----------

async function main() {
  const mode = detectMode();
  const modeLabel = mode === "production" ? "PRODUCTION" : "Sandbox";

  console.log(`\n========================================`);
  console.log(`  Polar.sh ${modeLabel} セットアップ`);
  console.log(`========================================\n`);

  // Production 時は対話的確認
  if (mode === "production") {
    console.log("  *** 注意: Production モードで実行します ***");
    console.log("  実際の決済が発生する環境です。");
    console.log("  Products と Webhook が Polar 本番環境に作成されます。\n");

    const confirmed = await promptConfirmation(
      '  続行するには "yes" と入力してください: '
    );
    if (!confirmed) {
      console.log("\n  キャンセルしました。");
      process.exit(0);
    }
    console.log("");
  }

  // 1. 環境変数チェック
  const token = process.env.POLAR_ACCESS_TOKEN;
  if (!token || token === "YOUR_POLAR_ACCESS_TOKEN") {
    console.error(
      "POLAR_ACCESS_TOKEN が未設定です。先に Polar Dashboard で Access Token を作成してください。"
    );
    if (mode === "production") {
      console.error(
        "  Production 用トークン: https://polar.sh → Settings → Developers → Personal Access Tokens"
      );
    }
    process.exit(1);
  }

  console.log(`Polar SDK を初期化中 (${mode})...`);
  const polar = new Polar({
    accessToken: token,
    server: mode,
  });

  // 2. Products 作成（冪等）
  console.log("\n--- Products ---");
  const productIds: Record<string, string> = {};

  // 既存 Products を取得
  const existingProducts = new Map<string, string>();
  const productPages = await polar.products.list({});
  for await (const page of productPages) {
    for (const product of page.result.items) {
      existingProducts.set(product.name, product.id);
    }
  }

  for (const p of PRODUCTS) {
    const existing = existingProducts.get(p.name);
    if (existing) {
      console.log(`  [SKIP] ${p.name} は既に存在 (${existing})`);
      productIds[p.envKey] = existing;
      continue;
    }

    console.log(`  [CREATE] ${p.name} ($${(p.priceUsdCents / 100).toFixed(0)}/月 + ¥${p.priceYen.toLocaleString()}/月)...`);
    const product = await polar.products.create({
      name: p.name,
      recurringInterval: "month",
      prices: [
        {
          amountType: "fixed",
          priceAmount: p.priceUsdCents,
          priceCurrency: "usd",
        },
        {
          amountType: "fixed",
          priceAmount: p.priceYen,
          priceCurrency: "jpy",
        },
      ],
    });
    console.log(`  -> ID: ${product.id}`);
    productIds[p.envKey] = product.id;
  }

  // 3. Webhook 作成（冪等）
  console.log("\n--- Webhook ---");
  let webhookSecret: string | null = null;

  // 既存 Webhook を確認
  let existingWebhook: { id: string; secret: string } | null = null;
  const webhookPages = await polar.webhooks.listWebhookEndpoints({});
  for await (const page of webhookPages) {
    for (const wh of page.result.items) {
      if (wh.url === WEBHOOK_URL) {
        existingWebhook = { id: wh.id, secret: wh.secret };
        break;
      }
    }
    if (existingWebhook) break;
  }

  if (existingWebhook) {
    console.log(`  [SKIP] Webhook は既に存在 (${existingWebhook.id})`);
    webhookSecret = existingWebhook.secret;
  } else {
    console.log(`  [CREATE] Webhook → ${WEBHOOK_URL}`);
    const webhook = await polar.webhooks.createWebhookEndpoint({
      url: WEBHOOK_URL,
      format: "raw",
      events: [...WEBHOOK_EVENTS],
    });
    console.log(`  -> ID: ${webhook.id}`);
    webhookSecret = webhook.secret;
  }

  // 4. .env.local を更新
  console.log("\n--- .env.local 更新 ---");
  const envPath = resolve(process.cwd(), ".env.local");
  let envContent: string;

  try {
    envContent = readFileSync(envPath, "utf-8");
  } catch {
    console.error(`  .env.local が見つかりません: ${envPath}`);
    console.log("\n以下の値を手動で設定してください:");
    printEnvValues(productIds, webhookSecret, mode);
    return;
  }

  // 環境変数を置換（存在すれば更新、なければ追加）
  // Production 時は旧値をコメントでバックアップ
  const updates: Record<string, string> = {
    POLAR_MODE: mode,
    ...productIds,
  };
  if (webhookSecret) {
    updates["POLAR_WEBHOOK_SECRET"] = webhookSecret;
  }

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=(.*)$`, "m");
    const match = envContent.match(regex);

    if (match) {
      const oldValue = match[1];
      if (mode === "production" && oldValue && oldValue !== value) {
        // 旧値をコメントでバックアップ（既にバックアップがなければ）
        const backupComment = `# [sandbox backup] ${key}=${oldValue}`;
        if (!envContent.includes(`# [sandbox backup] ${key}=`)) {
          envContent = envContent.replace(regex, `${backupComment}\n${key}=${value}`);
        } else {
          envContent = envContent.replace(regex, `${key}=${value}`);
        }
      } else {
        envContent = envContent.replace(regex, `${key}=${value}`);
      }
      console.log(`  [UPDATE] ${key}=${value.slice(0, 20)}...`);
    } else {
      envContent += `\n${key}=${value}`;
      console.log(`  [ADD] ${key}=${value.slice(0, 20)}...`);
    }
  }

  writeFileSync(envPath, envContent);
  console.log(`  -> ${envPath} を保存しました`);

  // 5. サマリー
  console.log(`\n========================================`);
  console.log(`  Polar ${modeLabel} セットアップ完了!`);
  console.log(`========================================\n`);
  printEnvValues(productIds, webhookSecret, mode);

  if (mode === "production") {
    console.log("\n次のステップ:");
    console.log("  1. npm run setup:polar:vercel で Vercel 環境変数を同期");
    console.log("  2. vercel --prod で再デプロイ");
    console.log("  3. /pricing ページで Production チェックアウトを確認");
    console.log("  4. Polar Dashboard で Webhook 配信ログを確認");
  } else {
    console.log("\n次のステップ:");
    console.log("  1. npm run dev で開発サーバーを起動");
    console.log("  2. /pricing ページでチェックアウトをテスト");
    console.log("  3. Vercel に同じ環境変数を設定");
    console.log("  4. Vercel デプロイ後、Sandbox テスト決済を実行");
  }
}

function printEnvValues(
  productIds: Record<string, string>,
  webhookSecret: string | null,
  mode: PolarMode
) {
  console.log("環境変数:");
  console.log(`  POLAR_MODE=${mode}`);
  for (const [key, value] of Object.entries(productIds)) {
    console.log(`  ${key}=${value}`);
  }
  if (webhookSecret) {
    console.log(`  POLAR_WEBHOOK_SECRET=${webhookSecret}`);
  }
}

main().catch((err) => {
  console.error("セットアップエラー:", err);
  process.exit(1);
});
