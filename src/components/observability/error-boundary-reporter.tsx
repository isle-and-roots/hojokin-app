"use client";

import { useEffect } from "react";

function reportClientError(data: Record<string, unknown>) {
  const body = JSON.stringify({ type: "client_error", ...data });
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/observability/report", body);
  } else {
    fetch("/api/observability/report", {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }
}

export function ErrorBoundaryReporter() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      reportClientError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        source: event.filename,
        line: event.lineno,
        col: event.colno,
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      reportClientError({
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        url: window.location.href,
        type: "unhandledrejection",
      });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
