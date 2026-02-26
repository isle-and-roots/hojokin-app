"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Crown } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

interface GenerationUpsellBannerProps {
  plan: string;
}

export function GenerationUpsellBanner({ plan }: GenerationUpsellBannerProps) {
  const isFreeOrStarter = plan === "free" || plan === "starter";

  useEffect(() => {
    if (isFreeOrStarter) {
      posthog.capture(EVENTS.UPSELL_BANNER_SHOWN, {
        source: "generation_result",
        plan,
      });
    }
  }, [isFreeOrStarter, plan]);

  if (!isFreeOrStarter) return null;

  const handleClick = () => {
    posthog.capture(EVENTS.UPSELL_BANNER_CLICKED, {
      source: "generation_result",
      plan,
    });
  };

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-purple-50/50 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-1.5 shrink-0 mt-0.5">
          <Crown className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {plan === "free"
              ? "Proなら全補助金で高品質AI生成が使い放題"
              : "Proにアップグレードして申請書を無制限に作成"}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span>
              AI生成 100回/月
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span>
              全補助金 AI対応
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span>
              申請書 無制限
            </div>
          </div>
        </div>
        <Link
          href="/pricing"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Pro を試す
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
