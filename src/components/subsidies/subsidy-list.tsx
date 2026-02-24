"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import type { SubsidyInfo } from "@/types";
import { SubsidyCard } from "./subsidy-card";

type SortKey = "popularity" | "amount" | "deadline";

export function SubsidyList({ items }: { items: SubsidyInfo[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("popularity");

  const sorted = [...items].sort((a, b) => {
    switch (sortKey) {
      case "popularity":
        return b.popularity - a.popularity;
      case "amount":
        return (b.maxAmount ?? 0) - (a.maxAmount ?? 0);
      case "deadline": {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      default:
        return 0;
    }
  });

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <SearchX className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-medium mb-1">該当する補助金が見つかりません</p>
        <p className="text-sm text-muted-foreground">
          検索条件を変更してお試しください
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {items.length}件の補助金
        </p>
        <div className="flex items-center gap-1">
          {(
            [
              { key: "popularity", label: "人気順" },
              { key: "amount", label: "金額順" },
              { key: "deadline", label: "締切順" },
            ] as { key: SortKey; label: string }[]
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortKey(opt.key)}
              className={`rounded-md px-2 py-1 text-xs transition-colors ${
                sortKey === opt.key
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {sorted.map((s) => (
          <SubsidyCard key={s.id} subsidy={s} />
        ))}
      </div>
    </div>
  );
}
