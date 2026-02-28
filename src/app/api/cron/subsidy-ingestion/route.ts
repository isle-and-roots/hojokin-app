import { NextRequest, NextResponse } from "next/server";
import { runIngestionPipeline } from "@/lib/ingestion/pipeline";
import { getPostHogServer } from "@/lib/posthog/server";

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

    const posthog = getPostHogServer();

    const result = await runIngestionPipeline();

    posthog?.capture({
      distinctId: "system",
      event: "subsidy_ingestion_completed",
      properties: {
        status: result.status,
        total_fetched: result.totalFetched,
        total_upserted: result.totalUpserted,
        total_skipped: result.totalSkipped,
        total_errors: result.totalErrors,
        deactivated: result.deactivated,
        has_next: result.nextCursor !== null,
      },
    });

    return NextResponse.json({
      success: result.status !== "failed",
      ...result,
    });
  } catch (error) {
    console.error("[SubsidyIngestion] Unexpected error:", error);
    return NextResponse.json(
      { error: "補助金取込処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
