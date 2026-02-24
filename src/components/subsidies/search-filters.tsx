"use client";

import { Search, RotateCcw } from "lucide-react";
import type { SubsidyCategory, SubsidySearchFilters } from "@/types";
import { CATEGORY_LABELS, DIFFICULTY_CONFIG } from "@/lib/data/subsidy-categories";

const AMOUNT_RANGES = [
  { label: "〜100万", min: undefined, max: 100 },
  { label: "〜500万", min: undefined, max: 500 },
  { label: "〜1000万", min: undefined, max: 1000 },
  { label: "1000万〜", min: 1000, max: undefined },
];

const DEADLINE_OPTIONS = [
  { label: "1ヶ月以内", days: 30 },
  { label: "3ヶ月以内", days: 90 },
  { label: "全て", days: undefined },
];

interface SearchFiltersProps {
  filters: SubsidySearchFilters;
  onChange: (filters: SubsidySearchFilters) => void;
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const toggleCategory = (cat: SubsidyCategory) => {
    const current = filters.categories || [];
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onChange({ ...filters, categories: next.length > 0 ? next : undefined });
  };

  const setAmountRange = (range: (typeof AMOUNT_RANGES)[number]) => {
    const current = filters.maxAmountRange;
    if (current?.min === range.min && current?.max === range.max) {
      onChange({ ...filters, maxAmountRange: undefined });
      return;
    }
    onChange({
      ...filters,
      maxAmountRange: { min: range.min, max: range.max },
    });
  };

  const setDeadline = (days: number | undefined) => {
    onChange({ ...filters, deadlineWithin: days });
  };

  const toggleDifficulty = (d: "EASY" | "MEDIUM" | "HARD") => {
    const current = filters.difficulty || [];
    const next = current.includes(d)
      ? current.filter((x) => x !== d)
      : [...current, d];
    onChange({ ...filters, difficulty: next.length > 0 ? next : undefined });
  };

  const toggleAiOnly = () => {
    const current = filters.promptSupport;
    if (current && current.length > 0) {
      onChange({ ...filters, promptSupport: undefined });
    } else {
      onChange({ ...filters, promptSupport: ["FULL", "GENERIC"] });
    }
  };

  const resetFilters = () => {
    onChange({ keyword: filters.keyword });
  };

  const hasActiveFilters =
    (filters.categories && filters.categories.length > 0) ||
    filters.maxAmountRange ||
    filters.deadlineWithin ||
    (filters.difficulty && filters.difficulty.length > 0) ||
    (filters.promptSupport && filters.promptSupport.length > 0);

  return (
    <div className="space-y-4">
      {/* Keyword */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={filters.keyword || ""}
          onChange={(e) => onChange({ ...filters, keyword: e.target.value || undefined })}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="補助金名、キーワードで検索..."
        />
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">カテゴリ</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(CATEGORY_LABELS) as [SubsidyCategory, string][])
            .filter(([key]) => key !== "OTHER")
            .map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleCategory(key)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  filters.categories?.includes(key)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {label}
              </button>
            ))}
        </div>
      </div>

      {/* Amount Range */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">上限額</p>
        <div className="flex flex-wrap gap-1.5">
          {AMOUNT_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => setAmountRange(range)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                filters.maxAmountRange?.min === range.min &&
                filters.maxAmountRange?.max === range.max
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">締切</p>
        <div className="flex flex-wrap gap-1.5">
          {DEADLINE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setDeadline(opt.days)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                filters.deadlineWithin === opt.days
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">難易度</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(DIFFICULTY_CONFIG) as [
            "EASY" | "MEDIUM" | "HARD",
            { label: string; color: string },
          ][]).map(([key, conf]) => (
            <button
              key={key}
              onClick={() => toggleDifficulty(key)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                filters.difficulty?.includes(key)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {conf.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Toggle + Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={
              filters.promptSupport !== undefined &&
              filters.promptSupport.length > 0
            }
            onChange={toggleAiOnly}
            className="rounded border-border"
          />
          AI対応のみ表示
        </label>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            フィルタをリセット
          </button>
        )}
      </div>
    </div>
  );
}
