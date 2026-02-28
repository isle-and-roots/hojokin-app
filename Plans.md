# Plans.md — hojokin-app

Updated: 2026-02-27

## 現状サマリー

- **Phase 1〜9 全完了** — プロダクト開発完了、Vercel デプロイ済み
- 課金: Polar.sh (JPY対応済み)、payout設定完了（Identity審査中）
- SEO: 16記事 + JSON-LD + OGメタデータ + サイトマップ + FAQページ + 補助金診断LP
- FULL AI対応補助金: **30件** (経営革新・雇用調整 新規追加 + 17件 GENERIC→FULL昇格)
- Analytics: Vercel Analytics + SpeedInsights + PostHog 28イベント + A/Bテスト基盤 + Datadog APM/LLM Observability/RUM
- LP: 11セクション + ソーシャルプルーフ + 信頼性バッジ + A/Bテスト CTA
- メール: Resend 7通ナーチャリングシーケンス + Vercel Cron 日次配信
- プロフィール: 構造化入力（ドロップダウン + ピルボタン） + 都道府県対応

---

## Phase 4-5 ✅ 完了

- **Phase 4** (Task 20-29): Analytics・LP・OGP・パフォーマンス・SNSテンプレ・プレイブック
- **Phase 5** (Task 30): プロフィール構造化入力・都道府県対応
- 残: Task 22 実決済E2Eテスト（Polar Identity審査完了後）

---

## Phase 6 ✅ 完了: グロース & コンバージョン最適化

**全9タスク完了** (Task 31-39)

| タスク | 状態 | 概要 |
|--------|------|------|
| Task 31: ブログ記事公開 + SEO | done | 10→13記事、RelatedPosts統合 |
| Task 32: メールキャプチャー | done | LP + Exit Intent + email_leads API |
| Task 33: オンボーディング改善 | done | プログレッシブプロファイリング + ウェルカムモーダル |
| Task 34: 料金ページ改善 | done | 年間/月間トグル + アンカープラン + FAQ強化 |
| Task 35: 新補助金FULL AI | done | 省力化・新事業進出・成長加速化の3件追加 |
| Task 36: アップセル導線強化 | done | DOCXペイウォール + クォータウィジェット + 品質比較 |
| Task 37: メールシーケンス | done | Resend 7通 + Vercel Cron + PostHogトラッキング |
| Task 38: A/Bテスト基盤 | done | PostHog Feature Flags + Hero CTA テスト |
| Task 39: ソーシャルプルーフ | done | FAQ反論3問 + 信頼性バッジ + FAQページ(JSON-LD) |

### Phase 6 品質ゲート ✅

```bash
npx tsc --noEmit    # ✅ 型エラーゼロ
npm run lint         # ✅ 警告ゼロ
npm run build        # ✅ ビルド成功
```

---

## Phase 8 ✅ 完了: 最適化 + FULL AI 拡充

**全5タスク完了** (Task 51-57、Task 53/54 はスキップ)

| タスク | 状態 | 概要 |
|--------|------|------|
| Task 51: CLAUDE.md リファクタリング | done | 610→87行、.claude/rules/ に3ファイル分割 |
| Task 52: content/drafts/ 削除 | done | 重複ドラフト9ファイル削除 |
| Task 53: console.log クリーンアップ | skip | console.log は0件（全て console.error = 本番監視用） |
| Task 54: .gitignore 整理 | skip | *.tsbuildinfo は既に .gitignore 済み |
| Task 55: 事業再構築 FULL AI | done | souzou-tenkan.ts 134行→194行に拡充、JIGYOU_SAIKOUCHIKU 対応 |
| Task 56: 設備投資 FULL AI | done | setsubi-toushi.ts 106行、SETSUBI_TOUSHI 新規型 |
| Task 57: 人材育成 FULL AI | done | jinzai-ikusei.ts 142行、JINZAI_IKUSEI 新規型 |
| Task 66: 経営革新 FULL AI | done | keiei-kakushin.ts 321行、KEIEI_KAKUSHIN 新規型追加 |
| Task 67: 雇用調整 FULL AI | done | koyou-chousei.ts 85行、KOYOU_CHOUSEI 新規型追加 |
| Task 68: 大量 GENERIC→FULL 昇格 | done | 17件の補助金データを GENERIC→FULL に昇格（jizokuka 359行・monodzukuri 249行等を大幅改善）|

### Phase 8 成果

| 指標 | Before | After | 改善 |
|------|--------|-------|------|
| CLAUDE.md | 610行 / 33KB | 87行 / 4KB | -86% |
| FULL AI 対応補助金 | 9件 | **30件** | +233% |
| セッションあたりトークン | ~15,000 | ~3,000 | -80% |
| SubsidyType 種類 | 13種 | **15種** | +KOYOU_CHOUSEI, KEIEI_KAKUSHIN |

