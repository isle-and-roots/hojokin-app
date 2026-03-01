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

## Phase 17: AI補助金チャットアドバイザー

**目標**: 対話型AI相談で補助金初心者の疑問を即解決 → Free→有料転換率 +3%
**FinOps精査済み**: プラン別モデル選択 + Prompt Caching + 日次レート制限

### FinOps サマリー

| Plan | 月額 | チャットモデル | 日次上限 | 平均粗利率 |
|------|------|-------------|---------|----------|
| Free | ¥0 | Haiku 4.5 | 3/日 | — (転換フック) |
| Starter | ¥980 | Haiku 4.5 | 10/日 | 83% |
| Pro | ¥2,980 | Sonnet 4 | 20/日 | 66% |
| Business | ¥9,800 | Sonnet 4 | 50/日 | 61% |

コスト最適化: Prompt Caching (~7,900トークン/90%削減) + 会話履歴20メッセージ上限

### Sprint A: チャット基盤 (Required)

#### Task 96: チャットUI + ストリーミングAPI [feature:security]
- [ ] `/chat` ページ新規作成 (Server Component + Client チャットUI)
- [ ] `POST /api/ai/chat` — Claude API streaming (ReadableStream)
- [ ] チャットUI: メッセージ入力 → ストリーミング表示 (タイピングアニメーション)
- [ ] 認証必須、Zodバリデーション
- [ ] レート制限: Free 3/日(Haiku)、Starter 10/日(Haiku)、Pro 20/日(Sonnet)、Business 50/日(Sonnet)
- [ ] チャット用モデル選択: `src/lib/ai/chat-config.ts` (Haiku/Sonnet をプラン別に分岐)
- [ ] DBベースの日次カウント: `chat_messages` テーブルの当日user件数で制限
- **owns**: `src/app/(dashboard)/chat/page.tsx`, `src/app/api/ai/chat/route.ts`
- **done marker**: `/chat` でストリーミング回答が表示される

#### Task 97: 補助金ナレッジベース統合
- [ ] システムプロンプトに補助金データ105件のサマリーを埋め込み (~7,500トークン)
- [ ] `src/lib/ai/chat-prompt.ts` — チャット専用プロンプト（ペルソナ: 中小企業診断士）
- [ ] **Prompt Caching**: ペルソナ+ナレッジ (~7,900トークン) を `cache_control: { type: "ephemeral" }` でキャッシュ → 入力コスト90%削減
- [ ] ユーザープロフィール（業種・従業員数・年商）をコンテキストに注入 (動的部分、キャッシュ外)
- [ ] 会話履歴の注入上限: **最大20メッセージ** (超過分は古いものから除外)
- [ ] 該当補助金がある場合、補助金詳細ページへのリンクを回答に含める
- [ ] 回答に「申請書を作成する」CTAボタンを含める
- [ ] Datadog ログ: `input_tokens`, `output_tokens`, `cache_read_input_tokens` を記録
- **owns**: `src/lib/ai/chat-prompt.ts` (新規), `src/lib/ai/chat-config.ts` (新規)
- **done marker**: 業種を伝えると適切な補助金を提案、リンク付き

#### Task 98: 会話履歴の永続化
- [ ] `supabase/migrations/` — `chat_sessions` + `chat_messages` テーブル
- [ ] `GET /api/chat/sessions` — セッション一覧
- [ ] `GET /api/chat/sessions/[id]` — セッション内メッセージ取得
- [ ] チャットUI: サイドバーに過去の会話一覧表示
- [ ] 新規会話 / 既存会話の続き を選択可能
- **owns**: `supabase/migrations/`, `src/app/api/chat/`
- **done marker**: ページリロード後も会話が復元される

### Sprint B: インテリジェンス強化 (Recommended)

#### Task 99: スマート補助金レコメンド (チャット内)
- [ ] チャット回答内に「おすすめ補助金カード」をリッチ表示
- [ ] 補助金カード: 名前・補助率・上限額・締切・AI対応度 をインラインで表示
- [ ] カードクリック → 補助金詳細ページ or 申請書作成開始
- [ ] 「この補助金で申請書を作成」ワンクリックCTA
- **owns**: `src/components/chat/subsidy-recommendation-card.tsx` (新規)
- **done marker**: チャット内に補助金カードがリッチ表示される

#### Task 100: 申請書レビューモード
- [ ] チャットに申請書セクションのテキストを貼り付け → AIが改善提案
- [ ] 「このセクションの強みと弱み」を分析
- [ ] 「採択されやすくするための具体的な修正案」を提示
- [ ] Pro以上のみ利用可（Free/Starterはアップグレード促進）
- **owns**: チャットプロンプトの拡張
- **done marker**: 申請書テキストを入力すると改善提案が返る

#### Task 101: サイドバー + ダッシュボード統合
- [ ] ダッシュボードサイドバーに「AI相談」メニュー追加 (MessageSquare アイコン)
- [ ] ダッシュボードに「補助金について質問する」クイックアクションカード追加
- [ ] コマンドパレット (Cmd+K) に「AI相談を開始」アクション追加
- [ ] PostHog: chat_started, chat_message_sent, chat_subsidy_clicked イベント
- **owns**: `src/components/layout/sidebar.tsx`, `dashboard/page.tsx`
- **done marker**: サイドバー・ダッシュボード・Cmd+KからチャットにアクセスOK

### Sprint C: エンゲージメント (Optional)

#### Task 102: チャット起点のオンボーディング
- [ ] 初回ログイン時: 「まずはAIに相談してみましょう」CTA
- [ ] 初回チャットのサジェスト質問3つ表示
- [ ] チャット→補助金選択→申請書作成の導線を最適化
- **owns**: チャットUI内
- **done marker**: 初回ユーザーがチャットから自然に申請フローに移行

#### Task 103: FAQ自動学習 + よくある質問
- [ ] `/chat` ページ上部に「よくある質問」セクション (5-8件)
- [ ] クリックで即座にチャットに質問が入力される
- [ ] PostHog: 人気質問ランキングを収集
- **owns**: チャットUI内
- **done marker**: FAQ表示 + クリックでチャット開始

### 依存グラフ & 並列レーン

```
96 (チャットUI+API) → 97 (ナレッジ統合) → 98 (履歴永続化)
                                           → 99 (レコメンドカード)
                                           → 100 (レビューモード)
96 → 101 (サイドバー統合)
98 → 102 (オンボーディング)
98 → 103 (FAQ)
max_parallel: 3 (Round1: 96, Round2: 97+101, Round3: 98+99+100, Round4: 102+103)
```

---

## Phase 12-14 ✅ 完了 (圧縮)

**Phase 14** (130f510): UI/UX ポリッシュ — styles.ts + motion.tsx 新規、globals.css アニメーション、23ファイル変更
**Phase 13**: 報告書品質(準拠チェック・品質スコア・差分) + PDF日本語 + CI + StorageProvider (104 tests)
**Phase 12** (d07bdfa): 補助金DB移行(105件) + jGrants API v2自動取込 + 管理画面 (コスト ~$0.50/月)

### 技術メトリクス
APIルート 15本 / DBテーブル 5+3migration / ブログ 16本 / 補助金 105件(30 FULL AI) / テスト 104 / 課金 4プラン
