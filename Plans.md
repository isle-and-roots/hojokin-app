# Plans.md — hojokin-app

Updated: 2026-02-24

## 現状サマリー

- Phase 1 完了、Vercel デプロイ済み
- Phase 2 オンボーディングフロー — 完了
- **Phase 2.5 プロダクト品質向上 — 完了**
  - 統一トースト通知 + 確認ダイアログ
  - AI生成リトライ（指数バックオフ）+ エラー分類
  - Business → Opus モデル切替
  - 温度パラメータ最適化（0.3）
  - ものづくり補助金 FULL プロンプト対応
- FULL 対応補助金: 持続化(1) + IT導入(4) + ものづくり(1) = **6件**

---

## Phase 1.5: 本番安定化

### Task 1: 未コミット変更をコミット `cc:done`
### Task 2: Stripe Webhook 本番設定 `pm:依頼中`
### Task 3: AI 生成の動作確認 `pm:依頼中`

---

## Phase 2: オンボーディングフロー ✅ 完了

**目標**: 初回ユーザーがログインから3分以内にAI生成を体験
**結果**: 3ステップオンボーディング（プロフィール→補助金→AI生成）実装完了

### Task 4-10: 全完了

---

## Phase 2.5: プロダクト品質向上 ✅ 完了

### Task A: 統一トースト通知システム `cc:done`
### Task B: AI生成リトライ + エラーハンドリング強化 `cc:done`
### Task C: Business向けOpusモデル切替 + パラメータ最適化 `cc:done`
### Task D: ものづくり補助金 FULL プロンプト対応 `cc:done`

---

## 本番確認ガイド（ユーザー作業）

### 1. Stripe Webhook 本番設定
1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → 「エンドポイントを追加」
2. エンドポイント URL: `https://hojokin.isle-and-roots.com/api/webhooks/stripe`
3. イベント選択: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. 「エンドポイントを追加」をクリック
5. 表示される Webhook シークレット (`whsec_...`) を Vercel 環境変数 `STRIPE_WEBHOOK_SECRET` に設定
6. Vercel で再デプロイ

### 2. Stripe 価格 ID 設定
1. Stripe Dashboard → Products で各プランの Price ID を確認
2. Vercel 環境変数に設定:
   - `STRIPE_STARTER_PRICE_ID` — Starter ¥980/月
   - `STRIPE_PRO_PRICE_ID` — Pro ¥2,980/月
   - `STRIPE_BUSINESS_PRICE_ID` — Business ¥9,800/月

### 3. AI生成 動作確認チェックリスト
- [ ] ログインしてプロフィールを入力
- [ ] 補助金一覧から「持続化補助金」を選択し申請作成へ
- [ ] 「企業概要」セクションで AI 生成をクリック → テキストが生成される
- [ ] 生成中に「キャンセル」ボタンが表示される
- [ ] 全セクション一括生成が完了する
- [ ] 「保存」ボタンで申請書が保存される
- [ ] 申請一覧に保存した申請書が表示される
- [ ] 削除ボタン → 確認ダイアログが表示される（alert ではない）
- [ ] 料金ページでプラン変更ボタンが動作する

### 4. 今回の変更をデプロイ
```bash
git push origin main
```
Vercel が自動デプロイします。

---

## Phase 3: グロース

### Task 11: SEO メタデータ最適化 `cc:TODO`
### Task 12: ブログ SEO 記事追加 `cc:TODO`
### Task 13: コンバージョン最適化 `cc:TODO`