### Phase 8 品質ゲート ✅

```bash
npx tsc --noEmit    # ✅ 型エラーゼロ
npm run lint         # ✅ 警告ゼロ
```

---

## Phase 7: ユーザー獲得 & 運用（次フェーズ）

**目標**: 初月50サインアップ、3ヶ月で有料5人、MRR ¥15,000
**戦略**: コンテンツマーケ + SNS + パートナーシップ

### 未実装タスク（マーケティング計画より）

| # | タスク | 種別 | 状態 |
|---|--------|------|------|
| Task 40 | X/Twitter 5投稿（締切アラート・記事シェア） | 手動 | WIP (docs/twitter-drafts.md 作成済み、投稿待ち) |
| Task 41 | note.com に記事1本投稿 | 手動 | WIP (docs/note-article-draft.md 作成済み、投稿待ち) |
| Task 42 | Google Search Console サイトマップ送信 | 手動 | WIP (docs/search-console-setup.md + middleware修正済み) |
| Task 43 | 週次ブログ記事3本追加 | cc | done |
| Task 44 | SEO最適化ラウンド1（メタデータ・内部リンク・サイトマップ強化） | cc | done |
| Task 45 | 「補助金診断」LP作成（/shindan — 3問→最適補助金表示） | cc | done |
| Task 46 | パートナーアウトレイチテンプレート作成（税理士・診断士・行政書士） | cc | done |
| Task 47 | ブログCTA最適化（中間CTA + 末尾CTA強化 + PostHogトラッキング） | cc | done |
| Task 48 | 12週レトロスペクティブ | cc | done |
| Task 49 | DBスキーマ不整合の再発防止プロセス（3レイヤー） | cc | done |
| Task 50 | email_leads テーブル本番追加（db:check で検出） | cc | done |

### Vercel 環境変数（要設定）

| 変数名 | 用途 | 状態 |
|--------|------|------|
| `RESEND_API_KEY` | メール送信 | 要設定 |
| `CRON_SECRET` | Cron認証 | 要設定 |
| `EMAIL_FROM` | 送信元アドレス | 要設定 |

### PostHog 設定（要設定）

- `hero-cta-text` Feature Flag 作成（control / variant_a）

---

## 12週レトロスペクティブ

Updated: 2026-02-28

### 達成サマリー

Phase 1〜7 の約12週間で、補助金申請AIサービス「補助金サポート」を0からフルプロダクトとしてリリース。課金基盤・AI生成・SEO・メール・A/Bテスト・DBスキーマ整合性管理まで一人開発で実装・本番デプロイ済み。

### 技術メトリクス

| 項目 | 数値 |
|------|------|
| APIルート数 | 15本（AI生成・課金・エクスポート・Cron・Webhook等） |
| DBテーブル数 | 5テーブル（schema.sql） + 3マイグレーション |
| ブログ記事数 | 16本 |
| 補助金データ数 | 105件（12カテゴリ） |
| FULL AI対応補助金 | 13件（持続化×1、IT導入×4、ものづくり×1、省力化×1、新事業進出×1、成長加速化×1、事業再構築×1、設備投資×1、人材育成×2） |
| AIプロンプト種類 | 10種（専用9 + 汎用1） |
| 課金プラン数 | 4プラン（Free / Starter ¥980 / Pro ¥2,980 / Business ¥9,800） |
| PostHogイベント数 | 約54イベント |
| メールシーケンス | 7通（Day 0/1/3/7/14/21/30） |
| 依存パッケージ | 24本（本番）+ 14本（開発） |
| 品質ゲートチェック | tsc + lint + db:check + build の4段階 |

### 良かった点

1. **スピード**: Phase 1〜7まで12週間でフルスタックSaaSを完成・本番デプロイ
2. **品質規律**: 全フェーズで tsc/lint/build の品質ゲートを通過し、型エラーゼロを維持
3. **段階的マネタイズ**: 課金・クォータ・ペイウォールの3レイヤーでFree→Pro転換導線を早期に構築
4. **SEOの早期着手**: ブログ16本・JSON-LD・サイトマップ・FAQページをPhase 4〜6で整備し、オーガニック流入基盤を確立
5. **DBスキーマ安全性**: db:check スクリプト + /api/health による自動検証で本番障害リスクを低減

### 改善が必要な点

