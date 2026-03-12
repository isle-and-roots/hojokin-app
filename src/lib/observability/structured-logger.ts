import { logEvent } from "./logger";
import type { EventType } from "./types";

type LogParams = {
  userId?: string;
  metadata?: Record<string, unknown> | null;
};

export function logError(
  source: string,
  message: string,
  error?: unknown,
  params?: LogParams
): void {
  const stack = error instanceof Error ? error.stack : undefined;
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : undefined;
  logEvent({
    userId: params?.userId,
    eventType: "error",
    severity: "critical",
    source,
    message,
    metadata: {
      ...params?.metadata,
      ...(errorMessage && { errorMessage }),
      ...(stack && { stack }),
    },
  });
  console.error(`[${source}] ${message}`, error ?? "");
}

export function logWarn(
  source: string,
  message: string,
  params?: LogParams
): void {
  logEvent({
    userId: params?.userId,
    eventType: "error",
    severity: "warn",
    source,
    message,
    metadata: params?.metadata ?? null,
  });
}

export function logInfo(
  source: string,
  message: string,
  eventType: EventType = "system_check",
  params?: LogParams
): void {
  logEvent({
    userId: params?.userId,
    eventType,
    severity: "info",
    source,
    message,
    metadata: params?.metadata ?? null,
  });
}
