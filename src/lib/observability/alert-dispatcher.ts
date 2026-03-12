import { getObservabilityClient } from "./admin-client";
import { getResend } from "@/lib/email/client";
import type { Severity, AgentName } from "./types";

type DispatchAlertParams = {
  userId?: string;
  agentName: AgentName;
  severity: Severity;
  title: string;
  message: string;
  metadata?: Record<string, unknown> | null;
};

export async function dispatchAlert(params: DispatchAlertParams): Promise<void> {
  try {
    const client = getObservabilityClient();
    if (!client) return;

    // Deduplicate — skip insert if same alert exists within 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await client
      .from("agent_alerts")
      .select("id, metadata")
      .eq("agent_name", params.agentName)
      .eq("title", params.title)
      .eq("status", "open")
      .gte("created_at", twentyFourHoursAgo)
      .limit(1);

    if (existing && existing[0]) {
      // Update occurrence count on existing alert
      const existingMeta = (existing[0].metadata ?? {}) as Record<string, unknown>;
      await client
        .from("agent_alerts")
        .update({
          severity: params.severity,
          metadata: {
            ...existingMeta,
            occurrenceCount: ((existingMeta.occurrenceCount as number) ?? 1) + 1,
            lastSeenAt: new Date().toUTCString(),
          },
        })
        .eq("id", existing[0].id);
      return; // Skip webhook/email re-send
    }

    await client.from("agent_alerts").insert({
      user_id: params.userId ?? null,
      agent_name: params.agentName,
      severity: params.severity,
      title: params.title,
      message: params.message,
      metadata: params.metadata ?? {},
    });

    if (params.severity === "critical") {
      const alertEmail = process.env.ALERT_EMAIL;
      if (alertEmail) {
        const resend = getResend();
        if (resend) {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "noreply@hojokin.isle-and-roots.com",
            to: alertEmail,
            subject: `[hojokin CRITICAL] ${params.title}`,
            text: `Agent: ${params.agentName}\nSeverity: ${params.severity}\n\n${params.message}`,
          });
        }
      }
    }

    // Webhook notification (Slack/Discord compatible)
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;
    if (webhookUrl && (params.severity === "critical" || params.severity === "warn")) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `[${params.severity.toUpperCase()}] ${params.title}\nAgent: ${params.agentName}\n${params.message}`,
        }),
      }).catch(() => {});
    }
  } catch (error) {
    console.error("[alert-dispatcher] Failed to dispatch alert:", error);
  }
}