1. **DBスキーマドリフト問題**: email_leads テーブルがコードより先行してデプロイされ、後からスキーマ追加が必要になった（Task 50）。マイグレーションファーストの徹底が不十分
2. **テスト不足**: 決済E2Eテスト（Task 22）がPolar Identity審査待ちで未完了。課金ロジックの自動テストが弱い
3. **メール配信未設定**: Resend APIキー・CRON_SECRETが本番環境変数に未設定のままでメールシーケンスが稼働していない
4. **SNS・note未実施**: Task 40〜42（X/Twitter投稿・note記事・Search Console）が手動タスクとして積み残し
5. **実ユーザーデータ不足**: サインアップ数・転換率・AI生成完了率など実績KPIが計測できていない状態でのリリース

### 学び

- **品質ゲートの早期導入効果**: tsc + lint + db:check を1コマンドにまとめた品質ゲートが、後半フェーズのバグ混入を防止した
- **静的データの強み**: 補助金データをDBではなくTypeScriptファイルで管理する設計が、型安全性・バージョン管理・デプロイ速度の面で有効だった
- **DBスキーマドリフトは発生する**: コードとDBの乖離は防止プロセスを持たないと確実に発生する。3レイヤー（migration + check script + health API）での対策が有効
- **マーケ施策は技術実装後に積み残しになりやすい**: 手動タスクは自動化できないため、スケジュールより意図的な優先付けが必要

### Phase 8 提案

| 優先度 | タスク | 根拠 |
|--------|--------|------|
| 高 | Vercel環境変数設定（Resend/Cron/Email） | メールシーケンス稼働でナーチャリング開始 |
| 高 | SNS・Search Console初期設定（Task 40-42） | オーガニック流入獲得の起点 |
| 高 | 実決済E2Eテスト（Task 22） | 課金フローの信頼性担保 |
| 中 | ユーザー獲得KPI計測ダッシュボード | 意思決定のためのデータ基盤 |
| ~~中~~ | ~~補助金FULL AI対応拡充（+3〜5件）~~ | ✅ Phase 8で完了 (9→13件) |
| 低 | リファラルプログラム実装 | パートナー獲得後に優先度上昇 |

---

## Phase 9: Datadog 統合基盤

| タスク | 状態 | 概要 |
|--------|------|------|
| Task 58: Datadog 統合基盤実装 | done | dd-trace + instrumentation.ts + src/lib/datadog/ + .env.local.example |
| Task 59: APMトレーシング + LLM Observability実装 | done | generate-section/applications/checkout の withSpan ラップ + LLM メトリクスログ |
| Task 60: Datadog RUM 実装 | done | @datadog/browser-rum インストール + DatadogRumInit コンポーネント + layout.tsx 統合 |
| Task 61: DevLog 全Phase作成 | done | docs/devlog/phase-0〜5.md 作成、各Phase の詰まり・学びを記録 |
| Task 62: 記事素材生成 | done | docs/article-source.md 作成 (Note記事「補助金AIアプリにDatadogを入れてわかったこと」の一次素材) |
| Task 63: Vercel Log Drain 設定 | manual | Vercel Dashboard > Integrations > Datadog から手動設定が必要 |
| Task 64: Datadog 環境変数設定 | manual | Vercel に DD_API_KEY / NEXT_PUBLIC_DD_CLIENT_TOKEN 等を追加 |
| Task 65: Dashboard & Alerts 設定 | manual | Datadog UI でモニター3件 + ダッシュボード作成 (docs/devlog/phase-5.md 参照) |

---

## Phase 10 ✅ 完了: パフォーマンス改善

**Commit**: 7697bf0

| タスク | 状態 | 概要 |
|--------|------|------|
| RUM サンプルレート削減 | done | sessionSampleRate 100→20, replaySampleRate 20→10, 開発環境無効化 |
| バンドルサイズ削減 | done | optimizePackageImports + UpgradeModal/DocxPaywallModal/docx 動的インポート |
| データ取得最適化 | done | loading.tsx スケルトンUI 4ファイル + useEffect Promise.all 並列化 |
| AI ストリーミング | done | SSE (anthropic.messages.stream) + ReadableStream 消費 + プログレッシブUI |

### Phase 10 品質ゲート ✅

```bash
npx tsc --noEmit    # ✅ 型エラーゼロ
npm run lint         # ✅ 警告ゼロ
npm run build        # ✅ 196ページ正常ビルド
```

### Phase 10 効果

| 項目 | Before | After |
|------|--------|-------|
| Datadog 監視通信 | 100% セッション | 20% (80%削減) |
| AI 生成表示 | 最大30秒無表示 | 2秒以内にテキスト開始 |
| ページ遷移 | 真っ白画面 | 即座にスケルトンUI |
| 初期データ取得 | 順次 (ウォーターフォール) | 並列 (Promise.all) |

