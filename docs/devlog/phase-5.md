# Phase 5: Dashboard & Alerts 設定

## カスタムダッシュボード設計

- **ステータス**: ⚠️ 手動設定が必要（Datadog UI操作）
- **実施内容**: Datadog ダッシュボードの設計と作成手順の記録
- **ダッシュボード名**: `hojokin-app: AI SaaS 監視`

### ウィジェット構成

#### Row 1: ヘルスサマリー
| ウィジェット | クエリ | 目的 |
|------------|-------|------|
| エラーレート | `sum:trace.ai.generate-section.errors{*} / sum:trace.ai.generate-section.hits{*}` | 全体の健全性 |
| P99 レイテンシー | `p99:trace.anthropic.messages.create.duration{*}` | AI応答速度 |
| 月間生成回数 | `sum:trace.ai.generate-section.hits{*}.as_count()` | 利用量 |
| アクティブユーザー | RUM: `count:session.id` by `@usr.plan` | プラン別アクティブ数 |

#### Row 2: LLM コスト分析
| ウィジェット | クエリ | 目的 |
|------------|-------|------|
| モデル別コスト推定 | Logs: `avg:input_tokens{model:*}` | コスト最適化 |
| キャッシュヒット率 | Logs: `sum:cache_read_input_tokens / sum:input_tokens` | プロンプトキャッシュ効果 |
| プラン別生成回数 | Logs: `count(*){user_plan:*}` | プラン分布 |
| 補助金種別別回数 | Logs: `count(*){subsidy_id:*}` | 人気補助金ランキング |

#### Row 3: フロントエンド (RUM)
| ウィジェット | クエリ | 目的 |
|------------|-------|------|
| Core Web Vitals | RUM: LCP / FID / CLS | ユーザー体験 |
| ページロード時間 | RUM: `avg:view.loading_time` by `@view.name` | ページ別速度 |
| エラー数 | RUM: `count:error.id` | フロントエンドエラー |

---

## アラートルール設定

- **ステータス**: ⚠️ 手動設定が必要（Datadog UI操作）
- **実施内容**: 以下のモニターを Datadog で作成する

### Monitor 1: AI エラーレート
```
名前: [hojokin-app] AI生成エラーレート > 5%
タイプ: Metric Monitor
クエリ: sum(last_5m):sum:trace.ai.generate-section.errors{service:hojokin-app}.as_rate() / sum:trace.ai.generate-section.hits{service:hojokin-app}.as_rate() > 0.05
アラート条件: > 5% for 5 minutes
通知先: Slack #alerts / メール
```

### Monitor 2: P99 レイテンシー
```
名前: [hojokin-app] AI生成 P99 レイテンシー > 30秒
タイプ: APM Monitor
サービス: hojokin-app
リソース: ai.generate-section
条件: p99 latency > 30s for 10 minutes
通知先: Slack #alerts
```

### Monitor 3: ログエラー急増
```
名前: [hojokin-app] エラーログ急増
タイプ: Log Monitor
クエリ: service:hojokin-app status:error
条件: count > 10 in last 5 minutes
通知先: Slack #alerts
```

---

## 設定手順

1. Datadog > Dashboards > New Dashboard > "hojokin-app: AI SaaS 監視"
2. 上記ウィジェットを追加
3. Datadog > Monitors > New Monitor で上記 3 つのアラートを作成
4. Notification channel に Slack か メールを設定

- **学び**: Datadog のダッシュボードは JSON としてエクスポートできる。`/api/v1/dashboard/{id}` でエクスポートし、`docs/` に保存しておくと IaC (Terraform Provider) での管理に移行しやすい。
- **スクリーンショット**:
  - `docs/screenshots/phase5-dashboard.png`（カスタムダッシュボード全体）
  - `docs/screenshots/phase5-alerts.png`（アラート設定画面）
