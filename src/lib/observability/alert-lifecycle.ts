import { getObservabilityClient } from "./admin-client";
import { getResend } from "@/lib/email/client";

/**
 * Auto-resolve alerts whose underlying condition has cleared.
 * Only resolves "open" alerts for sentinel — checks latest health_checks.
 */
export async function autoResolveAlerts(): Promise<{ resolved: number }> {
  const client = getObservabilityClient();
  if (!client) return { resolved: 0 };

  const { data: openAlerts } = await client
    .from("agent_alerts")
    .select("id, agent_name, title, metadata")
    .eq("status", "open");

  let resolved = 0;

  for (const alert of openAlerts ?? []) {
    let shouldResolve = false;

    if (alert.agent_name === "sentinel" && (alert.title.startsWith("サービス停止") || alert.title.startsWith("サービス劣化"))) {
      const meta = (alert.metadata ?? {}) as Record<string, unknown>;
      const service = meta.service as string | undefined;
      if (service) {
        const { data: latest } = await client
          .from("health_checks")
          .select("status")
          .eq("service", service)
          .order("checked_at", { ascending: false })
          .limit(1);

        shouldResolve = latest?.[0]?.status === "ok";
      }
    }

    if (shouldResolve) {
      await client
        .from("agent_alerts")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          metadata: {
            ...((alert.metadata ?? {}) as Record<string, unknown>),
            autoResolvedAt: new Date().toUTCString(),
          },
        })
        .eq("id", alert.id);
      resolved++;
    }
  }

  return { resolved };
}

/**
 * Escalate stale alerts.
 * - open + info for 24h+ → warn
 * - open + warn for 72h+ → critical (re-fires notifications)
 */
export async function escalateStaleAlerts(): Promise<{ escalated: number }> {
  const client = getObservabilityClient();
  if (!client) return { escalated: 0 };

  let escalated = 0;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

  // info → warn (24h+)
  const { data: infoAlerts } = await client
    .from("agent_alerts")
    .select("id")
    .eq("status", "open")
    .eq("severity", "info")
    .lte("created_at", oneDayAgo);

  for (const alert of infoAlerts ?? []) {
    await client
      .from("agent_alerts")
      .update({ severity: "warn" })
      .eq("id", alert.id);
    escalated++;
  }

  // warn → critical (72h+) + re-fire notifications
  const { data: warnAlerts } = await client
    .from("agent_alerts")
    .select("id, title, agent_name, message")
    .eq("status", "open")
    .eq("severity", "warn")
    .lte("created_at", threeDaysAgo);

  for (const alert of warnAlerts ?? []) {
    await client
      .from("agent_alerts")
      .update({ severity: "critical" })
      .eq("id", alert.id);
    escalated++;

    // Re-fire email notification
    const alertEmail = process.env.ALERT_EMAIL;
    if (alertEmail) {
      try {
        const resend = getResend();
        if (resend) {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "noreply@hojokin.isle-and-roots.com",
            to: alertEmail,
            subject: `[hojokin CRITICAL-ESCALATED] ${alert.title}`,
            text: `Agent: ${alert.agent_name}\nEscalated to CRITICAL after 72h open\n\n${alert.message}`,
          });
        }
      } catch {
        // Best-effort notification
      }
    }
  }

  return { escalated };
}
