"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import type { SubsidyInfo, SubsidySearchFilters } from "@/types";
import { SearchFilters } from "@/components/subsidies/search-filters";
import { SubsidyList } from "@/components/subsidies/subsidy-list";
import { RecommendationBanner } from "@/components/subsidies/recommendation-banner";
import { OnboardingBanner } from "@/components/subsidies/onboarding-banner";
import { PageTransition } from "@/components/ui/motion";

export function SubsidySearchPage() {
  const [filters, setFilters] = useState<SubsidySearchFilters>({});
  const [items, setItems] = useState<SubsidyInfo[]>([]);
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
    } catch {
      setItems([]);
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
        <SubsidyList items={items} />
      )}
    </div>
    </PageTransition>
  );
}
