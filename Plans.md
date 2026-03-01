# Plans.md — hojokin-app

Updated: 2026-03-01

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

## Phase 14 ✅ 完了: UI/UX ポリッシュ

### 概要
Phase 13 完了後の全体的なビジュアルポリッシュ。アニメーション基盤、スケルトンUI改善、ページ遷移、デザインシステム統一。

### コミット (3件)
| コミット | 内容 |
|---------|------|
| c1d38aa | デザインシステム基盤 — styles.ts + motion.tsx + globals.css アニメーション |
| 15f4ecf | ページレベル UI — PageTransition, スケルトン shimmer, 締切カウントダウン |
| 130f510 | コンポーネント UI — サイドバー・カード・モーダル・トースト改善 |

### 新規ファイル (2件)
- `src/lib/styles.ts` — カード・ボタン・バッジのスタイルバリアント
- `src/components/ui/motion.tsx` — Framer Motion ラッパー (PageTransition, AnimatedGrid, FadeInUp)

### 変更ファイル (23件)
globals.css, auth layout/login, dashboard/applications/subsidies/profile pages, 4 loading skeletons, sidebar, plan-badge, quota-widget, welcome-modal, subsidy-card/list/search-page, pricing-page, billing-page, confirm-dialog, toast, upgrade-modal

---

## Phase 13 ✅ 完了: Sprint 5-6 (品質・デプロイ基盤)

### Sprint 5: 報告書生成品質向上

| タスク | 状態 | 概要 |
|--------|------|------|
| 補助金ルール準拠チェック | done | src/lib/reports/compliance.ts — セクション別文字数・数値・キーワード検証 (9 tests) |
| 生成品質評価スコア | done | src/lib/reports/quality-score.ts — 5軸加重スコア (A-F) + QualityBadge UI (14 tests) |
| ドラフト差分表示 | done | src/lib/reports/diff.ts — LCS差分 + ReportDiffView UI (14 tests) |
| PDF日本語フォント + レイアウト | done | @react-pdf/renderer + NotoSansJP (CDN) + A4レイアウト |
| PDFパフォーマンステスト | done | < 3秒 / < 5MB / 1-12セクション対応 (3 tests) |

### Sprint 6: 低コスト本番デプロイ

| タスク | 状態 | 概要 |
|--------|------|------|
| 環境変数チェック拡張 | done | src/lib/env-check.ts — 11必須 + 6任意の検証 (10 tests) |
| /api/health 強化 | done | DB + env + timing + version |
| スモークテスト + CI | done | scripts/smoke-test.ts + .github/workflows/{ci,smoke-test}.yml |
| StorageProvider抽象化 | done | src/lib/storage/provider.ts — Supabase + Vercel Blob stub (12 tests) |
| インフラコスト試算 | done | docs/cost-estimation.md |
| デモシナリオ集 | done | docs/demo-scenarios.md (会計事務所 / コンサル) |
| 機能要件マトリクス | done | docs/feature-requirements-matrix.md (SaaS / OEM / 代行) |

### Phase 13 新規ファイル (20件)

- `src/lib/reports/{compliance,quality-score,diff}.ts` + テスト3件
- `src/lib/pdf/{font-config,styles}.ts`, `application-pdf.tsx` + テスト1件
- `src/app/api/export/pdf/route.ts`
- `src/components/applications/{quality-badge,report-diff-view}.tsx`
- `src/lib/{env-check,storage/provider}.ts` + テスト2件
- `scripts/smoke-test.ts` + `.github/workflows/{ci,smoke-test}.yml`
- `docs/{cost-estimation,demo-scenarios,feature-requirements-matrix}.md`

### Phase 13 品質ゲート ✅

```
104 tests passed | tsc ✅ | lint ✅ | build ✅
```

---

## Phase 12 詳細: 補助金データ自動更新

**目標**: 静的TS→DB移行 + jGrants API日次自動取込 + 管理画面

| # | タスク | 状態 |
|---|--------|------|
| Task 70-71 | DB移行 + データソース切替 | done |
| Task 72-74 | jGrants APIクライアント + AI抽出 + Cron | done |
| Task 75 | 管理画面 (CRUD + 取込パネル) | done |
| Task 76-79 | ビルド検証 + DB push + シード + デプロイ | done |
| Task 80 | jGrants API v2 互換性修正 (パラメータ・型・バッチ処理) | done (7e99a9b) |

コスト: Supabase Free $0 + Claude Haiku ~$0.50/月 + Vercel Cron $0 = **~$0.50/月**

---

## 12週レトロスペクティブ要約

### 技術メトリクス

| 項目 | 数値 |
|------|------|
| APIルート | 15本 | DBテーブル | 5 + 3マイグレーション |
| ブログ記事 | 16本 | 補助金データ | 105件 (12カテゴリ) |
| FULL AI対応 | 30件 | プロンプト種類 | 10種 |
| 課金プラン | 4 (Free/Starter/Pro/Business) | PostHogイベント | ~54 |
| メールシーケンス | 7通 | テスト数 | 104 |

### 学び

- 品質ゲート (tsc + lint + db:check + build) の早期導入がバグ混入を防止
- 静的TypeScriptデータ管理が型安全性・バージョン管理・デプロイ速度に有効
- DBスキーマドリフトは3レイヤー (migration + check script + health API) で対策
- マーケ手動タスクは意図的な優先付けが必要

---

## 12週マーケティングスケジュール

- **Week 3-4** ← 現在: SNS初投稿(5本) + note.com + Search Console + はてブ
- **Week 5-8**: ブログ2本/週 + X 5投稿/週 + SEO最適化 + 内部リンク
- **Week 9-12**: 補助金診断LP + パートナー + CTA最適化 + レトロスペクティブ
- **期待成果**: ブログ23本、オーガニック500-1K/月、サインアップ10-50件
