# Plans.md — hojokin-app

Updated: 2026-02-25

## 現状サマリー

- **Phase 1〜3.5 全完了** — プロダクト開発完了、Vercel デプロイ済み
- 課金: Polar.sh (JPY対応済み)、本番セットアップ待ち
- SEO: 10記事 + JSON-LD + OGメタデータ + サイトマップ
- FULL AI対応補助金: 持続化(1) + IT導入(4) + ものづくり(1) = **6件**
- Analytics: Vercel Analytics + SpeedInsights + PostHog 25イベント実装済み
- LP: 11セクション構成のランディングページ完成
- OGP: メイン + ブログ記事別の動的OG画像 + Twitter Card設定済み

---

## Phase 4: 本番完全稼働 + ソフトローンチ準備

**目標**: 課金機能が動く本番環境を完成させ、最初のユーザー獲得を開始する
**期間目安**: 1-2週間（週2-3時間ペース）

### 優先度マトリクス

| 優先度 | タスク | 担当 | 状態 |
|--------|--------|------|------|
| **Required** | Task 20: 未コミット変更デプロイ | cc | done |
| **Required** | Task 21: Polar本番セットアップ | pm | TODO |
| **Required** | Task 22: 本番動作確認 | pm | TODO |
| **Recommended** | Task 23: Analytics基盤 | cc | done |
| **Recommended** | Task 24: トップページLP化 | cc | done |
| **Recommended** | Task 25: OGP画像 + ソーシャルカード | cc | done |
| **Recommended** | Task 26: パフォーマンス最適化 | cc | TODO |
| **Optional** | Task 27: SNS投稿テンプレート20本 | cc | TODO |
| **Optional** | Task 28: メールテンプレート準備 | cc | TODO |
| **Optional** | Task 29: ローンチ週プレイブック | cc | TODO |

### 実行順序（今回セッション）

```
Step 0: 未コミット変更をコミット（Task 23-25 実装分）
  ↓
Step 1: Task 26 パフォーマンス最適化
  ↓
Step 2: Task 27-29 コンテンツ生成（並列可能）
  ↓
Step 3: 全変更コミット + Plans.md 完了更新
```

---

### Task 20: 未コミット変更デプロイ `cc:done`
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

### Task 23: Analytics基盤（Vercel + PostHog） `cc:done`
**実装済み内容:**
- `@vercel/analytics` + `@vercel/speed-insights`: layout.tsx に配置
- `src/lib/analytics.ts`: Vercel Analytics カスタムイベントヘルパー
- PostHog: `src/lib/posthog/` (client.ts, server.ts, track.ts, events.ts) — 25イベント定義
- PostHogProvider + IdentifyUser + CaptureClick コンポーネント
- クライアント側: LP CTA, ログイン, 料金ページ, AI生成, DOCX, ブログ, クォータ
- サーバー側: AI生成, チェックアウト, Webhook(購読), DOCX, 認証コールバック

### Task 24: トップページ改善 (LP化) `cc:done`
**実装済み内容:**
- 11セクション構成: StickyHeader, Hero, Stats Bar, How It Works, Category Tabs, Popular Subsidies, AI Feature Showcase, Pricing Preview, FAQ, Final CTA, Footer
- モバイルファースト + レスポンシブ対応
- ログイン済みユーザーはダッシュボードにリダイレクト
- 動的データ: getLandingStats() で補助金数・カテゴリ数を自動反映

### Task 25: OGP画像 + ソーシャルカード `cc:done`
**実装済み内容:**
- `src/app/opengraph-image.tsx`: メイン動的OG画像（1200x630、ブランドカラー）
- `src/app/blog/[slug]/opengraph-image.tsx`: ブログ記事別の動的OG画像（タイトル・タグ反映）
- Twitter Card: summary_large_image 設定（layout.tsx metadata）
- OpenGraph metadata: layout.tsx で ja_JP ロケール設定

### Task 26: パフォーマンス最適化 `cc:done`
- Noto Sans JP フォント追加（preload: false）
- Viewport メタデータエクスポート追加
- next.config.ts: compress + 静的アセットキャッシュヘッダー（1年immutable）

### Task 27: SNS投稿テンプレート20本 `cc:done`
- content/social/twitter-templates.md（4カテゴリ × 5本 = 20本）

### Task 28: メールテンプレート準備 `cc:done`
- content/emails/nurture-sequence.md（Day 0〜30、7通シーケンス）
- Day 0: ウェルカム + クイックスタート
- Day 1: 「補助金選びのコツ」教育コンテンツ
- Day 3: 「AI 生成を試しましょう」直接リンク付き
- Day 7: Pro 機能ハイライト + 社会的証明
- Day 14: 締切の緊急性（該当補助金があれば）
- Day 21: 成功パターン / 事例
- Day 30: 期間限定アップグレードオファー
- 出力: `content/emails/nurture-sequence.md`

### Task 29: ローンチ週プレイブック `cc:done`
- content/marketing/launch-playbook.md（Day別アクション + チェックリスト + 成功基準）
