"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

interface ProfileCompletenessBannerProps {
  completeness: number;
  plan: string;
}

export function ProfileCompletenessBanner({
  completeness,
  plan,
}: ProfileCompletenessBannerProps) {
  const isLowCompleteness = completeness < 50;
  const isFreeOrStarter = plan === "free" || plan === "starter";

  useEffect(() => {
    if (isLowCompleteness && isFreeOrStarter) {
      posthog.capture(EVENTS.UPSELL_BANNER_SHOWN, {
        source: "profile_low",
        completeness,
        plan,
      });
    }
  }, [isLowCompleteness, isFreeOrStarter, completeness, plan]);

  if (!isLowCompleteness || !isFreeOrStarter) return null;

  const handleClick = () => {
    posthog.capture(EVENTS.UPSELL_BANNER_CLICKED, {
      source: "profile_low",
      plan,
    });
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-blue-100 p-1.5 shrink-0 mt-0.5">
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">
            プロフィール充実度 {completeness}% — Proなら詳細マッチング分析が利用可能
          </p>
          <p className="text-xs text-blue-700 mt-1">
            プロフィールを充実させると、より精度の高い補助金マッチングとAI生成が可能になります
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href="/profile"
              className="text-xs text-blue-700 hover:underline font-medium flex items-center gap-1"
            >
              プロフィールを充実させる
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link
              href="/pricing"
              onClick={handleClick}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              Pro を見る
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
