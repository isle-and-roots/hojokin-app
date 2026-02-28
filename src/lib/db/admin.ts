import { createClient } from "@/lib/supabase/server";

/**
 * 現在のユーザーが管理者かチェック
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return data?.is_admin === true;
}
