# Plans.md — hojokin-app

Updated: 2026-03-02

## 現状サマリー

- **Phase 1〜13 全完了** — プロダクト開発・DB移行・自動更新・品質基盤・デプロイ基盤完了
- 課金: Polar.sh (JPY対応済み)、payout設定完了（Identity審査中）
- SEO: 16記事 + JSON-LD + OGメタデータ + サイトマップ + FAQページ + 補助金診断LP
- FULL AI対応補助金: **30件** (経営革新・雇用調整 新規追加 + 17件 GENERIC→FULL昇格)
- Analytics: Vercel Analytics + SpeedInsights + PostHog + Datadog APM/LLM Observability/RUM
- LP: 11セクション + ソーシャルプルーフ + 信頼性バッジ + A/Bテスト CTA
- メール: Resend 7通ナーチャリングシーケンス + Vercel Cron 日次配信
- 補助金データ: DB移行済み(105件) + jGrants API日次自動取込(API v2互換修正済み) + 管理画面
- PDF: @react-pdf/renderer + NotoSansJP日本語フォント対応
- CI: GitHub Actions (tsc + lint + vitest + build) + スモークテスト
- 品質: 補助金準拠チェック + 品質スコア(A-F) + ドラフト差分 + StorageProvider

---

## 完了Phase一覧 (Phase 1-13)

| Phase | 概要 | Commit |
|-------|------|--------|
| 1-3 | Supabase統合 + Polar課金 + Google OAuth + AI生成 + Vercelデプロイ | — |
| 4-5 | Analytics・LP・OGP・パフォーマンス・プロフィール構造化入力 | — |
| 6 | グロース (ブログ13記事・メールキャプチャー・オンボーディング・料金ページ・upsell・A/B) | — |
| 7 | ユーザー獲得 (ブログCTA・SEO・診断LP・パートナーテンプレ・メールシーケンス) | — |
| 8 | CLAUDE.mdリファクタ + FULL AI拡充 (9→30件) | — |
| 9 | Datadog統合 (APM + LLM Observability + RUM + DevLog) | — |
| 10 | パフォーマンス改善 (AIストリーミング・動的インポート・スケルトンUI) | 7697bf0 |
| 11 | モバイルレスポンシブ + PWA | 0a417ab |
| 12 | 補助金データDB移行 + jGrants API自動取込 + 管理画面 | d07bdfa |
| 13 | 報告書品質(準拠チェック・品質スコア・差分) + PDF日本語 + デプロイ基盤(CI・ヘルス・ストレージ) | — |
| 14 | UI/UX ポリッシュ — アニメーション・スケルトン・デザインシステム基盤 | 130f510 |
| 15 | 本番ヘルスチェック — health API, 公開ページ, 認証, API, Cron, テスト全PASS | — |
| 16 | CX最適化 — 業種選択・デモ生成・ツアー・チェックリスト・通知・Cmd+K | 1102e9e |

### 未実装手動タスク

| # | タスク | 状態 |
|---|--------|------|
| Task 22 | 実決済E2Eテスト | Polar Identity審査完了後 |
| Task 40 | X/Twitter 5投稿 | WIP (docs/twitter-drafts.md) |
| Task 41 | note.com 記事投稿 | WIP (docs/note-article-draft.md) |
| Task 42 | Google Search Console 設定 | WIP (docs/search-console-setup.md) |

### Vercel 環境変数（要設定）

| 変数名 | 用途 |
|--------|------|
| `RESEND_API_KEY` | メール送信 |
| `CRON_SECRET` | Cron認証 |
| `EMAIL_FROM` | 送信元アドレス |

PostHog: `hero-cta-text` Feature Flag 作成（control / variant_a）

---

## Phase 15 ✅ 完了: 本番ヘルスチェック

Task 81-87 全完了: health API healthy, 公開9ページ200, 認証307リダイレクト正常, API 401/200正常, Cron 3ジョブ確認, vitest 104テスト全パス + tsc + lint + db:check PASS

---

## Phase 16 ✅ 完了: CX最適化

Task 88a-95 全完了 (1102e9e): 業種選択UI + quick-recommend API, デモ生成(cached), ダッシュボード空状態リデザイン, SpotlightTour, チェックリスト強化, 成功アニメーション, コンテキストヘルプ, スマート通知, コマンドパレット(Cmd+K) — 19ファイル変更, 2641行追加

---

## Phase 17 ✅ 完了: AI補助金チャットアドバイザー

Task 96-103 全完了 (2291e8d): チャットUI+ストリーミングAPI, 補助金105件ナレッジベース+Prompt Caching, 会話履歴永続化, レコメンドカード, 申請書レビューモード(Pro以上), サイドバー・ダッシュボード・Cmd+K統合, オンボーディングCTA, FAQ 8件 — 17ファイル変更, 1613行追加
FinOps: Free/Starter→Haiku, Pro/Business→Sonnet, 日次制限 3/10/20/50, 平均粗利率 61-83%

---

## Phase 12-14 ✅ 完了 (圧縮)

**Phase 14** (130f510): UI/UX ポリッシュ — styles.ts + motion.tsx 新規、globals.css アニメーション、23ファイル変更
**Phase 13**: 報告書品質(準拠チェック・品質スコア・差分) + PDF日本語 + CI + StorageProvider (104 tests)
**Phase 12** (d07bdfa): 補助金DB移行(105件) + jGrants API v2自動取込 + 管理画面 (コスト ~$0.50/月)

---

## Phase 18 ✅ 完了: Web Vitals 最適化

Task: LCP/CLS/INP改善 (b89a231)
- Phase 1 (LCP): Hero StaggerContainer→plain div + CSS animation、Noto Sans JP preload有効化
- Phase 2 (CLS): AnimatedCounter SSR初期値をtargetに、FloatingCircle CSS animation化
- Phase 3 (INP): AiTypewriterDemo/RoiCalculator/ExitIntentModal動的インポート、タイピング5文字バッチ化、StickyHeader RAFスロットリング
- 8ファイル変更(1新規)、111テスト全パス、ビルド成功

### 技術メトリクス
APIルート 15本 / DBテーブル 5+3migration / ブログ 16本 / 補助金 105件(30 FULL AI) / テスト 111 / 課金 4プラン
