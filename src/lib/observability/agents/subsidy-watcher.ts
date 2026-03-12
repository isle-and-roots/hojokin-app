import { getObservabilityClient } from "../admin-client";
import { dispatchAlert } from "../alert-dispatcher";

export async function runSubsidyWatcher(): Promise<{
  lastIngestion: string | null;
  alertsDispatched: number;
}> {
  const client = getObservabilityClient();
  if (!client) return { lastIngestion: null, alertsDispatched: 0 };

  let alertsDispatched = 0;

  // Check last successful ingestion
  const { data: lastLog } = await client
    .from("ingestion_logs")
    .select("finished_at, status")
    .eq("status", "success")
    .order("finished_at", { ascending: false })
    .limit(1);

  const lastIngestion = lastLog?.[0]?.finished_at ?? null;

  if (lastIngestion) {
    const hoursSinceIngestion = (Date.now() - new Date(lastIngestion).getTime()) / (60 * 60 * 1000);

    // Alert if no successful ingestion in 48+ hours
    if (hoursSinceIngestion > 48) {
      await dispatchAlert({
        agentName: "subsidy-watcher",
        severity: hoursSinceIngestion > 72 ? "critical" : "warn",
        title: `補助金取込停止: ${Math.floor(hoursSinceIngestion)}時間`,
        message: `最後の正常取込から${Math.floor(hoursSinceIngestion)}時間経過しています。CRON設定を確認してください。`,
        metadata: { lastIngestion, hoursSinceIngestion },
      });
      alertsDispatched++;
    }
  }

  // Check recent ingestion errors
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: errorCount } = await client
    .from("ingestion_logs")
    .select("id", { count: "exact", head: true })
    .eq("status", "failed")
    .gte("created_at", twentyFourHoursAgo);

  if ((errorCount ?? 0) >= 3) {
    await dispatchAlert({
      agentName: "subsidy-watcher",
      severity: "critical",
      title: `補助金取込エラー多発: 24時間で${errorCount}件`,
      message: `直近24時間で${errorCount}件の取込失敗が発生しています。データソースを確認してください。`,
      metadata: { errorCount },
    });
    alertsDispatched++;
  }

  return { lastIngestion, alertsDispatched };
}
