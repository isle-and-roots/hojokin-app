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
| 15 | 本番ヘルスチェック — health API, 公開ページ, 認証, API, Cron, テスト全PASS | — |

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

## Phase 16: CX最適化 — 初回体験 & オンボーディング

**目標**: TTFV (Time-to-First-Value) 15分→2分短縮 + PostHog ファネル計測
**Phase 0 精査済み**: Planner分析 + Critic Red Teaming 反映

### Sprint A: TTFV短縮 & 初回体験 (Required)

#### Task 88a: 業種選択UI + quick-recommend API [feature:a11y]
- [ ] 初回ログイン時の業種選択UI (`dashboard/page.tsx` に条件分岐)
- [ ] `/api/subsidies/quick-recommend` — 業種→補助金3件マッチング (DBフィルタのみ、AI不使用)
- [ ] PostHog TTFV ファネル: signup→industry_select→first_recommend→first_generation
- **owns**: `dashboard/page.tsx`, `api/subsidies/quick-recommend/`
- **done marker**: 業種選択→3件レコメンド表示 + PostHogイベント発火

#### Task 88b: デモ生成体験 (cached sample)
- [ ] 補助金タイプ別のキャッシュ済みサンプル文章 (`src/lib/data/demo-samples.ts`)
- [ ] デモモードUI: 「サンプルを見る」ボタン → キャッシュ表示 (Claude API呼び出しなし)
- [ ] クォータ消費なし、本番APIコール一切なし (セキュリティ要件)
- [ ] 体験完了→プロフィール充実への誘導CTA
- **owns**: `demo-samples.ts`, `applications/new/page.tsx` (デモ部分のみ)
- **done marker**: デモ生成がキャッシュから即座表示、API呼び出しゼロ

#### Task 89: ダッシュボード空状態リデザイン
- [ ] ステータスカード「0件」→アクション誘導型カード (イラスト + CTA)
- [ ] プロフィール未作成時: 次ステップを1つだけ大きく表示
- [ ] クイックアクションとオンボーディングステッパーの重複解消
- **owns**: `dashboard/page.tsx` (空状態セクションのみ)
- **done marker**: 初回ダッシュボードがアクション誘導型

#### Task 90: プロダクトツアー (自前実装: framer-motion + Tailwind)
- [ ] SpotlightTour コンポーネント自作 (~200行、framer-motion AnimatePresence + Tailwind)
- [ ] 3ステップ: プロフィール→補助金検索→AI生成 (要素ハイライト + ツールチップ)
- [ ] スキップ可能 + localStorage「もう表示しない」
- [ ] PostHog: ツアー完了率・ステップ離脱計測
- **注意**: onborda不使用 (CLAUDE.md「外部UIライブラリ禁止」準拠)
- **owns**: `components/onboarding/spotlight-tour.tsx` (新規)
- **done marker**: 初回ログインでスポットライトツアー起動

### Sprint B: エンゲージメント向上 (Recommended)

#### Task 91: オンボーディングチェックリスト強化
- [ ] 既存 `OnboardingStepper` を進捗バー付きチェックリストに拡張
- [ ] 非表示条件: 全完了 or localStorage loginCount >= 3 (DB不要)
- [ ] 全完了時: confetti CSS アニメーション
- **owns**: `components/dashboard/onboarding-stepper.tsx`
- **done marker**: チェックリスト + 完了時アニメーション動作

#### Task 92: 成功体験アニメーション
- [ ] AI初回生成完了: CSS @keyframes confetti + 「最初の申請書セクション完成！」
- [ ] プロフィール100%完了: バッジ + メッセージ (AnimatePresence)
- [ ] 申請書全セクション完了: 祝福画面 + DOCXダウンロードCTA
- [ ] CSS @keyframes + framer-motion AnimatePresence (物理演算ライブラリ不使用)
- **owns**: `components/ui/confetti.tsx` (新規), `applications/new/page.tsx` (成功部分)
- **done marker**: 3つの成功体験アニメーション動作

#### Task 93: コンテキストヘルプ & 用語説明
- [ ] Tailwind ツールチップ: 「補助率」「上限額」「AI完全対応 vs AI対応」
- [ ] AI生成画面: セクション名にインラインヘルプ
- [ ] 「プロフィールが詳しいほど、AIが精密な申請書を生成します」明示
- **owns**: `components/ui/tooltip.tsx` (新規), subsidy関連ページ
- **done marker**: ツールチップ + ヘルプテキスト表示

### Sprint C: パワーユーザー & リテンション (Optional)

#### Task 94: スマート通知 (アプリ内)
- [ ] 締切7日前バナー、申請書3日未更新ナッジ、新FULL補助金通知
- **owns**: `components/dashboard/smart-notifications.tsx` (新規)
- **done marker**: ダッシュボードにスマート通知バナー表示

#### Task 95: コマンドパレット (Cmd+K) [feature:a11y]
- [ ] 自前実装: Tailwind モーダル + ファジー検索 (cmdk不使用、外部UIライブラリ禁止準拠)
- [ ] 補助金名検索→詳細ジャンプ、クイックアクション
- [ ] 全プランで基本機能利用可、Free は upgrade modal 表示で高度機能制限
- **owns**: `components/ui/command-palette.tsx` (新規), `dashboard/layout.tsx`
- **done marker**: Cmd+K でパレット起動

### 依存グラフ & 並列レーン

```
Lane A (critical): 88a → 88b → 89 → 91 → 90
Lane B (独立):     92 (成功アニメーション)
Lane C (serial):   93 → 94
Lane D (独立):     95 (Cmd+K)
max_parallel: 3 (Round1: 88a+92+95, Round2: 88b+93, Round3: 89+94, Round4: 91→90)
```

### 技術選定 (Phase 0 精査済み)

| 用途 | 実装方法 | 理由 |
|------|---------|------|
| プロダクトツアー | **自前** (framer-motion + Tailwind) | CLAUDE.md「外部UIライブラリ禁止」準拠 |
| 成功アニメーション | **CSS @keyframes + AnimatePresence** | 物理演算不要、軽量 |
| コマンドパレット | **自前** (Tailwind モーダル) | cmdk も外部UIに該当、自前で十分 |
| ツールチップ | **Tailwind CSS** | 外部依存不要 |
| デモ生成 | **キャッシュ済みサンプル** | セキュリティ: Claude API 不使用 |
| TTFV計測 | **PostHog ファネル** | 既存PostHog活用 |

---

## Phase 12-14 ✅ 完了 (圧縮)

**Phase 14** (130f510): UI/UX ポリッシュ — styles.ts + motion.tsx 新規、globals.css アニメーション、23ファイル変更
**Phase 13**: 報告書品質(準拠チェック・品質スコア・差分) + PDF日本語 + CI + StorageProvider (104 tests)
**Phase 12** (d07bdfa): 補助金DB移行(105件) + jGrants API v2自動取込 + 管理画面 (コスト ~$0.50/月)

### 技術メトリクス
APIルート 15本 / DBテーブル 5+3migration / ブログ 16本 / 補助金 105件(30 FULL AI) / テスト 104 / 課金 4プラン
