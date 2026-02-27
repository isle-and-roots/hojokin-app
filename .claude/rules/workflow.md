# ワークフロー・ルーティング・ロードマップ

## ルーティングロジック

### 自動判別
質問・タスクのキーワードから担当エージェントを自動選択:

**開発エージェント（HK）**:
| キーワード | 担当 |
|-----------|------|
| 機能追加、優先度、ロードマップ、UX、ユーザー体験 | HK0 |
| UI、コンポーネント、ページ、レスポンシブ、Tailwind、デザイン | HK1 |
| API、DB、Supabase、認証、課金、Polar、スキーマ | HK2 |
| プロンプト、AI生成、補助金データ、テンプレート、生成品質 | HK3 |
| テスト、バグ、セキュリティ、エラー、ビルド、パフォーマンス | HK4 |
| SEO実装、分析実装、トラッキングコード、メタタグ実装 | HK5 |

**マーケティング・営業エージェント（MK）**:
| キーワード | 担当 |
|-----------|------|
| ブログ、記事、SEO記事、コンテンツ、SNS、note、Twitter、メタデータ作成、コピーライティング、ニュースレター | MK0 |
| コンバージョン、ファネル、オンボーディング、CTA、upsell、チャーン、リテンション、ナーチャリング、料金最適化 | MK1 |
| パートナー、提携、紹介、リファラル、税理士、行政書士、診断士、商工会議所、セミナー | MK2 |
| 市場調査、競合分析、キーワード調査、データ分析、KPI、レポート、トレンド、締切カレンダー | MK3 |
| ローンチ、キャンペーン、リリース、プレスリリース、PR、プロモーション、GTM | MK4 |

### マルチエージェント応答

**開発タスク**:
| タスクパターン | 担当 |
|--------------|------|
| 新機能の設計→実装 | HK0(要件) → HK1(UI) + HK2(API) → HK4(検証) |
| 課金機能の実装 | HK0(プラン設計) + HK2(Polar) + HK1(UI) → HK4(検証) |
| 新補助金テンプレート追加 | HK3(プロンプト) + HK2(データ) → HK4(品質検証) |
| デプロイ準備 | HK2(インフラ) + HK4(セキュリティ) + HK5(SEO) |

**マーケティング・営業タスク**:
| タスクパターン | 担当 |
|--------------|------|
| SEO 記事公開 | MK3(KW調査) → MK0(執筆) → HK5(実装) → HK4(検証) |
| ローンチ実行 | MK4(計画) → MK0(コンテンツ) + MK1(LP最適化) + MK2(パートナー連絡) |
| 締切キャンペーン | MK3(締切通知) → MK4(企画) → MK0(記事+SNS) + MK1(メール) |
| コンバージョン改善 | MK3(データ分析) → MK1(改善設計) → HK1(実装) → HK4(検証) |
| パートナー開拓 | MK2(候補特定+提案) → MK4(調整) → HK0(機能検討) → HK2(技術統合) |
| 新規ユーザー獲得施策 | MK3(市場分析) → MK4(施策企画) → MK0(コンテンツ) + MK2(チャネル) |

---

## 開発ロードマップ

### Phase 1: 課金基盤（最優先 — これなしに収益はゼロ）
1. Supabase 統合（DB + Auth）
2. Polar.sh 課金実装（Free / Starter / Pro / Business）
3. ユーザー認証（Google OAuth のみ — Supabase Auth 経由）
4. 使用量トラッキング（AI 生成回数の制限）
5. Vercel デプロイ

### Phase 2: プロダクト品質向上
6. エラーハンドリングの強化
7. AI 生成品質の向上（プロンプト改善、全補助金の FULL 対応）
8. レスポンシブ対応（モバイル最適化）
9. オンボーディングフローの実装
10. 補助金データの拡充（30件以上）

### Phase 3: グロース
11. SEO 最適化（補助金一覧ページの SSG、メタデータ）
12. LP（ランディングページ）の作成
13. 分析基盤（Vercel Analytics + カスタムイベント）
14. メール通知（締切リマインド、新規補助金）
15. ユーザーフィードバック機能

### Phase 4: 差別化・拡張
16. 申請書レビュー機能（AI による採点・改善提案）
17. 申請ステータス管理の強化
18. 補助金カレンダー
19. 専門家マッチング（将来）
20. API 提供（将来）

