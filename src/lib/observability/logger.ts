import { getObservabilityClient } from "./admin-client";
import type { Severity, EventType } from "./types";

type LogEventParams = {
  userId?: string;
  eventType: EventType;
  severity: Severity;
  source: string;
  message: string;
  metadata?: Record<string, unknown> | null;
};

export function logEvent(params: LogEventParams): void {
  const client = getObservabilityClient();
  if (!client) return;

  // Fire-and-forget: do NOT await. Wrap in Promise.resolve to get a real Promise with .catch()
  Promise.resolve(
    client
      .from("system_events")
      .insert({
        user_id: params.userId ?? null,
        event_type: params.eventType,
        severity: params.severity,
        source: params.source,
        message: params.message,
        metadata: params.metadata ?? {},
      })
  )
    .then(({ error }) => {
      if (error) {
        console.error("[observability] Failed to log event:", error.message);
      }
    })
    .catch((err: unknown) => {
      console.error("[observability] Failed to log event:", err);
    });
}
