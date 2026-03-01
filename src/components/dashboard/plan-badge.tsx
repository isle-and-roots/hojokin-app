"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, ArrowUpRight } from "lucide-react";
import { PLAN_LIST, type PlanKey } from "@/lib/plans";

function isPlanKey(v: unknown): v is PlanKey {
  return v === "free" || v === "starter" || v === "pro" || v === "business";
}

export function PlanBadgeCard() {
  const [plan, setPlan] = useState<PlanKey | null>(null);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (data: { userProfile?: { plan: unknown } } | null) => {
          if (!data?.userProfile) return;
          const p = data.userProfile.plan;
          setPlan(isPlanKey(p) ? p : "free");
        }
      )
      .catch(() => {
        /* ignore */
      });
  }, []);

  if (plan === null) return null;

  const planInfo = PLAN_LIST.find((p) => p.key === plan);
  const isPaid = plan !== "free";

  return (
    <div className={`rounded-xl border p-6 relative overflow-hidden ${isPaid ? 'border-primary/30 bg-card shadow-md shadow-primary/5' : 'border-border bg-card'}`}>
      {isPaid && (
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40" />
      )}
      <div className="flex items-center gap-3">
        <Crown className={`h-5 w-5 ${isPaid ? "text-primary" : "text-muted-foreground"}`} />
        <span className="text-sm text-muted-foreground">現在のプラン</span>
      </div>
      <p className="mt-2 text-3xl font-bold">{planInfo?.name ?? "Free"}</p>
      {isPaid ? (
        <Link
          href="/settings"
          className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          プラン管理
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <Link
          href="/pricing"
          className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          アップグレード
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
