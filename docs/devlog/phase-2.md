# Phase 2: APM トレーシング

## next.config.ts + instrumentation.ts の連携

- **ステータス**: ✅ 成功
- **実施内容**: Next.js 16 の Instrumentation Hook (`instrumentation.ts`) で dd-trace を初期化。
- **結果**: Node.js ランタイムで動作するすべての API Route に自動計装が適用される。
- **詰まり**: Next.js 16 では `instrumentation.ts` はデフォルトで有効。ただし `next.config.ts` に `serverExternalPackages: ['dd-trace']` がないとバンドル時にエラーが出る。設定後は解消。
- **学び**: `instrumentation.ts` は Next.js 13.5+ から安定機能。`register()` 関数がサーバー起動時に一度だけ呼ばれる。`NEXT_RUNTIME` で `nodejs` / `edge` を判別できる。

---

## /api/ai/generate-section のトレーシング

- **ステータス**: ✅ 成功
- **実施内容**: `callAnthropicWithRetry` 呼び出しを二段スパンでラップ:
  - 外側: `ai.generate-section`（全体のレイテンシーを計測）
  - 内側: `anthropic.messages.create`（API呼び出し単体のレイテンシー）
- **タグ**: `user.plan`, `subsidy.id`, `ai.model`
- **結果**: Datadog APM の Service Map に `hojokin-app` が表示され、`ai.generate-section` スパンのレイテンシー・エラーレートが可視化される。
- **詰まり**: `withSpan` 内部で `await import('dd-trace')` を使うため、最初のリクエストで若干のオーバーヘッドがある。2回目以降は Node.js のモジュールキャッシュが効くため問題なし。
- **学び**: Vercel Serverless では各リクエストが独立したコンテナで処理される場合があるため、スパンの伝播（分散トレーシング）は同一コンテナ内でのみ機能する。クロスサービストレーシングはネットワーク境界を越えるため、W3C Trace Context ヘッダーの付与が必要。

---

## /api/applications のトレーシング

- **ステータス**: ✅ 成功
- **実施内容**: GET/POST/DELETE を各 withSpan でラップ（スパン名: `applications.get` / `applications.post` / `applications.delete`）
- **結果**: CRUD オペレーション別のレイテンシーが APM で確認可能に。
- **学び**: スパン名は `{resource}.{operation}` の形式にすると APM ダッシュボードで整理しやすい。

---

## /api/billing/checkout のトレーシング

- **ステータス**: ✅ 成功
- **実施内容**: POST ハンドラ全体を `billing.checkout` スパンでラップ。Polar.sh SDK の呼び出し時間が可視化される。
- **結果**: Checkout セッション作成のレイテンシーがトレースに記録される。
- **学び**: 外部サービス（Polar.sh、Anthropic）への呼び出しは個別スパンにすると「どの外部APIが遅いか」が特定しやすい。

---

## 確認方法

1. `DD_TRACE_DEBUG=true npm run dev` でローカル実行
2. `http://localhost:3000/api/ai/generate-section` にリクエスト（認証必要）
3. ターミナルに `Sending trace ...` ログが出ることを確認
4. Vercel Preview デプロイ後: Datadog APM > Services > `hojokin-app` で確認
- **スクリーンショット**:
  - `docs/screenshots/phase2-apm-service.png`（APM Services 画面）
  - `docs/screenshots/phase2-trace-detail.png`（トレース詳細）
