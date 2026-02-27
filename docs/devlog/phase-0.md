# Phase 0: 環境確認・セットアップ

## dd-trace インストール

- **ステータス**: ✅ 成功
- **実施内容**: `npm install dd-trace` 実行、24パッケージ追加
- **結果**: `package.json` の `dependencies` に `dd-trace` が追加された
- **詰まり**: dd-trace は Next.js の SSR バンドルに含まれるとビルドエラーになる。`next.config.ts` に `serverExternalPackages: ['dd-trace']` を追加して外部化することで解決。
- **学び**: Next.js 15+ では `experimental.serverComponentsExternalPackages` ではなく `serverExternalPackages` がトップレベルオプションになった。
- **スクリーンショット**: N/A（コード変更のみ）

---

## instrumentation.ts 作成

- **ステータス**: ✅ 成功
- **実施内容**: `instrumentation.ts` を Next.js instrumentation hook として新規作成。`NEXT_RUNTIME === 'nodejs'` 条件分岐で Edge Runtime への流出を防止。
- **結果**: `dd-trace` の初期化が Node.js ランタイムのみで動作するよう設定。
- **詰まり**: `plugins: true` を設定すると `@anthropic-ai/sdk` の自動計装（LLM Observability）が有効になるが、Next.js Serverless では一部プラグインが動作しない場合がある。実際の動作は Vercel Preview デプロイで確認が必要。
- **学び**: Vercel Serverless は "冷起動" があるため、`runtimeMetrics: true` の効果はコンテナが温まっている間のみ。`profiling: false` は Serverless 環境では必須（ファイルシステムアクセスがないため）。
- **スクリーンショット**: N/A（コード変更のみ）

---

## src/lib/datadog/index.ts 作成

- **ステータス**: ✅ 成功
- **実施内容**: `withSpan<T>()` 型安全ラッパーと `LLM_TAGS` 定数を作成。
- **結果**: API ルートから `import { withSpan } from '@/lib/datadog'` で利用可能に。
- **詰まり**: `tracer.scope().active()` が `null` を返すケースがあり、`childOf: null` を渡すとエラー。`?? undefined` でフォールバック。
- **学び**: `withSpan` は try/catch でフォールバックしているため、dd-trace が未ロードの環境（Edge Runtime、テスト）でも安全に動作する。

---

## src/lib/datadog/logger.ts 作成

- **ステータス**: ✅ 成功
- **実施内容**: JSON 構造化ログユーティリティを作成。Datadog Log Drain がこの形式を自動パースする。
- **結果**: `logger.info / warn / error / debug` の4メソッドが利用可能に。
- **学び**: Vercel の標準ログは非構造化テキストだが、JSON 形式で出力すると Datadog がフィールドを自動抽出してフィルタリング・アラートが可能になる。`service` と `env` タグを含めることでサービス別フィルタリングが機能する。

---

## .env.local.example 作成

- **ステータス**: ✅ 成功
- **実施内容**: `DD_API_KEY`, `DD_APP_KEY`, `DD_SERVICE`, `DD_ENV`, `DD_SITE`, `NEXT_PUBLIC_DD_CLIENT_TOKEN`, `NEXT_PUBLIC_DD_APPLICATION_ID` を追記。
- **結果**: 新規開発者がすぐに Datadog 変数を把握できるドキュメントが完成。
- **学び**: `DD_API_KEY` と `DD_APP_KEY` はサーバーサイド（Vercel 環境変数）のみ。`NEXT_PUBLIC_*` はフロントエンド RUM 用でクライアントに露出するため、Client Token（書き込み権限なし）を使用する設計が正しい。

---

## ビルド確認

- **ステータス**: ✅ 成功
- **実施内容**: `npm run build` 実行
- **結果**: 196 ページ生成、エラーゼロ
- **学び**: `serverExternalPackages` の設定が正しくないと、dd-trace のネイティブモジュール（`.node` ファイル）を webpack がバンドルしようとして `Module not found` エラーが出る。
