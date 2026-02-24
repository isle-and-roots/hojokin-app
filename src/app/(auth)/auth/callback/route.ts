import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { identifyUser } from "@/lib/posthog/track";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // PostHog にユーザーを識別
          identifyUser(user.id, {
            email: user.email,
            auth_provider: "google",
          });

          const { count, error: profileError } = await supabase
            .from("business_profiles")
            .select("user_id", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (!profileError && count === 0) {
            return NextResponse.redirect(`${origin}/dashboard?welcome=true`);
          }
        }
      } catch {
        // プロフィールチェックが失敗しても認証フローを壊さない
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // コード交換に失敗した場合、ログインページにリダイレクト
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
