import { NextRequest, NextResponse } from "next/server";
import { runSentinel } from "@/lib/observability/agents/sentinel";
import { runAiMonitor } from "@/lib/observability/agents/ai-monitor";
import { runBillingMonitor } from "@/lib/observability/agents/billing-monitor";
import { runSubsidyWatcher } from "@/lib/observability/agents/subsidy-watcher";
import { autoResolveAlerts, escalateStaleAlerts } from "@/lib/observability/alert-lifecycle";
import { logEvent } from "@/lib/observability/logger";
import { getObservabilityClient } from "@/lib/observability/admin-client";

export async function GET(request: NextRequest) {
  try {
    // Vercel Cron Secret チェック
    const cronSecret = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || cronSecret !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    // Run all agents sequentially
    const sentinel = await runSentinel();
    const aiMonitor = await runAiMonitor();
    const billingMonitor = await runBillingMonitor();
    const subsidyWatcher = await runSubsidyWatcher();

    // Alert lifecycle management
    const resolved = await autoResolveAlerts();
    const escalated = await escalateStaleAlerts();

    // Cleanup old records (30 days)
    const client = getObservabilityClient();
    let cleaned = 0;
    if (client) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { count: eventsDeleted } = await client
        .from("system_events")
        .delete({ count: "exact" })
        .lt("created_at", thirtyDaysAgo);

      const { count: healthDeleted } = await client
        .from("health_checks")
        .delete({ count: "exact" })
        .lt("checked_at", thirtyDaysAgo);

      cleaned = (eventsDeleted ?? 0) + (healthDeleted ?? 0);
    }

    logEvent({
      eventType: "agent_run",
      severity: "info",
      source: "cron/agents",
      message: "監視エージェント実行完了",
      metadata: {
        sentinel: { alertsDispatched: sentinel.alertsDispatched },
        aiMonitor: { errorRate: aiMonitor.errorRate, totalCostUsd: aiMonitor.totalCostUsd },
        billingMonitor: { webhookErrors: billingMonitor.webhookErrors },
        subsidyWatcher: { lastIngestion: subsidyWatcher.lastIngestion },
        lifecycle: { resolved: resolved.resolved, escalated: escalated.escalated },
        cleaned,
      },
    });

    return NextResponse.json({
      success: true,
      sentinel,
      aiMonitor,
      billingMonitor,
      subsidyWatcher,
      lifecycle: { resolved: resolved.resolved, escalated: escalated.escalated },
      cleaned,
    });
  } catch (error) {
    console.error("[AgentsCron] Unexpected error:", error);
    return NextResponse.json(
      { error: "監視エージェント実行中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
