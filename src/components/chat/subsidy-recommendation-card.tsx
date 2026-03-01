"use client";

import Link from "next/link";
import { Banknote, Calendar, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { ALL_SUBSIDIES } from "@/lib/data/subsidies";

function formatAmount(amount: number | null): string {
  if (amount === null) return "要確認";
  if (amount >= 10000) return `${(amount / 10000).toLocaleString()}億円`;
  return `${amount.toLocaleString()}万円`;
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "随時受付";
  const d = new Date(deadline);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function getDaysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

const AI_SUPPORT_CONFIG = {
  FULL: { label: "AI対応◎", color: "bg-green-50 text-green-700" },
  GENERIC: { label: "AI対応○", color: "bg-blue-50 text-blue-700" },
  NONE: { label: "AI対応なし", color: "bg-gray-50 text-gray-500" },
} as const;

interface SubsidyRecommendationCardProps {
  subsidyId: string;
}

export function SubsidyRecommendationCard({ subsidyId }: SubsidyRecommendationCardProps) {
  const subsidy = ALL_SUBSIDIES.find((s) => s.id === subsidyId);

  if (!subsidy) return null;

  const aiConfig = AI_SUPPORT_CONFIG[subsidy.promptSupport];
  const daysLeft = getDaysLeft(subsidy.deadline);

  return (
    <div className="my-2 rounded-xl border border-primary/20 bg-card shadow-sm overflow-hidden">
      {/* 左アクセントバー */}
      <div className="flex">
        <div className="w-1 shrink-0 bg-primary/60" />
        <div className="flex-1 p-4">
          {/* ヘッダー */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-sm leading-snug">{subsidy.nameShort || subsidy.name}</h4>
            <span
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${aiConfig.color}`}
            >
              {subsidy.promptSupport !== "NONE" && <Sparkles className="h-3 w-3" />}
              {aiConfig.label}
            </span>
          </div>

          {/* サマリー */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{subsidy.summary}</p>

          {/* 詳細情報 */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Banknote className="h-3.5 w-3.5" />
              上限 {formatAmount(subsidy.maxAmount)}
            </span>
            <span>補助率 {subsidy.subsidyRate}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDeadline(subsidy.deadline)}
              {daysLeft !== null && daysLeft > 0 && daysLeft <= 14 && (
                <span className="text-red-600 font-medium">（あと{daysLeft}日）</span>
              )}
              {daysLeft !== null && daysLeft > 14 && daysLeft <= 30 && (
                <span className="text-orange-600 font-medium">（あと{daysLeft}日）</span>
              )}
            </span>
          </div>

          {/* アクションボタン */}
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <Link
              href={`/subsidies/${subsidy.id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-accent transition-colors"
            >
              詳細を見る
              <ExternalLink className="h-3 w-3" />
            </Link>
            {subsidy.promptSupport !== "NONE" && subsidy.isActive && (
              <Link
                href={`/applications/new?subsidyId=${subsidy.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ml-auto"
              >
                この補助金で申請を作成
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
