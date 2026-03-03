"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Clock } from "lucide-react";
import type { SubsidyInfo, SubsidySearchFilters } from "@/types";
import { SearchFilters } from "@/components/subsidies/search-filters";
import { SubsidyList } from "@/components/subsidies/subsidy-list";
import { RecommendationBanner } from "@/components/subsidies/recommendation-banner";
import { OnboardingBanner } from "@/components/subsidies/onboarding-banner";
import { PageTransition } from "@/components/ui/motion";

export function SubsidySearchPage() {
  const [filters, setFilters] = useState<SubsidySearchFilters>({});
  const [items, setItems] = useState<SubsidyInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const doSearch = useCallback(async (f: SubsidySearchFilters) => {
    setLoading(true);
    try {
      const res = await fetch("/api/subsidies/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters: f }),
      });
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setLastUpdated(data.lastUpdated);
    } catch {
      setItems([]);
      setTotal(0);
      setLastUpdated(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(filters);
  }, [filters, doSearch]);

  return (
    <PageTransition>
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">補助金検索</h1>
        <p className="text-muted-foreground mt-1">
          条件を指定して、活用できる補助金を探しましょう
        </p>
        {!loading && total > 0 && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
            <span className="font-medium text-foreground">{total}件</span>の補助金から検索
            {lastUpdated && (
              <>
                <span className="mx-1">|</span>
                <Clock className="h-3.5 w-3.5" />
                最終更新: {new Date(lastUpdated).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })}
              </>
            )}
          </p>
        )}
      </div>

      <Suspense fallback={null}>
        <OnboardingBanner />
      </Suspense>

      <RecommendationBanner />

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <SearchFilters filters={filters} onChange={setFilters} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-16 rounded-full skeleton-shimmer" />
                <div className="h-5 w-20 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-5 w-3/4 rounded skeleton-shimmer mb-2" />
              <div className="h-4 w-1/2 rounded skeleton-shimmer mb-3" />
              <div className="h-4 w-full rounded skeleton-shimmer mb-1" />
              <div className="h-4 w-4/5 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <SubsidyList items={items} onReset={() => setFilters({})} />
      )}
    </div>
    </PageTransition>
  );
}
