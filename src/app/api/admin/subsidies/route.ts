import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isCurrentUserAdmin } from "@/lib/db/admin";

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 環境変数が設定されていません");
  return createClient(url, key, { auth: { persistSession: false } });
}

/** GET /api/admin/subsidies — 補助金一覧（管理者用） */
export async function GET(request: NextRequest) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const url = new URL(request.url);
  const source = url.searchParams.get("source");
  const search = url.searchParams.get("search");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("subsidies")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (source) {
    query = query.eq("source", source);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,name_short.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data,
    total: count,
    page,
    limit,
  });
}

/** POST /api/admin/subsidies — 補助金作成 */
export async function POST(request: NextRequest) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("subsidies")
    .insert({ ...body, source: "manual" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
