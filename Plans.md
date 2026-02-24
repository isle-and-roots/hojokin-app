# Plans.md — hojokin-app

Updated: 2026-02-25

## 現状サマリー

- **Phase 1〜3.5 全完了** — プロダクト開発完了、Vercel デプロイ済み
- 課金: Polar.sh (JPY対応済み)、本番セットアップ待ち
- SEO: 10記事 + JSON-LD + OGメタデータ + サイトマップ
- FULL AI対応補助金: 持続化(1) + IT導入(4) + ものづくり(1) = **6件**

### 未デプロイ変更 (Phase 3.5)
eslint.config.mjs, proxy.ts新規, middleware.ts削除, 各コンポーネント修正 (12ファイル)
品質ゲート通過済み（tsc + lint + build）

---

## Phase 4: 本番完全稼働 + ソフトローンチ準備

**目標**: 課金機能が動く本番環境を完成させ、最初のユーザー獲得を開始する
**期間目安**: 1-2週間（週2-3時間ペース）

### 優先度マトリクス

| 優先度 | タスク | 担当 | 見積 |
|--------|--------|------|------|
| **Required** | Task 20: 未コミット変更デプロイ | cc | 5分 |
| **Required** | Task 21: Polar本番セットアップ | pm | 10分 |
| **Required** | Task 22: 本番動作確認 | pm | 15分 |
| **Recommended** | Task 23: Vercel Analytics 導入 | cc | 30分 |
| **Recommended** | Task 24: トップページ改善 (LP化) | cc | 1h |
| **Recommended** | Task 25: OGP画像 + ソーシャルカード | cc | 30分 |
| **Recommended** | Task 26: パフォーマンス最適化 | cc | 30分 |
| **Optional** | Task 27: SNS投稿テンプレート20本 | cc | 1h |
| **Optional** | Task 28: メールテンプレート準備 | cc | 1h |
| **Optional** | Task 29: ローンチ週プレイブック | cc | 30分 |

---

### Task 20: 未コミット変更デプロイ `cc:TODO` [feature:security]
Phase 3.5 の技術的負債修正（ESLint互換性、Zod型安全化、middleware→proxy移行、エラーハンドリング統一）をコミット＆プッシュ → Vercel 自動デプロイ。
- 対象: 12ファイル（eslint.config.mjs, proxy.ts新規, middleware.ts削除, 各コンポーネント修正）
- 品質ゲート再確認してからコミット

### Task 21: Polar本番セットアップ `pm:TODO`
ユーザー作業（約10分、スクリプト自動化済み）:
1. https://polar.sh → Settings → Developers → Personal Access Tokens で本番トークン取得
2. `.env.local` に `POLAR_ACCESS_TOKEN=polar_oat_PRODUCTION_TOKEN` を設定
3. `npm run setup:polar:production` 実行（Products 3つ + Webhook 自動作成）
4. `npm run setup:polar:vercel` 実行（Vercel 環境変数を自動同期）
5. `vercel --prod` で再デプロイ

### Task 22: 本番動作確認 `pm:TODO`
ユーザーが本番環境で以下を確認:
- [ ] Google ログイン動作
- [ ] プロフィール入力 → 保存
- [ ] AI 生成動作（持続化補助金・企業概要セクション）
- [ ] 料金ページ → Polar チェックアウト（JPY表示）
- [ ] Polar ダッシュボードで Webhook 配信ログ確認

### Task 23: Vercel Analytics 導入 `cc:TODO`
ユーザー行動とパフォーマンスを計測可能にする。
- `@vercel/analytics` + `@vercel/speed-insights` インストール
- `src/app/layout.tsx` に `<Analytics />` + `<SpeedInsights />` 追加
- カスタムイベント: ai_generation, upgrade_clicked, checkout_started, profile_completed
- イベント送信ヘルパー `src/lib/analytics.ts` 作成

### Task 24: トップページ改善 (LP化) `cc:TODO`
未ログインユーザー向けランディングページ化。
- ファーストビュー: キャッチコピー + CTA「無料で始める」
- 3ステップ説明 + 対応補助金数・記事数の実績表示
- 料金プラン概要 → /pricing 誘導
- ログイン済みはダッシュボードにリダイレクト
- モバイルファースト設計

### Task 25: OGP画像 + ソーシャルカード `cc:TODO`
SNS シェア時の表示を最適化。
- `public/og-default.png` (1200x630) メイン OG 画像
- Twitter Card: summary_large_image 設定
- 各ページの og:image メタデータ設定

### Task 26: パフォーマンス最適化 `cc:TODO`
Core Web Vitals 改善 → SEO ランキング向上。
- next/image, next/font 最適化
- 不要な Client Component の Server Component 化
- Bundle size 分析 + Lighthouse スコア改善

### Task 27: SNS投稿テンプレート20本 `cc:TODO`
X/Twitter 向け投稿テンプレート（MK0 コンテンツ戦略）。
- 補助金締切リマインダー × 5、ブログ記事紹介 × 5、サービス紹介 × 5、Tips × 5
- 出力: `content/social/twitter-templates.md`

### Task 28: メールテンプレート準備 `cc:TODO`
MK1 ナーチャリングシーケンス（Day 0〜30 の 7通）。
- ウェルカム → 教育 → 試用促進 → Pro訴求 → 締切緊急性 → 成功事例 → オファー
- 出力: `content/emails/nurture-sequence.md`

### Task 29: ローンチ週プレイブック `cc:TODO`
ソフトローンチの日別アクションプラン（MK4 ローンチ管理）。
- ProductHunt/BOXIL掲載、SNS投稿、note.comクロスポスト、はてブ対策
- 出力: `content/marketing/launch-playbook.md`
