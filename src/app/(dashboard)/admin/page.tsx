import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubsidyTable, IngestionPanel } from "@/components/admin/subsidy-table";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export default async function AdminPage() {
  // 管理者チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  // Service Roleで補助金とログを取得
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return <div className="p-8">Supabase環境変数が設定されていません</div>;
  }

  const serviceClient = createServiceClient(url, key, {
    auth: { persistSession: false },
  });

  const [subsidiesRes, logsRes] = await Promise.all([
    serviceClient
      .from("subsidies")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .limit(50),
    serviceClient
      .from("ingestion_logs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">補助金管理</h1>

      {/* 統計サマリー */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">総補助金数</p>
          <p className="text-2xl font-bold">{subsidiesRes.count ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">手動登録</p>
          <p className="text-2xl font-bold">
            {subsidiesRes.data?.filter((s) => s.source === "manual").length ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">jGrants取込</p>
          <p className="text-2xl font-bold">
            {subsidiesRes.data?.filter((s) => s.source === "jgrants").length ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">最終取込</p>
          <p className="text-sm font-medium">
            {logsRes.data?.[0]
              ? new Date(logsRes.data[0].started_at).toLocaleString("ja-JP")
              : "未実行"}
          </p>
        </div>
      </div>

      {/* 取込パネル */}
      <div className="mb-6">
        <IngestionPanel logs={logsRes.data ?? []} />
      </div>

      {/* 補助金テーブル */}
      <SubsidyTable
        initialItems={subsidiesRes.data ?? []}
        initialTotal={subsidiesRes.count ?? 0}
      />
    </div>
  );
}
