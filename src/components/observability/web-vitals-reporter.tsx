"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      type: "web_vital",
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });

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
  });

  return null;
}
