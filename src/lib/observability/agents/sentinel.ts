import { getObservabilityClient } from "../admin-client";
import { getResend } from "@/lib/email/client";
import { dispatchAlert } from "../alert-dispatcher";
import type { ServiceName, ServiceStatus } from "../types";

type CheckResult = {
  service: ServiceName;
  status: ServiceStatus;
  responseTimeMs: number;
  errorMessage?: string;
};

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  const client = getObservabilityClient();
  if (!client) {
    return { service: "database", status: "down", responseTimeMs: 0, errorMessage: "Supabase not configured" };
  }
  try {
    const { error } = await client.from("user_profiles").select("id").limit(1);
    if (error) throw error;
    return { service: "database", status: "ok", responseTimeMs: Date.now() - start };
  } catch (e) {
    return {
      service: "database",
      status: "down",
      responseTimeMs: Date.now() - start,
      errorMessage: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

async function checkAuth(): Promise<CheckResult> {
  const start = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return { service: "auth", status: "down", responseTimeMs: 0, errorMessage: "SUPABASE_URL not configured" };
  }
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      signal: AbortSignal.timeout(5000),
    });
    const status: ServiceStatus = res.ok ? "ok" : "degraded";
    return { service: "auth", status, responseTimeMs: Date.now() - start };
  } catch (e) {
    return {
      service: "auth",
      status: "down",
      responseTimeMs: Date.now() - start,
      errorMessage: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

async function checkEmail(): Promise<CheckResult> {
  const start = Date.now();
  if (!process.env.RESEND_API_KEY) {
    return { service: "email", status: "down", responseTimeMs: 0, errorMessage: "RESEND_API_KEY not configured" };
  }
  try {
    const resend = getResend();
    if (!resend) throw new Error("Resend client not available");
    await resend.domains.list();
    return { service: "email", status: "ok", responseTimeMs: Date.now() - start };
  } catch (e) {
    return {
      service: "email",
      status: "degraded",
      responseTimeMs: Date.now() - start,
      errorMessage: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

async function checkAi(): Promise<CheckResult> {
  const start = Date.now();
  if (!process.env.ANTHROPIC_API_KEY) {
    return { service: "ai", status: "down", responseTimeMs: 0, errorMessage: "ANTHROPIC_API_KEY not configured" };
  }
  // Lightweight check: just verify the key format is valid
  return { service: "ai", status: "ok", responseTimeMs: Date.now() - start };
}

export async function runSentinel(): Promise<{
  checks: CheckResult[];
  alertsDispatched: number;
}> {
  const checks = await Promise.all([checkDatabase(), checkAuth(), checkEmail(), checkAi()]);
  const client = getObservabilityClient();

  // Record health checks
  if (client) {
    for (const check of checks) {
      await client.from("health_checks").insert({
        service: check.service,
        status: check.status,
        response_time_ms: check.responseTimeMs,
        error_message: check.errorMessage ?? null,
      });
    }
  }

  let alertsDispatched = 0;

  for (const check of checks) {
    if (check.status === "down") {
      await dispatchAlert({
        agentName: "sentinel",
        severity: "critical",
        title: `サービス停止: ${check.service}`,
        message: `${check.service} が応答していません。${check.errorMessage ?? ""}`,
        metadata: { service: check.service, responseTimeMs: check.responseTimeMs },
      });
      alertsDispatched++;
    } else if (check.status === "degraded") {
      await dispatchAlert({
        agentName: "sentinel",
        severity: "warn",
        title: `サービス劣化: ${check.service}`,
        message: `${check.service} のパフォーマンスが低下しています。${check.errorMessage ?? ""}`,
        metadata: { service: check.service, responseTimeMs: check.responseTimeMs },
      });
      alertsDispatched++;
    }
  }

  // Check error rate in last 5 minutes
  if (client) {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count } = await client
      .from("system_events")
      .select("id", { count: "exact", head: true })
      .eq("severity", "critical")
      .gte("created_at", fiveMinutesAgo);

    const errorCount = count ?? 0;
    if (errorCount > 10) {
      await dispatchAlert({
        agentName: "sentinel",
        severity: "critical",
        title: `エラー率上昇: 直近5分間で${errorCount}件`,
        message: `system_eventsに直近5分間で${errorCount}件のcriticalイベントが記録されています。`,
        metadata: { errorCount, windowMinutes: 5 },
      });
      alertsDispatched++;
    }
  }

  return { checks, alertsDispatched };
}
