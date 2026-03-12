import { getObservabilityClient } from "../admin-client";
import { dispatchAlert } from "../alert-dispatcher";

export async function runBillingMonitor(): Promise<{
  webhookErrors: number;
  alertsDispatched: number;
}> {
  const client = getObservabilityClient();
  if (!client) return { webhookErrors: 0, alertsDispatched: 0 };

  let alertsDispatched = 0;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // Check billing webhook errors in last hour
  const { count: errorCount } = await client
    .from("system_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", "billing_webhook_error")
    .gte("created_at", oneHourAgo);

  const webhookErrors = errorCount ?? 0;

  if (webhookErrors > 0) {
    await dispatchAlert({
      agentName: "billing-monitor",
      severity: webhookErrors >= 3 ? "critical" : "warn",
      title: `Polar Webhook エラー: 直近1時間で${webhookErrors}件`,
      message: `課金Webhookで${webhookErrors}件のエラーが発生しています。プラン更新が失敗している可能性があります。`,
      metadata: { webhookErrors },
    });
    alertsDispatched++;
  }

  // Check for plan inconsistencies (users with polar_subscription_id but plan=free)
  const { data: inconsistent } = await client
    .from("user_profiles")
    .select("id")
    .not("polar_subscription_id", "is", null)
    .eq("plan", "free")
    .limit(10);

  if (inconsistent && inconsistent.length > 0) {
    await dispatchAlert({
      agentName: "billing-monitor",
      severity: "critical",
      title: `課金整合性エラー: ${inconsistent.length}件`,
      message: `Polar subscription IDを持つが plan=free のユーザーが${inconsistent.length}件存在します。Webhook処理を確認してください。`,
      metadata: { count: inconsistent.length, userIds: inconsistent.map((u) => u.id) },
    });
    alertsDispatched++;
  }

  return { webhookErrors, alertsDispatched };
}
