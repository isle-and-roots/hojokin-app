"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Monitor,
  Wrench,
  MapPin,
  GraduationCap,
  RefreshCw,
  Leaf,
  FlaskConical,
  FolderOpen,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubsidyCategory, PromptSupport } from "@/types";

interface TopSubsidy {
  name: string;
  nameShort: string;
  promptSupport: PromptSupport;
  maxAmount: number | null;
  subsidyRate: string;
}

export interface CategoryData {
  key: SubsidyCategory;
  label: string;
  count: number;
  aiCount: number;
  fullCount: number;
  topSubsidies: TopSubsidy[];
  colorClass: string;
}

interface CategoryTabsProps {
  categories: CategoryData[];
}

const CATEGORY_ICONS: Record<SubsidyCategory, LucideIcon> = {
  HANBAI_KAIKAKU: TrendingUp,
  IT_DIGITAL: Monitor,
  SETSUBI_TOUSHI: Wrench,
  CHIIKI_KASSEIKA: MapPin,
  JINZAI_IKUSEI: GraduationCap,
  SOUZOU_TENKAN: RefreshCw,
  KANKYOU_ENERGY: Leaf,
  KENKYUU_KAIHATSU: FlaskConical,
  OTHER: FolderOpen,
};

const PROMPT_LABELS: Record<PromptSupport, { label: string; color: string }> = {
  FULL: { label: "AI完全対応", color: "text-blue-600 bg-blue-50" },
  GENERIC: { label: "AI対応", color: "text-indigo-600 bg-indigo-50" },
  NONE: { label: "AI未対応", color: "text-gray-500 bg-gray-50" },
};

function formatAmount(amount: number | null): string {
  if (amount === null) return "要確認";
  if (amount >= 10000) return `${(amount / 10000).toFixed(0)}億円`;
  if (amount >= 1) return `${amount}万円`;
  return `${amount}万円`;
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = categories[activeIndex];
  const Icon = CATEGORY_ICONS[active.key];

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
        {categories.map((cat, i) => {
          const CatIcon = CATEGORY_ICONS[cat.key];
          return (
            <button
              key={cat.key}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                i === activeIndex
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              <CatIcon className="h-4 w-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center",
              active.colorClass
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{active.label}</h3>
            <p className="text-sm text-muted-foreground">
              {active.count}件の補助金 ・ AI対応: {active.aiCount}件
              {active.fullCount > 0 && ` ・ AI完全対応: ${active.fullCount}件`}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {active.topSubsidies.map((sub) => {
            const support = PROMPT_LABELS[sub.promptSupport];
            return (
              <div
                key={sub.name}
                className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary/60" />
                  <span className="text-sm font-medium truncate">
                    {sub.nameShort}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    上限 {formatAmount(sub.maxAmount)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      support.color
                    )}
                  >
                    {support.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/subsidies"
          className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
        >
          この分野の補助金をすべて見る
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
