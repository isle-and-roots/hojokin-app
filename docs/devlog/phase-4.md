# Phase 4: RUM — フロントエンド監視

## @datadog/browser-rum インストール

- **ステータス**: ✅ 成功
- **実施内容**: `npm install @datadog/browser-rum` 実行、3パッケージ追加
- **結果**: `package.json` の `dependencies` に追加済み
- **学び**: `@datadog/browser-rum` は CDN 経由でも使えるが、npm パッケージの方がバンドルサイズ最適化・TypeScript 型定義・CSP 設定が楽。

---

## DatadogRumInit コンポーネント作成

- **ステータス**: ✅ 成功
- **実施内容**: `src/components/datadog/rum-init.tsx` を作成。
- **設計の工夫**:
  - `'use client'` + `useEffect` で初期化 → SSR では実行されないため、サーバー側の秘密情報（API Key）が漏洩しない
  - `NEXT_PUBLIC_DD_CLIENT_TOKEN` / `NEXT_PUBLIC_DD_APPLICATION_ID` が未設定なら初期化スキップ → 開発環境や未設定時にエラーが出ない
  - `defaultPrivacyLevel: 'mask-user-input'` → フォーム入力（補助金申請書の内容）が自動マスクされる
- **結果**: 本番デプロイ後に環境変数を設定するだけで RUM が有効化される
- **詰まり**: `dangerouslySetInnerHTML` は CLAUDE.md で禁止されているため、`<script>` タグによる初期化は使えない。React コンポーネント経由の初期化で対応。
- **学び**: `defaultPrivacyLevel: 'mask-user-input'` は補助金申請 SaaS のような B2B ツールでは必須。ユーザーが入力した事業計画の内容が Session Replay に記録されると GDPR・個人情報保護法の問題になりうる。

---

## layout.tsx への組み込み

- **ステータス**: ✅ 成功
- **実施内容**: `src/app/layout.tsx` の `<body>` 内に `<DatadogRumInit />` を追加。
- **配置場所**: `<SpeedInsights />` の直後に追加
- **結果**: 全ページで RUM が動作する（Server Component のページも含む）
- **学び**: RUM コンポーネントを Root Layout に置くと、SPA ナビゲーションも含めて全ページビューが記録される。Next.js App Router の soft navigation もトラッキング対象になる。

---

## 計測できるようになるメトリクス

| メトリクス | 説明 |
|----------|------|
| LCP (Largest Contentful Paint) | 最大コンテンツの描画時間 |
| FID (First Input Delay) | 最初のインタラクション遅延 |
| CLS (Cumulative Layout Shift) | レイアウトシフト累計 |
| TTFB (Time to First Byte) | サーバー応答時間 |
| Page Load Time | ページロード完了時間 |
| Session Replay | ユーザー操作の録画（マスクあり） |
| Error Tracking | フロントエンドエラーの自動収集 |

---

## 有効化手順（Vercel 環境変数設定）

1. Datadog 管理画面 > UX Monitoring > RUM Applications > "New Application"
2. アプリケーション名: `hojokin-app`、タイプ: `Browser` を選択
3. 表示された `applicationId` と `clientToken` を控える
4. Vercel ダッシュボード > Settings > Environment Variables に追加:
   - `NEXT_PUBLIC_DD_APPLICATION_ID` = Datadog の applicationId
   - `NEXT_PUBLIC_DD_CLIENT_TOKEN` = Datadog の clientToken
5. Redeploy

- **スクリーンショット**: `docs/screenshots/phase4-rum.png`（RUM パフォーマンス概要）
