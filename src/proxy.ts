import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // 環境変数未設定・プレースホルダーの場合はスキップ（Supabase未設定の開発環境用）
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // セッション更新（重要: getUser を使用して認証トークンを検証）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 認証不要のパス
  const publicPaths = ["/login", "/auth/callback", "/pricing", "/blog", "/legal"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // /signup へのアクセスは /login にリダイレクト（Google OAuth のみ）
  if (request.nextUrl.pathname === "/signup") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 未認証ユーザーをログインページにリダイレクト
  if (!user && !isPublicPath && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 認証済みユーザーが認証ページにアクセスした場合、ダッシュボードにリダイレクト
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのリクエストにマッチ:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico (ファビコン)
     * - 画像ファイル
     * - API ルート（個別に認証チェック）
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
};
