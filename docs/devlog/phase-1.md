# Phase 1: Vercel Log Drain 連携

## Vercel Datadog Integration 設定

- **ステータス**: ⚠️ 手動設定が必要（UI操作）
- **実施内容**: Vercel Dashboard > [プロジェクト] > Integrations > Datadog から Log Drain を設定。
- **設定手順**:
  1. Vercel Dashboard の `hojokin-app` プロジェクトを開く
  2. "Integrations" タブ → "Browse Marketplace" → "Datadog" を検索
  3. "Add Integration" → Datadog API Key を入力 (`DD_API_KEY` の値)
  4. Log Sources: "Build Logs", "Static Logs", "Edge Logs", "External Logs" をすべて有効化
  5. Region: `US1` (datadoghq.com の場合)
- **結果**: 設定後、Vercel の `console.log` 出力が Datadog Logs に流れる。
- **詰まり**: Vercel の Log Drain は Serverless Function のログのみが対象。Static ページや Edge Middleware のログは "Static Logs" / "Edge Logs" を別途有効化する必要がある。
- **学び**: Vercel × Datadog 連携は UI 操作のみで完了する。コードの変更は不要だが、構造化ログ (JSON) にしておくと Datadog 側でのフィルタリング精度が大幅に向上する。
- **スクリーンショット**: `docs/screenshots/phase1-log-drain.png`（Datadog Logs 画面）

---

## 構造化ログ実装

- **ステータス**: ✅ 成功
- **実施内容**: `src/lib/datadog/logger.ts` を作成し、主要 API ルートで `console.error` を `logger.error` に置き換え。
- **変更ファイル**:
  - `src/app/api/applications/route.ts` — GET/POST/DELETE の `console.error` を `logger.error` に変更
  - `src/app/api/billing/checkout/route.ts` — `console.error` を `logger.error` に変更
- **結果**: エラーログが以下の形式で出力される:
  ```json
  {
    "timestamp": "2026-02-27T10:00:00.000Z",
    "level": "error",
    "message": "applications.get failed",
    "service": "hojokin-app",
    "env": "production",
    "error": "..."
  }
  ```
- **学び**: JSON ログは Datadog の Log Parsing が自動でフィールドを抽出する。`service` フィールドがあるとサービス別フィルタが機能し、`level` フィールドがあるとエラーレートのモニタリングが可能になる。

---

## 確認方法

1. Vercel Preview デプロイ後、任意の API エンドポイントにリクエスト
2. Datadog Logs > Search で `service:hojokin-app` でフィルタリング
3. ログエントリが表示されれば Log Drain が正常動作
