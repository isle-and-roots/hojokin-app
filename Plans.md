# Plans.md — hojokin-app

Updated: 2026-02-26

## 現状サマリー

- **Phase 1〜5 全完了** — プロダクト開発完了、Vercel デプロイ済み
- 課金: Polar.sh (JPY対応済み)、本番技術セットアップ完了、payout設定完了（Identity審査中）、決済フォーム有効化確認済み
- SEO: 10記事 + JSON-LD + OGメタデータ + サイトマップ
- FULL AI対応補助金: 持続化(1) + IT導入(4) + ものづくり(1) = **6件**
- Analytics: Vercel Analytics + SpeedInsights + PostHog 25イベント実装済み
- LP: 11セクション構成のランディングページ完成
- OGP: メイン + ブログ記事別の動的OG画像 + Twitter Card設定済み
- プロフィール: 構造化入力（ドロップダウン + ピルボタン） + 都道府県対応

---

## Phase 4-5 ✅ 完了

- **Phase 4** (Task 20-29): Analytics・LP・OGP・パフォーマンス・SNSテンプレ・メールシーケンス・プレイブック
- **Phase 5** (Task 30): プロフィール構造化入力・都道府県対応・DB schema更新
- 残: Task 22 実決済E2Eテスト（Polar Identity審査完了後）

---

## Phase 6: グロース & コンバージョン最適化（1週間スプリント）

**目標**: 最初のユーザー獲得を実現し、Free→有料化ファネルを構築する
**期間**: 2026-02-26 〜 2026-03-05
**現状**: ユーザー0人 → 目標: 初週10サインアップ、1有料化
**戦略**: 集客基盤(SEO+メール) → 初回価値体験(UX) → 有料転換(コンバージョン) → AI拡充(価値拡大)

### 優先度マトリクス

| 優先度 | タスク | 担当 | 状態 | 見積 |
|--------|--------|------|------|------|
| **Required** | Task 31: ブログ記事公開 + SEO最適化 | cc | TODO | 2h |
| **Required** | Task 32: メールキャプチャー（LP + Exit Intent） | cc | TODO | 3h |
| **Required** | Task 33: オンボーディング改善（プログレッシブプロファイリング） | cc | TODO | 3h |
| **Required** | Task 34: 料金ページ改善（年間プラン + アンカープラン + FAQ強化） | cc | TODO | 3h |
| **Recommended** | Task 35: 2026年新補助金 FULL AI対応追加（省力化・新事業進出・成長加速化） | cc | TODO | 4h |
| **Recommended** | Task 36: アップセル導線強化（複数トリガー + パーソナライズ） | cc | TODO | 3h |
| **Recommended** | Task 37: サインアップ後メールシーケンス実装 | cc | TODO | 2h |
| **Optional** | Task 38: PostHog A/Bテスト基盤 | cc | TODO | 3h |
| **Optional** | Task 39: ソーシャルプルーフ + 信頼性要素追加 | cc | TODO | 2h |

### 実行順序

```
Day 1: Task 31 (ブログ公開) + Task 32 (メールキャプチャー)
  ↓  [集客基盤 = オーガニック流入 + リード獲得]
Day 2: Task 33 (オンボーディング改善) + Task 34 (料金ページ改善)
  ↓  [コンバージョンファネル = 登録→体験→課金]
Day 3: Task 35 (新補助金AI対応)
  ↓  [プロダクト価値拡大 = 扱える補助金を増やす]
Day 4: Task 36 (アップセル) + Task 37 (メールシーケンス)
  ↓  [リテンション + 有料化促進]
Day 5: Task 38 (A/Bテスト) + Task 39 (信頼性) + 品質ゲート
  ↓  [最適化基盤 + 仕上げ]
```

---

### Task 31: ブログ記事公開 + SEO最適化 `cc:TODO`

**目的**: オーガニック検索流入をゼロ→獲得。content/drafts/ に9記事下書きが存在するが未公開。

- [ ] `[feature:a11y]` 下書き3記事を公開（持続化ガイド・IT導入ガイド・補助金比較） `cc:TODO`
- [ ] 各記事にターゲットキーワード・meta description 最適化 `cc:TODO`
- [ ] 記事末尾に内部リンク追加（→LP、→料金ページ、→AI生成デモ） `cc:TODO`
- [ ] RelatedPosts コンポーネント統合（既存コンポーネントを記事ページに接続） `cc:TODO`
- [ ] ブログタグページの sitemap priority を 0.5→0.7 に引き上げ `cc:TODO`

**KPI**: 公開1週間後にGoogle Search Console でインプレッション確認

---

### Task 32: メールキャプチャー（LP + Exit Intent） `cc:TODO`

**目的**: バウンスユーザーのリード獲得率 0%→5-15%。現在LPにメール取得手段が一切ない。

- [ ] `[feature:a11y]` LP下部にメール登録フォーム追加（「補助金最新情報を毎週お届け」） `cc:TODO`
- [ ] Exit Intent モーダル実装（未ログインユーザーが離脱時に表示） `cc:TODO`
- [ ] リードマグネット: 「補助金選定チェックリスト」PDF DLリンク `cc:TODO`
- [ ] Supabase `email_leads` テーブル or Polar mailing list に保存 `cc:TODO`
- [ ] PostHog イベント: `EMAIL_CAPTURE_SHOWN`, `EMAIL_CAPTURE_SUBMITTED` `cc:TODO`

**KPI**: メールキャプチャー率 5%以上

---

### Task 33: オンボーディング改善 `cc:TODO`

**目的**: サインアップ→初回AI生成の到達率を最大化。現在プロフィール全入力が壁になっている。

