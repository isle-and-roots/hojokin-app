import { getObservabilityClient } from "../admin-client";
import { dispatchAlert } from "../alert-dispatcher";

export async function runAiMonitor(): Promise<{
  errorRate: number;
  totalCostUsd: number;
  alertsDispatched: number;
}> {
  const client = getObservabilityClient();
  if (!client) return { errorRate: 0, totalCostUsd: 0, alertsDispatched: 0 };

  let alertsDispatched = 0;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // AI error rate in last hour
  const { count: totalCount } = await client
    .from("ai_usage_logs")
    .select("id", { count: "exact", head: true })
    .gte("created_at", oneHourAgo);

  const { count: errorCount } = await client
    .from("ai_usage_logs")
    .select("id", { count: "exact", head: true })
    .not("error_kind", "is", null)
    .gte("created_at", oneHourAgo);

  const total = totalCount ?? 0;
  const errors = errorCount ?? 0;
  const errorRate = total > 0 ? errors / total : 0;

  if (total >= 5 && errorRate > 0.3) {
    await dispatchAlert({
      agentName: "ai-monitor",
      severity: "critical",
      title: `AI エラー率 ${(errorRate * 100).toFixed(0)}%（直近1時間）`,
      message: `直近1時間のAIリクエスト${total}件中${errors}件がエラー。閾値: 30%`,
      metadata: { total, errors, errorRate },
    });
    alertsDispatched++;
  }

  // Daily cost tracking
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: costData } = await client
    .from("ai_usage_logs")
    .select("estimated_cost_usd")
    .gte("created_at", todayStart.toISOString());

  const totalCostUsd = (costData ?? []).reduce(
    (sum, row) => sum + (Number(row.estimated_cost_usd) || 0),
    0
  );

  // Alert if daily cost exceeds $5
  if (totalCostUsd > 5) {
    await dispatchAlert({
      agentName: "ai-monitor",
      severity: "warn",
      title: `AI コスト警告: $${totalCostUsd.toFixed(2)}（本日）`,
      message: `本日のAI APIコストが$${totalCostUsd.toFixed(2)}に達しました。閾値: $5.00`,
      metadata: { totalCostUsd, date: todayStart.toISOString() },
    });
    alertsDispatched++;
  }

  return { errorRate, totalCostUsd, alertsDispatched };
}