---

## ファイル構成

```
src/
├── app/
│   ├── api/
│   │   ├── ai/generate-section/route.ts   # AI 生成 API
│   │   ├── subsidies/                      # 補助金 CRUD
│   │   ├── export/docx/route.ts            # DOCX エクスポート
│   │   ├── auth/                           # 認証 API
│   │   ├── billing/                        # 課金 API
│   │   └── webhooks/polar/                # Polar Webhook
│   ├── (auth)/                             # 認証ページ群（Google OAuth のみ）
│   ├── (dashboard)/                        # メインアプリ
│   │   ├── page.tsx                        # ダッシュボード
│   │   ├── profile/page.tsx                # 事業者プロフィール
│   │   ├── subsidies/                      # 補助金検索・詳細
│   │   └── applications/                   # 申請書管理
│   ├── pricing/                            # 料金ページ
│   └── layout.tsx
├── components/
│   ├── ui/                                 # 汎用 UI コンポーネント
│   ├── subsidies/                          # 補助金関連
│   ├── applications/                       # 申請書関連
│   └── billing/                            # 課金関連
├── lib/
│   ├── ai/prompts/                         # AI プロンプト
│   ├── supabase/                           # Supabase クライアント
│   ├── polar/                              # Polar.sh SDK
│   └── utils/                              # ユーティリティ
└── types/                                  # TypeScript 型定義
```

---

## 出力フォーマット（A0 拡張 — 開発向け）

全エージェントは以下の構造で出力:

1. **結論**: 何をするか（1文）
2. **理由**: なぜそうするか（最大3点）
3. **実装計画**: 具体的なファイル変更（パス + 変更内容）
4. **やらないこと**: 今回見送るもの（最低1つ）
5. **品質チェック**: この変更の検証方法
6. **収益インパクト**: この変更が月4万円目標にどう貢献するか

---

## 禁止事項（全エージェント共通）

### コード品質
- `any` 型の使用禁止
- `// @ts-ignore` 禁止
- `console.log` の本番残存禁止
- テストなしの課金ロジック変更禁止
- 未使用の import / 変数の放置禁止

### セキュリティ
- API キーのクライアント露出禁止
- 認証チェックなしの保護 API 禁止
- ユーザー入力の未検証での DB 書き込み禁止
- `dangerouslySetInnerHTML` の使用禁止（XSS リスク）

### ビジネス
- 補助金の不正受給を助長する機能の実装禁止
- 虚偽データの生成を可能にする機能禁止
- ユーザーデータの外部送信禁止（分析除く）
- 競合サービスの誹謗中傷コンテンツ禁止

### AI プロンプト
- 架空の統計データ・実績の生成禁止
- 補助金要件を満たさない申請書の生成禁止
- 同一内容のコピペ生成（使い回し）禁止

---

## デプロイ設定

### Vercel（推奨）
- Framework: Next.js
- Build: `npm run build`
- Install: `npm install`
- 環境変数:
  - `ANTHROPIC_API_KEY`: Claude API キー
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase プロジェクト URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名キー
  - `SUPABASE_SERVICE_ROLE_KEY`: Supabase サービスロールキー
  - `POLAR_ACCESS_TOKEN`: Polar アクセストークン
  - `POLAR_WEBHOOK_SECRET`: Polar Webhook シークレット
  - `POLAR_MODE`: Polar 環境（sandbox / production）
  - `POLAR_STARTER_PRODUCT_ID`: Starter プラン Product ID
  - `POLAR_PRO_PRODUCT_ID`: Pro プラン Product ID
  - `POLAR_BUSINESS_PRODUCT_ID`: Business プラン Product ID
  - `POLAR_STARTER_ANNUAL_PRODUCT_ID`: Starter 年額 Product ID
  - `POLAR_PRO_ANNUAL_PRODUCT_ID`: Pro 年額 Product ID
  - `POLAR_BUSINESS_ANNUAL_PRODUCT_ID`: Business 年額 Product ID

### 本番チェックリスト
- [ ] 全環境変数が設定されている
- [ ] Supabase RLS が全テーブルで有効
- [ ] Polar Webhook エンドポイントが登録されている
- [ ] `npm run build` がエラーなしで完了
- [ ] モバイル / デスクトップで動作確認済み
- [ ] エラーモニタリングが有効（Sentry or Vercel）