---

## Phase 11 ✅ 完了: モバイルレスポンシブ + PWA

**Commit**: 0a417ab

| タスク | 状態 | 概要 |
|--------|------|------|
| PWA マニフェスト + アイコン | done | manifest.json + 3種アイコン (192/512/180) + layout.tsx metadata |
| /applications 一覧レスポンシブ | done | ヘッダー/行スタック化 + パディング調整 |
| /profile レスポンシブ | done | ステップインジケーター wrap + フォームグリッド 1col→2col + 確認グリッド |
| /applications/new レスポンシブ | done | モバイル横スクロールストリップ + lg:grid-cols-12 + loading.tsx |

### Phase 11 品質ゲート ✅

```bash
npx tsc --noEmit    # ✅ 型エラーゼロ
npm run lint         # ✅ 警告ゼロ
npm run build        # ✅ 196ページ正常ビルド
```

---

## ドキュメント作成タスク

- [ ] インフラコスト試算ドキュメント作成 `cc:WIP`
  - 依頼内容: docs/cost-estimation.md を指定内容で更新
  - 追加日時: 2026-03-01

- [ ] デモシナリオ集作成 `cc:WIP`
  - 依頼内容: docs/demo-scenarios.md を指定内容で更新
  - 追加日時: 2026-03-01

- [ ] 機能要件マトリクス作成 `cc:WIP`
  - 依頼内容: docs/feature-requirements-matrix.md を指定内容で更新
  - 追加日時: 2026-03-01

---

## Phase 12: 補助金データ自動更新機能（jGrants API連携）

**目標**: 静的TS→DB移行 + jGrants API日次自動取込 + 管理画面

| # | タスク | 状態 | 概要 |
|---|--------|------|------|
| Task 70 | DB移行: subsidies + ingestion_logs テーブル | done | マイグレーション + シードスクリプト + DBアクセスレイヤー |
| Task 71 | データソース切替 | done | DB優先+静的フォールバック、ISR、sitemap/landing-stats/shindan対応 |
| Task 72 | jGrants APIクライアント | done | 一覧/詳細取得、レート制限、ページネーション |
| Task 73 | AI抽出 + マッパー + パイプライン | done | Claude Haiku抽出、バッチ10件、50秒タイムアウト、品質チェック |
| Task 74 | Cronエンドポイント | done | /api/cron/subsidy-ingestion (毎日15:00 JST) |
| Task 75 | 管理画面 | done | is_admin、管理API CRUD、補助金テーブル+編集フォーム+取込パネル |
| Task 76 | ビルド検証 | done | tsc ✓ / lint ✓ / build ✓ (201 pages) / tests ✓ |
| Task 77 | Supabaseマイグレーション適用 | cc | `supabase db push` で本番DBに反映 |
| Task 78 | 補助金データシード | cc | `npx tsx scripts/seed-subsidies.ts` で既存105件をDBに投入 |
| Task 79 | Vercelデプロイ + 動作確認 | cc | git push → Vercel自動デプロイ → Cron/管理画面の動作確認 |

### Phase 12 新規ファイル (16件)

- `supabase/migrations/20260301000000_create_subsidies_table.sql`
- `supabase/migrations/20260301000001_add_admin_column.sql`
- `scripts/seed-subsidies.ts`
- `src/lib/db/subsidies.ts`, `src/lib/db/admin.ts`
- `src/lib/external/jgrants.ts`
- `src/lib/ingestion/{mapper,ai-extractor,pipeline,quality-check}.ts`
- `src/app/api/cron/subsidy-ingestion/route.ts`
- `src/app/api/admin/{subsidies,subsidies/[id],ingestion}/route.ts`
- `src/app/(dashboard)/admin/page.tsx`, `admin/subsidies/[id]/page.tsx`
- `src/components/admin/{subsidy-table,subsidy-form}.tsx`

### Phase 12 コスト

| 項目 | 月額 |
|------|------|
| Supabase (Free tier) | $0 |
| Claude Haiku (AI抽出 ~500件/月) | ~$0.50 |
| Vercel Cron | $0 |
| jGrants API | $0 |
| **合計** | **~$0.50/月** |

---

## 12週マーケティングスケジュール

- **Week 3-4** ← 現在: SNS初投稿(5本) + note.com + Search Console + はてブ
- **Week 5-8**: ブログ2本/週 + X 5投稿/週 + SEO最適化 + 内部リンク
- **Week 9-12**: 補助金診断LP + パートナー + CTA最適化 + レトロスペクティブ
- **期待成果**: ブログ23本、オーガニック500-1K/月、サインアップ10-50件
