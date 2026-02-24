# Plans.md — hojokin-app

Updated: 2026-02-24

## 現状サマリー

- Phase 1（課金基盤）コード実装 100% 完了
- Vercel デプロイ済み: https://hojokin-app-beta.vercel.app
- Google ログイン動作確認済み
- **トップページ UI/UX 全面改修完了**（112件補助金・11セクション構成）
- **AI クレジット表示実装完了**（ダッシュボード + AI生成ページ）
- **法的ページ実装完了**（プライバシー・利用規約・特商法）
- **レート制限ユーティリティ実装完了**
- 未コミット変更 25 ファイルあり（要コミット）
- Stripe Webhook 本番未設定

---

## 完了済み

### ✅ トップページ UI/UX 全面改修

- `src/app/page.tsx` — 11セクション構成のフルLP（Hero / Stats / How It Works / Category Tabs / Popular Subsidies / AI Showcase / Pricing / FAQ / CTA / Footer）
- `src/lib/data/landing-stats.ts` — 補助金データから統計を動的算出（ハードコード排除）
- `src/components/landing/sticky-header.tsx` — ガラスモーフィズムのスティッキーヘッダー
- `src/components/landing/animated-counter.tsx` — IntersectionObserver カウントアップ
- `src/components/landing/category-tabs.tsx` — 9カテゴリのタブ切替ショーケース
- `src/components/landing/faq-accordion.tsx` — FAQ開閉アコーディオン
- `src/app/globals.css` — CSSアニメーション追加

### ✅ AI クレジット残数表示（旧 Task 2）

- `src/components/credit-display.tsx` — card/compact 2バリアント、色分けプログレスバー
- `src/app/(dashboard)/dashboard/page.tsx` — ダッシュボードに統合
- `src/app/(dashboard)/applications/new/page.tsx` — 残数0で生成ボタン無効化
- `src/app/api/user/plan/route.ts` — プラン情報取得API

### ✅ 法的ページ

- `src/app/legal/privacy/` — プライバシーポリシー
- `src/app/legal/terms/` — 利用規約
- `src/app/legal/tokushoho/` — 特定商取引法に基づく表記

### ✅ レート制限

- `src/lib/rate-limit.ts` — インメモリ Map + 時間窓制御

---

## Phase 1.5: 本番安定化（残タスク）

### Task 1: 未コミット変更をコミット `cc:TODO`

- **対象**: 15 変更ファイル + 10 新規ファイル/ディレクトリ
- **作業**: git add → commit（機能単位で分割コミット推奨）
  - コミット 1: Phase 1 課金基盤（Stripe / Auth / middleware 等）
  - コミット 2: トップページ UI/UX 改修（landing コンポーネント + page.tsx + CSS）
  - コミット 3: クレジット表示 + ユーザーAPI
  - コミット 4: 法的ページ + その他
- **理由**: 25ファイルの変更がローカルのみで Git 管理されていない

### Task 2: Stripe Webhook 本番設定確認 `pm:依頼中`

- **担当**: ユーザー作業（Stripe Dashboard）
- **作業**: Stripe Dashboard で Webhook URL を登録
  - URL: `https://hojokin-app-beta.vercel.app/api/webhooks/stripe`
  - イベント: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- **確認**: `STRIPE_WEBHOOK_SECRET` が Vercel 環境変数に設定済みか

### Task 3: AI 生成の動作確認 `pm:依頼中`

- **担当**: ユーザー作業（ブラウザテスト）
- ログイン後、プロフィール登録 → 補助金選択 → AI 生成を実行
- エラーがあれば修正
- Anthropic API キーが本番で動作するか確認

---

## Phase 2: 品質向上

### Task 4: エラーハンドリング改善 `cc:TODO`

- AI 生成エラー時のリトライ UI
- ネットワークエラー時のユーザーフレンドリーなメッセージ
- クレジット上限到達時のアップグレードモーダル表示

### Task 5: レスポンシブ対応 `cc:TODO`

- モバイル（375px）で全ページの表示確認・修正
- 申請書作成ページのモバイル対応（現在 12 カラムグリッド）
- トップページ新LPのモバイル実機確認

### Task 6: Business プラン Opus モデル対応 `cc:TODO`

- `src/app/api/ai/generate-section/route.ts` の TODO 解消
- Business プランは `claude-opus-4-6` を使用

### Task 7: テスト拡充 `cc:TODO`

- API ルートのテスト追加（認証、課金、AI 生成）
- E2E テスト基盤の検討

---

## Phase 3: グロース（SEO / コンテンツ / コンバージョン）

### Task 8: SEO メタデータ最適化 `cc:TODO`

- 全ページに固有の title / description 設定
- JSON-LD 構造化データ（補助金ページ）
- Open Graph / Twitter Card メタタグ

### Task 9: ブログ SEO 記事追加 `cc:TODO`

- 既存5記事に加え、主要キーワード記事を追加
- 「持続化補助金 書き方」「IT導入補助金 申請方法」等

### Task 10: コンバージョン最適化 `cc:TODO`

- AI生成上限到達時のフルスクリーンアップグレードモーダル
- 残数警告バナー（残り1回時）
- オンボーディングフロー（初回ユーザー向けガイド）

---

## 依存関係

```
Task 1 (コミット) → デプロイの前提
Task 2 (Stripe Webhook) → ユーザー作業
Task 3 (AI 動作確認) → ユーザー作業 → Task 2 完了後
Task 4-7 → Phase 2（Task 1 完了後）
Task 8-10 → Phase 3（Phase 2 主要タスク完了後）
```
