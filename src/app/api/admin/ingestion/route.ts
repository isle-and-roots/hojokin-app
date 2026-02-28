import { NextRequest, NextResponse } from "next/server";
import { isCurrentUserAdmin } from "@/lib/db/admin";
import { getIngestionLogs } from "@/lib/db/subsidies";
import { runIngestionPipeline } from "@/lib/ingestion/pipeline";

/** GET /api/admin/ingestion — 取込ログ一覧 */
export async function GET() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  const logs = await getIngestionLogs(20);
  return NextResponse.json({ logs });
}

/** POST /api/admin/ingestion — 手動取込実行 */
export async function POST(request: NextRequest) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  // CSRF対策: Content-Typeチェック
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json({ error: "不正なリクエスト" }, { status: 400 });
  }

  const result = await runIngestionPipeline();

  return NextResponse.json({
    success: result.status !== "failed",
    ...result,
  });
}
