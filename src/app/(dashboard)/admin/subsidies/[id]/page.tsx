import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { SubsidyForm } from "@/components/admin/subsidy-form";

export default async function AdminSubsidyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  // Service Roleで補助金データ取得
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return <div className="p-8">Supabase環境変数が設定されていません</div>;
  }

  const serviceClient = createServiceClient(url, key, {
    auth: { persistSession: false },
  });

  const { data: subsidy } = await serviceClient
    .from("subsidies")
    .select("*")
    .eq("id", id)
    .single();

  if (!subsidy) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">補助金編集: {subsidy.name_short}</h1>
      <SubsidyForm subsidy={subsidy} />
    </div>
  );
}
