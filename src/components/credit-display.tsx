"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { type PlanKey, getAiLimit } from "@/lib/plans";

interface CreditDisplayProps {
  variant?: "card" | "compact";
  onQuotaLoaded?: (remaining: number) => void;
}

interface QuotaData {
  plan: PlanKey;
  used: number;
  limit: number;
  remaining: number;
  resetMonth: string;
}

function isPlanKey(v: unknown): v is PlanKey {
  return v === "free" || v === "pro" || v === "business";
}

export function CreditDisplay({
  variant = "card",
  onQuotaLoaded,
}: CreditDisplayProps) {
  const [quota, setQuota] = useState<QuotaData | null>(null);

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
          onQuotaLoaded?.(remaining);
        }
      )
      .catch(() => {
        /* ignore — component hides on error */
      });
  }, [onQuotaLoaded]);

  if (!quota) return null;

  const percent = quota.limit > 0 ? (quota.remaining / quota.limit) * 100 : 0;
  const barColor =
    percent > 50
      ? "bg-green-500"
      : percent > 25
        ? "bg-yellow-500"
        : "bg-red-500";

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">AI残り</span>
          <span className="font-semibold">
            {quota.remaining}/{quota.limit}
          </span>
        </div>
        <div className="w-20 h-1.5 rounded-full bg-border">
          <div
            className={`h-1.5 rounded-full transition-all ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {quota.remaining === 0 && (
          <Link
            href="/pricing"
            className="text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            アップグレード
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          AI生成（{quota.resetMonth}分）
        </span>
      </div>
      <p className="text-3xl font-bold">
        {quota.remaining}
        <span className="text-base font-normal text-muted-foreground">
          /{quota.limit}回
        </span>
      </p>
      <div className="mt-3 h-2 rounded-full bg-border">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {quota.remaining === 0 && (
        <Link
          href="/pricing"
          className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          プランをアップグレード
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
