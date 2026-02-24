"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import type { SubsidyInfo, BusinessProfile } from "@/types";
import { PROMPT_SUPPORT_CONFIG } from "@/lib/data/subsidy-categories";

export function RecommendationBanner() {
  const [recommendations, setRecommendations] = useState<SubsidyInfo[]>([]);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("businessProfile");
    if (!stored) return;

    const p: BusinessProfile = JSON.parse(stored);
    setProfile(p);

    fetch("/api/subsidies/recommended", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: p }),
    })
      .then((res) => res.json())
      .then((data) => setRecommendations(data.items ?? []))
      .catch(() => {});
  }, []);

  if (!profile || recommendations.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-sm">
          {profile.companyName}様におすすめの補助金
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recommendations.map((s) => {
          const promptConf = PROMPT_SUPPORT_CONFIG[s.promptSupport];
          return (
            <Link
              key={s.id}
              href={`/subsidies/${s.id}`}
              className="flex flex-col rounded-lg border border-border bg-card p-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${promptConf.color}`}
                >
                  {promptConf.label}
                </span>
              </div>
              <p className="text-sm font-medium line-clamp-2 mb-1">
                {s.name}
              </p>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                上限 {s.maxAmount ? `${s.maxAmount.toLocaleString()}万円` : "—"}
              </p>
              <span className="flex items-center gap-1 text-xs text-primary mt-auto">
                詳細を見る
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
