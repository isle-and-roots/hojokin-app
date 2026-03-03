"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchX, ArrowUp, RotateCcw, MessageCircle, List } from "lucide-react";
import type { SubsidyInfo } from "@/types";
import { SubsidyCard } from "./subsidy-card";

type SortKey = "popularity" | "amount" | "deadline";

export function SubsidyList({ items, onReset }: { items: SubsidyInfo[]; onReset?: () => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("popularity");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <p className="text-sm text-muted-foreground mb-5">
          検索条件を変更してお試しください
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-border hover:bg-accent transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              フィルタをリセット
            </button>
          )}
          <Link
            href="/chat"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-border hover:bg-accent transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            AIに相談する
          </Link>
          <Link
            href="/subsidies"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-border hover:bg-accent transition-colors"
          >
            <List className="h-3.5 w-3.5" />
            すべての補助金を見る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium mr-1.5">
            {items.length}
          </span>
          件の補助金
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
      <div className="space-y-3 stagger-children">
        {sorted.map((s) => (
          <SubsidyCard key={s.id} subsidy={s} now={now} />
        ))}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-[0.97] transition-all animate-[scale-in_200ms_ease-out]"
          aria-label="ページトップへ戻る"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
