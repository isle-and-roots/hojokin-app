import Link from "next/link";
import { Banknote, Calendar, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import type { SubsidyInfo } from "@/types";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  DIFFICULTY_CONFIG,
  PROMPT_SUPPORT_CONFIG,
} from "@/lib/data/subsidy-categories";

export function SubsidyCard({ subsidy }: { subsidy: SubsidyInfo }) {
  const primaryCategory = subsidy.categories[0];
  const difficultyConf = DIFFICULTY_CONFIG[subsidy.difficulty];
  const promptConf = PROMPT_SUPPORT_CONFIG[subsidy.promptSupport];

  const formatAmount = (amount: number | null) => {
    if (amount === null) return "—";
    if (amount >= 10000) return `${(amount / 10000).toLocaleString()}億円`;
    return `${amount.toLocaleString()}万円`;
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "随時受付";
    const d = new Date(deadline);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1.5">
          {primaryCategory && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[primaryCategory]}`}
            >
              {CATEGORY_LABELS[primaryCategory]}
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${difficultyConf.color}`}
          >
            {difficultyConf.label}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${promptConf.color}`}
        >
          {subsidy.promptSupport !== "NONE" && (
            <Sparkles className="h-3 w-3" />
          )}
          {promptConf.label}
        </span>
      </div>

      <h3 className="font-semibold text-base mb-1">{subsidy.name}</h3>
      <p className="text-xs text-muted-foreground mb-2">{subsidy.department}</p>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {subsidy.summary}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 border-t border-border pt-3">
        <span className="flex items-center gap-1">
          <Banknote className="h-3.5 w-3.5" />
          上限 {formatAmount(subsidy.maxAmount)}
        </span>
        <span>補助率 {subsidy.subsidyRate}</span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDeadline(subsidy.deadline)}
        </span>
      </div>

      {subsidy.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {subsidy.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Link
          href={`/subsidies/${subsidy.id}`}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          詳細を見る
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        {subsidy.promptSupport !== "NONE" && subsidy.isActive && (
          <Link
            href={`/applications/new?subsidyId=${subsidy.id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ml-auto"
          >
            この補助金で申請を作成
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
