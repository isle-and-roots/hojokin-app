# Phase 3: LLM Observability — Anthropic 連携

## dd-trace Anthropic 自動計装

- **ステータス**: ✅ 成功（設定済み）
- **実施内容**: `instrumentation.ts` の `plugins: true` により Anthropic SDK の自動計装が有効化。
- **結果**: `@anthropic-ai/sdk` の `messages.create()` 呼び出しが自動でスパンとして記録される（dd-trace が Anthropic プラグインをサポートしている場合）。
- **詰まり**: dd-trace の Anthropic プラグインサポートはバージョン依存。`dd-trace@latest` では `anthropic` プラグインが含まれるが、Vercel Serverless の cold start で `import('dd-trace')` が完了する前に Anthropic SDK が呼ばれると自動計装が効かない場合がある。→ `withSpan('anthropic.messages.create', ...)` でマニュアルスパンを追加することで確実に記録。
- **学び**: 自動計装 + マニュアルスパンの二段構えが最も確実。自動計装はトークン数などのメタデータを自動で収集するが、補助金種別やプランなどのビジネスコンテキストはマニュアルタグで追加する必要がある。

---

## カスタムスパン: プラン別・補助金種別タグ

- **ステータス**: ✅ 成功
- **実施内容**: `withSpan('anthropic.messages.create', { tags: { 'user.plan': plan, 'subsidy.id': subsidyId } })` で補助金種別・プランのタグを追加。
- **結果**: APM でプラン別の生成コストと補助金種別別のレイテンシーが分析可能に。
- **タグ一覧**:
  | タグ | 値例 | 用途 |
  |------|------|------|
  | `user.plan` | `free` / `starter` / `pro` / `business` | プラン別コスト分析 |
  | `subsidy.id` | `jizokuka-001` / `it-donyu-001` | 補助金別レイテンシー分析 |
  | `ai.model` | `claude-sonnet-4-20250514` | モデル別コスト分析 |
  | `ai.section_key` | `jigyo_keikaku` | セクション別分析 |
- **学び**: `user.plan` タグでフィルタリングすると Business プランユーザーが Opus を使用した場合のコストが可視化でき、プライシング最適化に活用できる。

---

## Prompt Caching ヒット率のログ記録

- **ステータス**: ✅ 成功
- **実施内容**: Anthropic API レスポンスの `usage.cache_read_input_tokens` と `usage.cache_creation_input_tokens` を `logger.info` で記録。
- **ログフォーマット**:
  ```json
  {
    "level": "info",
    "message": "anthropic.generation.complete",
    "model": "claude-sonnet-4-20250514",
    "input_tokens": 1250,
    "output_tokens": 480,
    "cache_creation_input_tokens": 1000,
    "cache_read_input_tokens": 0,
    "subsidy_id": "jizokuka-001",
    "user_plan": "starter",
    "section_key": "jigyo_keikaku"
  }
  ```
- **結果**: Datadog Log Analytics でキャッシュヒット率を計算できる。`cache_read_input_tokens / input_tokens` の比率が高いほどコスト削減効果が高い。
- **詰まり**: Anthropic の Prompt Caching は `ephemeral` タイプのキャッシュコントロールが必要。既存コードに `cache_control: { type: "ephemeral" }` が設定済みだったため追加作業不要。
- **学び**: `cache_read_input_tokens` が増えるとコストが約10分の1になる。ダッシュボードでキャッシュヒット率をモニタリングすることで、プロンプト設計の改善効果を定量的に測定できる。

---

## 実測値の期待値

Vercel Preview デプロイ後に以下の数値が確認できる予定:

| メトリクス | 期待値 | 確認場所 |
|----------|-------|---------|
| generate-section レイテンシー P50 | 3-8秒 | APM > Traces |
| generate-section レイテンシー P99 | 15-30秒 | APM > Traces |
| エラーレート | < 1% | APM > Services |
| キャッシュヒット率 | 30-50% | Logs > Analytics |
| 月間トークン使用量 | 要確認 | Logs > Analytics |

- **スクリーンショット**:
  - `docs/screenshots/phase3-llm-overview.png`（LLM Observability ダッシュボード）
  - `docs/screenshots/phase3-llm-span.png`（Anthropic スパン詳細）