- [ ] `[feature:a11y]` プログレッシブプロファイリング: 必須3項目（会社名・業種・従業員数）で即AI生成可能に `cc:TODO`
- [ ] `[feature:a11y]` ウェルカムモーダル: 「3分でAI申請書を体験」ガイド表示（?welcome=true時） `cc:TODO`
- [ ] 初回AI生成前にサンプル出力プレビュー表示（「こんな文章がAIで生成されます」） `cc:TODO`
- [ ] PostHog イベント: `ONBOARDING_STEP_VIEWED`, `FIRST_GENERATION_ATTEMPTED` `cc:TODO`

**KPI**: サインアップ→初回AI生成率 50%以上

---

### Task 34: 料金ページ改善 `cc:TODO`

**目的**: 有料プランの魅力度向上。年間割引でLTV増加、アンカー価格で Pro の心理的ハードルを下げる。

- [ ] `[feature:a11y]` 年間/月間トグル追加（年間: Starter 17%OFF、Pro 16%OFF、Business 25%OFF） `cc:TODO`
- [ ] アンカープラン: Enterprise ¥29,800/月 表示追加（Pro が割安に見える効果） `cc:TODO`
- [ ] Pro に「人気No.1」バッジ追加 `cc:TODO`
- [ ] FAQ拡充: 「AIの品質は？」「コンサルとの違いは？」「返金は？」の3問追加 `cc:TODO`
- [ ] 各プランに「こんな方におすすめ」ペルソナ文追加 `cc:TODO`

**KPI**: 料金ページ→チェックアウト率 改善

---

### Task 35: 2026年新補助金 FULL AI対応追加 `cc:TODO`

**目的**: 2026年に申請受付中の人気補助金をFULL AI対応に。ユーザーにとっての「使う理由」を増やす。

- [ ] `[feature:tdd]` 中小企業省力化投資補助金 — セクション定義 + 専用プロンプト作成 `cc:TODO`
- [ ] `[feature:tdd]` 中小企業新事業進出補助金 — セクション定義 + 専用プロンプト作成 `cc:TODO`
- [ ] `[feature:tdd]` 中小企業成長加速化補助金 — セクション定義 + 専用プロンプト作成 `cc:TODO`
- [ ] 各補助金のダミーデータ更新（締切日・申請期間を2026年最新に） `cc:TODO`

**KPI**: FULL AI対応 6件→9件（+50%増）

> 参考: [中小企業庁 補助金一覧](https://www.chusho.meti.go.jp/koukai/hojyokin/index.html)
> 省力化: 随時申請受付中 / 新事業進出: 3/26締切 / 成長加速化: 3/26締切

---

### Task 36: アップセル導線強化 `cc:TODO`

**目的**: 現在のアップセルトリガーがクォータ枯渇の1箇所のみ → 複数タッチポイントに拡大。

- [ ] `[feature:a11y]` DOCX エクスポート試行時のアップセルモーダル改善（メリット訴求強化） `cc:TODO`
- [ ] プロフィール充実度 < 50% 時に「Pro なら詳細分析」バナー表示 `cc:TODO`
- [ ] AI生成結果表示後に「Pro ならさらに高品質な出力」比較プレビュー `cc:TODO`
- [ ] ダッシュボードにクォータ残量ウィジェット（残り少ない時にオレンジ→赤グラデーション） `cc:TODO`

**KPI**: アップセルモーダル表示→クリック率 10%以上

---

### Task 37: サインアップ後メールシーケンス実装 `cc:TODO`

**目的**: content/emails/nurture-sequence.md は作成済みだが未実装。自動メールでアクティベーション促進。

- [ ] `[feature:security]` メール送信API: Resend or Supabase Edge Functions 経由 `cc:TODO`
- [ ] Day 0: ウェルカム + 「今すぐ初回AI生成」CTA `cc:TODO`
- [ ] Day 3: 「プロフィールを完成させましょう」リマインダー `cc:TODO`
- [ ] Day 7: Pro 機能ハイライト + 期間限定オファー `cc:TODO`

**KPI**: メール開封率 30%以上、CTA クリック率 5%以上

---

### Task 38: PostHog A/Bテスト基盤 `cc:TODO`

**目的**: データドリブンなLP最適化を可能に。現在実験インフラがゼロ。

- [ ] PostHog Feature Flags セットアップ `cc:TODO`
- [ ] 実験1: Hero CTA テキスト（「無料で始める」vs「今すぐ作成」） `cc:TODO`
- [ ] 実験2: 料金ページコピー変更 `cc:TODO`
- [ ] PostHog ダッシュボード: ファネル可視化（LP→サインアップ→AI生成→課金） `cc:TODO`

**KPI**: 2週間でCTAクリック率の有意差検出

---

### Task 39: ソーシャルプルーフ + 信頼性要素 `cc:TODO`

**目的**: 「このサービス大丈夫？」の不安を解消。0→1フェーズでも信頼性は重要。

- [ ] LP に「AI生成サンプル」セクション追加（実際の出力例を匿名化して掲載） `cc:TODO`
- [ ] 「よくある質問」に反論処理3問追加（Task 34 FAQ と連携） `cc:TODO`
- [ ] LP Footer に運営会社情報・特商法リンク・セキュリティバッジ追加 `cc:TODO`

**KPI**: LP直帰率の改善

---

### Phase 6 完了条件

```bash
# 品質ゲート
npx tsc --noEmit    # 型エラーゼロ
npm run lint         # 警告ゼロ
npm run build        # ビルド成功

# 機能確認
- ブログ記事3本がSSGで公開されている
- LP にメールキャプチャーフォームが表示される
- 料金ページに年間/月間トグルがある
- FULL AI対応補助金が9件以上
- PostHog でファネルイベントが記録される
```
