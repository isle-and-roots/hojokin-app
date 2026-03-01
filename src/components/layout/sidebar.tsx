"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Search,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { name: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
  { name: "企業プロフィール", href: "/profile", icon: Building2 },
  { name: "補助金検索", href: "/subsidies", icon: Search },
  { name: "申請一覧", href: "/applications", icon: FileText },
  { name: "料金プラン", href: "/pricing", icon: CreditCard },
  { name: "アカウント設定", href: "/settings", icon: Settings },
];

function NavContent({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <nav className="flex flex-col gap-1 p-4 flex-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:translate-x-0.5 transition-transform duration-200",
                isActive
                  ? "relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-[3px] before:rounded-full before:bg-primary bg-primary/5 text-primary font-medium"
                  : "font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* モバイルハンバーガーボタン */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border shadow-sm"
        aria-label="メニューを開く"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* モバイルオーバーレイ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* モバイルサイドバー */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-gradient-to-b from-card to-muted/30 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <div>
              <h1 className="text-sm font-bold">補助金サポート</h1>
              <p className="text-xs text-muted-foreground">ISLE & ROOTS</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-accent"
            aria-label="メニューを閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavContent
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* デスクトップサイドバー */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-gradient-to-b from-card to-muted/30 flex-col hidden lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <div>
            <h1 className="text-sm font-bold">補助金サポート</h1>
            <p className="text-xs text-muted-foreground">ISLE & ROOTS</p>
          </div>
        </div>
        <NavContent pathname={pathname} onLogout={handleLogout} />
      </aside>
    </>
  );
}
