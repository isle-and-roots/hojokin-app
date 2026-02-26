"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { type PlanKey, getAiLimit } from "@/lib/plans";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

interface QuotaData {
  plan: PlanKey;
  used: number;
  limit: number;
  remaining: number;
  resetMonth: string;
}

function isPlanKey(v: unknown): v is PlanKey {
  return v === "free" || v === "starter" || v === "pro" || v === "business";
}

export function QuotaWidget() {
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const bannerFired = { current: false };

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (data: {
          userProfile?: {
            plan: string;
            ai_generations_used: number;
            ai_generations_reset_at: string;
          };
        } | null) => {
          if (!data?.userProfile) return;
          const p = data.userProfile;
          const plan = isPlanKey(p.plan) ? p.plan : "free";
          const limit = getAiLimit(plan);
          const used = p.ai_generations_used ?? 0;
          const remaining = Math.max(0, limit - used);
          const resetDate = new Date(p.ai_generations_reset_at);
          const resetMonth = `${resetDate.getMonth() + 1}月`;
          setQuota({ plan, used, limit, remaining, resetMonth });
        }
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!quota) return;
    const pct = quota.limit > 0 ? quota.remaining / quota.limit : 0;
    if (pct <= 0.3 && quota.plan !== "business" && !bannerFired.current) {
      bannerFired.current = true;
      posthog.capture(EVENTS.UPSELL_BANNER_SHOWN, {
        source: "quota_widget",
        remaining: quota.remaining,
        limit: quota.limit,
        plan: quota.plan,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quota]);

  if (!quota) return null;

  const percent = quota.limit > 0 ? (quota.remaining / quota.limit) * 100 : 0;
  const isLow = percent <= 30;
  const isExhausted = quota.remaining === 0;
  const showUpgrade = quota.plan !== "business";

  const barColor = isExhausted
    ? "bg-red-500"
    : isLow
      ? "bg-orange-400"
      : "bg-green-500";

  const borderColor = isExhausted
    ? "border-red-200 bg-red-50/40"
    : isLow
      ? "border-orange-200 bg-orange-50/40"
      : "border-border";

  const handleUpgradeClick = () => {
    posthog.capture(EVENTS.UPSELL_BANNER_CLICKED, {
      source: "quota_widget",
      plan: quota.plan,
    });
  };

  return (
    <div className={`rounded-xl border bg-card p-6 ${borderColor}`}>
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className={`h-5 w-5 ${isExhausted ? "text-red-500" : isLow ? "text-orange-500" : "text-primary"}`} />
        <span className="text-sm text-muted-foreground">
          AI生成残り（{quota.resetMonth}分）
        </span>
      </div>
      <p className={`text-3xl font-bold ${isExhausted ? "text-red-600" : isLow ? "text-orange-600" : ""}`}>
        {quota.remaining}
        <span className="text-base font-normal text-muted-foreground">
          /{quota.limit}回
        </span>
      </p>
      <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showUpgrade && (
        <div className="mt-4">
          {isExhausted ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-xs font-medium text-red-800 mb-2">
                今月の生成回数を使い切りました
              </p>
              <Link
                href="/pricing"
                onClick={handleUpgradeClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                アップグレードで増やす
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          ) : isLow ? (
            <Link
              href="/pricing"
              onClick={handleUpgradeClick}
              className="inline-flex items-center gap-1 text-sm text-orange-700 hover:underline font-medium"
            >
              残りわずか — アップグレードで増やす
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
