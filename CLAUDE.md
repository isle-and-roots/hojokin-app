# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイドです。

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動（Next.js 16）
npm run build        # 本番ビルド — コミット前に必ず実行して確認
npm run lint         # ESLint（next core-web-vitals + typescript ルール）
npx vitest           # 全テスト実行（jsdom 環境）
npx vitest run       # テスト一括実行（CI モード）
npx vitest <file>    # 単一テストファイル実行
npx tsc --noEmit     # 型チェックのみ（出力なし）
```

**コミット前の品質ゲート:** `npx tsc --noEmit && npm run lint && npm run db:check && npm run build`

## アーキテクチャ概要

**補助金サポート** — AI（Claude）で中小企業の補助金申請書類を自動生成する SaaS アプリ。

**技術スタック:** Next.js 16 App Router / React 19 / TypeScript (strict) / Tailwind 4 / Supabase (DB + Auth) / Polar.sh (課金) / Anthropic Claude API

### ルートグループ

- `src/app/(auth)/` — ログインページ（Google OAuth のみ、メール/パスワード認証なし）。`/signup` は `/login` にリダイレクト。
- `src/app/(dashboard)/` — 認証必須の保護ルート: ダッシュボード、プロフィール、補助金、申請書、料金。middleware で認証チェック。
- `src/app/api/` — Route Handlers: AI 生成、課金、DOCX エクスポート、プロフィール、補助金、Webhook。
- `src/app/blog/` — SSG ブログ（Markdown + gray-matter + remark）。
- `src/app/legal/` — プライバシーポリシー、利用規約、特定商取引法。

### 主要データフロー

**認証:** Google OAuth → Supabase Auth → `/auth/callback` でコード交換 → `middleware.ts` が毎リクエスト `getUser()` でセッション検証。認証不要パス: `/login`, `/auth/callback`, `/pricing`, `/blog`, `/legal`。

**AI 生成:** `POST /api/ai/generate-section` → Zod バリデーション → 月間クォータチェック（DB: `user_profiles.ai_generations_used`）→ プロンプトルーターが専用プロンプト（JIZOKUKA, IT_DONYU）または GENERIC を `src/lib/ai/prompts/` から選択 → Claude API (Sonnet) → 使用回数をインクリメント → レスポンス返却。

**課金:** `/pricing` ページ → `POST /api/billing/checkout` で Polar Checkout セッション作成 → ユーザー決済 → Polar Webhook（`POST /api/webhooks/polar`）が Supabase Service Role Key（RLS バイパス）で `user_profiles.plan` を更新。ポータルは `POST /api/billing/portal`。

**補助金データ:** `src/lib/data/subsidies/` の静的 TypeScript ファイル（DB ではない）。15件以上、`index.ts` でインデックス。検索・フィルタロジックは `src/lib/subsidies.ts`。

### 重要なパターン

- **Supabase クライアント:** `src/lib/supabase/client.ts`（ブラウザ用）、`src/lib/supabase/server.ts`（SSR + Cookie 処理）。Webhook は Service Role Key を直接使用。
- **Polar シングルトン:** `src/lib/polar/config.ts` — 遅延初期化、リクエスト間で再利用。`getPolar()` で SDK クライアント取得。
- **プラン制御:** `src/lib/plans.ts` で Free/Starter/Pro/Business の制限を定義。`canUseFeature(plan, feature)` と `getAiLimit(plan)` がゲート関数。`getPlanKeyByProductId()` で Polar Product ID → PlanKey 逆引き。AI クォータは月次自動リセット。
- **レート制限:** `src/lib/rate-limit.ts` — インメモリ Map + 時間窓制御。現在は Checkout API で使用。AI 生成にも拡大予定。
- **バリデーション:** 全 API 入力を `src/lib/validations/` の Zod スキーマで検証。
- **プロンプト体系:** `src/lib/ai/prompts/index.ts` が `SubsidyType` でルーティング。JIZOKUKA と IT_DONYU は FULL 対応（専用プロンプト）、その他は GENERIC。ペルソナは常に「中小企業診断士」。
- **型定義:** 共有型はすべて `src/types/index.ts` — `BusinessProfile`, `SubsidyInfo`, 列挙型（`SubsidyCategory`, `SubsidyType`, `ApplicationStatus`, `PromptSupport` 等）。
- **CSS ユーティリティ:** `src/lib/utils.ts` の `cn()` — `clsx` + `tailwind-merge`。

### 環境変数

`.env.local.example` を参照。必須: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_MODE`, `POLAR_STARTER_PRODUCT_ID`, `POLAR_PRO_PRODUCT_ID`, `POLAR_BUSINESS_PRODUCT_ID`, `NEXT_PUBLIC_SITE_URL`。Supabase 環境変数が未設定の場合、middleware は認証チェックをスキップ（DB なしのローカル開発に対応）。

## コーディング規約

- **Server Components がデフォルト。** `"use client"` は状態・イベントが必要な場合のみ。
- **外部 UI ライブラリ禁止。** Tailwind 4 のみ。アイコン: Lucide React。
- **パスエイリアス:** `@/` → `./src/`
- **API レスポンス:** エラー時は `{ error: string }` + 適切な HTTP ステータス。ユーザー向けエラーメッセージは日本語。
- **認証チェックパターン:** 保護 API ルートは全て `supabase.auth.getUser()` を最初に呼び、ユーザーがいなければ 401 を返す。
- **`any` 型禁止** — `unknown` + 型ガードを使用。`// @ts-ignore` 禁止。`dangerouslySetInnerHTML` 禁止。

## DB Schema Safety

**背景:** コードが参照するカラムが DB に存在しない障害を防止するためのプロセス。

**カラム追加/変更フロー:**
1. `supabase/migrations/` にマイグレーション SQL 作成
2. `supabase db push` で本番 DB に適用
3. `scripts/check-schema.ts` の `EXPECTED_SCHEMA` を更新
4. `npm run db:check` で整合性を確認
5. デプロイ

**ルール:**
- DB カラム参照は `src/lib/db/` に集約する（API route で直接 `.select("column")` しない）
- 品質ゲートに `npm run db:check` を含める（CI でも手動でも必ず実行）
- `/api/health` エンドポイントが 6 時間ごとにカラム存在を自動検証


> 詳細なエージェント定義・収益モデル・ルーティング・ロードマップは `.claude/rules/` を参照:
> - `.claude/rules/agents.md` — HK0-HK5, MK0-MK4 エージェント定義
> - `.claude/rules/business.md` — 収益モデル・プラン定義・マーケティング戦略
> - `.claude/rules/workflow.md` — ルーティング・ロードマップ・禁止事項・デプロイ設定
