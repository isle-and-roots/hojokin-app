export type Severity = "info" | "warn" | "critical";

export type EventType =
  | "error"
  | "rate_limit_hit"
  | "rate_limit_tick"
  | "auth_failure"
  | "api_request"
  | "system_check"
  | "agent_run"
  | "email_sent"
  | "email_failed"
  | "billing_webhook"
  | "billing_webhook_error"
  | "ai_request"
  | "ai_error"
  | "api_request_complete"
  | "web_vital"
  | "client_error"
  | "subsidy_ingestion";

export type AgentName =
  | "sentinel"
  | "ai-monitor"
  | "billing-monitor"
  | "subsidy-watcher";

export type AlertStatus = "open" | "acknowledged" | "resolved" | "dismissed";

export type ServiceName = "database" | "auth" | "email" | "ai";

export type ServiceStatus = "ok" | "degraded" | "down";
