import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { IdentifyUser } from "@/components/posthog/identify-user";
import { CommandPaletteTrigger } from "@/components/ui/command-palette-trigger";
import { SpotlightTour } from "@/components/onboarding/spotlight-tour";
import type { PlanKey } from "@/lib/plans";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // PostHog ユーザー識別用にプラン情報を取得
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (userProfile?.plan || "free") as PlanKey;

  return (
    <div className="flex min-h-screen">
      <IdentifyUser
        userId={user.id}
        email={user.email}
        plan={plan}
      />
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">{children}</main>
      <CommandPaletteTrigger plan={plan} />
      <SpotlightTour />
    </div>
  );
}
