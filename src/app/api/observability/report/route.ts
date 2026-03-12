import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/lib/observability/logger";

export async function POST(request: NextRequest) {
  try {
    // Origin チェック (CSRF 対策)
    const origin = request.headers.get("origin");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (origin && siteUrl && !origin.startsWith(siteUrl) && !origin.startsWith("http://localhost")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const type = body.type as string;

    if (type === "web_vital") {
      logEvent({
        eventType: "web_vital",
        severity: "info",
        source: "client/web-vitals",
        message: `${body.name}: ${body.value}`,
        metadata: {
          name: body.name,
          value: body.value,
          rating: body.rating,
          metricId: body.id,
        },
      });
    } else if (type === "client_error") {
      logEvent({
        eventType: "client_error",
        severity: "critical",
        source: "client/error",
        message: body.message || "Unknown client error",
        metadata: {
          stack: body.stack,
          url: body.url,
          errorSource: body.source,
          line: body.line,
          col: body.col,
          errorType: body.type,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Never fail on observability
  }
}
