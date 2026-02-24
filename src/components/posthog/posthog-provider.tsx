"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, posthog } from "@/lib/posthog/client";

/** PostHog 初期化 + App Router 対応の自動ページビュー追跡 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      <PostHogPageView />
      {children}
    </>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
