"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Factory,
  Monitor,
  UtensilsCrossed,
  ShoppingBag,
  HardHat,
  Briefcase,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";
import type { SubsidyInfo } from "@/types";

const INDUSTRIES = [
  { id: "manufacturing", label: "製造業", icon: Factory },
  { id: "it", label: "IT・ソフトウェア", icon: Monitor },
  { id: "food", label: "飲食・食品", icon: UtensilsCrossed },
  { id: "retail", label: "小売・販売", icon: ShoppingBag },
  { id: "construction", label: "建設・建築", icon: HardHat },
  { id: "service", label: "サービス業", icon: Briefcase },
] as const;

type IndustryId = (typeof INDUSTRIES)[number]["id"];

interface RecommendedSubsidy {
  id: string;
  nameShort: string;
  summary: string;
  maxAmount: number | null;
  subsidyRate: string;
  promptSupport: SubsidyInfo["promptSupport"];
}

export function IndustryQuickStart() {
  const [selected, setSelected] = useState<IndustryId | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendedSubsidy[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (industryId: IndustryId) => {
    setSelected(industryId);
    setLoading(true);
    setError(null);
    setResults(null);

    posthog.capture(EVENTS.INDUSTRY_SELECTED, { industry: industryId });

    try {
      const res = await fetch("/api/subsidies/quick-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: industryId }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "取得に失敗しました");
      }

      const data = (await res.json()) as { items: RecommendedSubsidy[] };
      setResults(data.items);

      posthog.capture(EVENTS.FIRST_RECOMMEND_SHOWN, {
        industry: industryId,
        count: data.items.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50/50 p-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">
          まず業種を選んでください
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        あなたに合った補助金を3件ピックアップします
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {INDUSTRIES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            disabled={loading}
            className={[
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150",
              "hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0",
              selected === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card",
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          おすすめ補助金を検索中...
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      )}

      {results && results.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            あなたにおすすめの補助金（上位3件）
          </p>
          {results.map((s) => (
            <Link
              key={s.id}
              href={`/subsidies/${s.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{s.nameShort}</h3>
                  {s.promptSupport === "FULL" && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary shrink-0">
                      <Sparkles className="h-3 w-3" />
                      AI完全対応
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{s.summary}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  上限 {s.maxAmount ? `${s.maxAmount.toLocaleString()}万円` : "—"} | 補助率 {s.subsidyRate}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}

          <Link
            href="/profile?quick=true"
            className="mt-2 flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            プロフィールを登録してさらに精度を上げる
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
