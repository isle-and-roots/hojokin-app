"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle, XCircle, ArrowUpRight } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

interface QuotaProgressBannerProps {
  remaining: number;
  limit: number;
  plan: string;
}

export function QuotaProgressBanner({
  remaining,
  limit,
  plan,
}: QuotaProgressBannerProps) {
  const isPaidPlan = plan !== "free";

  useEffect(() => {
    if (remaining <= 2) {
      posthog.capture(EVENTS.PROGRESSIVE_UPSELL_SHOWN, {
        remaining,
        limit,
        plan,
      });
    }
  }, [remaining, limit, plan]);

  // Don't show for paid plans with plenty of quota, or if remaining > 2
  if (remaining > 2 || (isPaidPlan && remaining > 0)) return null;

  if (remaining === 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              今月の無料AI生成回数を使い切りました
            </p>
            <p className="text-xs text-red-600 mt-1">
              アップグレードすると最大500回/月まで生成できます
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            アップグレード
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  if (remaining === 1) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">
              無料AI生成が残り<span className="font-bold">1回</span>です
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Starterプランなら月15回、Proなら100回まで生成可能
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-600 text-white text-xs font-medium hover:bg-yellow-700 transition-colors shrink-0"
          >
            プランを見る
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  // remaining === 2
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800 flex-1">
          無料AI生成が残り<span className="font-semibold">2回</span>です。
          アップグレードでもっと活用しませんか？
        </p>
        <Link
          href="/pricing"
          className="text-xs text-blue-700 hover:underline font-medium flex items-center gap-1 shrink-0"
        >
          プランを見る
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
