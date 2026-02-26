# Plans.md — hojokin-app

Updated: 2026-02-26

## 現状サマリー

- **Phase 1〜6 全完了** — プロダクト開発完了、Vercel デプロイ済み
- 課金: Polar.sh (JPY対応済み)、payout設定完了（Identity審査中）
- SEO: 16記事 + JSON-LD + OGメタデータ + サイトマップ + FAQページ + 補助金診断LP
- FULL AI対応補助金: 持続化(1) + IT導入(4) + ものづくり(1) + 省力化(1) + 新事業進出(1) + 成長加速化(1) = **9件**
- Analytics: Vercel Analytics + SpeedInsights + PostHog 28イベント + A/Bテスト基盤
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

## Phase 7: ユーザー獲得 & 運用（次フェーズ）

**目標**: 初月50サインアップ、3ヶ月で有料5人、MRR ¥15,000
**戦略**: コンテンツマーケ + SNS + パートナーシップ

### 未実装タスク（マーケティング計画より）

| # | タスク | 種別 | 状態 |
|---|--------|------|------|
| Task 40 | X/Twitter 5投稿（締切アラート・記事シェア） | 手動 | TODO |
| Task 41 | note.com に記事1本投稿 | 手動 | TODO |
| Task 42 | Google Search Console サイトマップ送信 | 手動 | TODO |
| Task 43 | 週次ブログ記事3本追加 | cc | done |
| Task 44 | SEO最適化ラウンド1（メタデータ・内部リンク・サイトマップ強化） | cc | done |
| Task 45 | 「補助金診断」LP作成（/shindan — 3問→最適補助金表示） | cc | done |
| Task 46 | パートナーアウトレイチテンプレート作成（税理士・診断士・行政書士） | cc | done |
| Task 47 | ブログCTA最適化（中間CTA + 末尾CTA強化 + PostHogトラッキング） | cc | done |
| Task 48 | 12週レトロスペクティブ | cc | TODO |

### Vercel 環境変数（要設定）

| 変数名 | 用途 | 状態 |
|--------|------|------|
| `RESEND_API_KEY` | メール送信 | 要設定 |
| `CRON_SECRET` | Cron認証 | 要設定 |
| `EMAIL_FROM` | 送信元アドレス | 要設定 |

### PostHog 設定（要設定）

- `hero-cta-text` Feature Flag 作成（control / variant_a）

---

## 12週マーケティングスケジュール

### Week 3-4: デプロイ + 初回公開 ← 現在

- SNS初投稿（X/Twitter 5本）
- note.com 記事1本
- Search Console サイトマップ送信
- はてなブックマーク セルフブクマ

### Week 5-8: コンテンツ量産

- ブログ記事2本/週
- X/Twitter 5投稿/週
- SEO最適化ラウンド1（Week 6）
- 中間SEO監査 + 内部リンク最適化（Week 8）

### Week 9-12: グロース + パートナーシップ

- 「補助金診断」LP作成（Week 9）
- パートナーメール送信（Week 10）
- ブログCTA最適化（Week 11）
- 12週レトロスペクティブ（Week 12）

### 期待成果（12週後）

- ブログ 23本、X/Twitter 50投稿、note.com 10記事
- オーガニック流入 500-1,000/月
- サインアップ 10-50件
- Free→Pro 転換率 5%
