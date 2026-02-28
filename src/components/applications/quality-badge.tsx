"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QualityScoreResult, QualityGrade } from "@/lib/reports/quality-score";

interface QualityBadgeProps {
  result: QualityScoreResult;
  className?: string;
}

const GRADE_STYLES: Record<QualityGrade, { bg: string; text: string; border: string }> = {
  A: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  B: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  C: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  D: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  F: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const GRADE_LABELS: Record<QualityGrade, string> = {
  A: "非常に高品質",
  B: "高品質",
  C: "標準",
  D: "改善が必要",
  F: "大幅な改善が必要",
};

const BREAKDOWN_LABELS: Record<keyof QualityScoreResult["breakdown"], string> = {
  completeness: "充実度",
  specificity: "具体性",
  consistency: "一貫性",
  compliance: "ルール適合",
  readability: "読みやすさ",
};

const BREAKDOWN_WEIGHTS: Record<keyof QualityScoreResult["breakdown"], number> = {
  completeness: 30,
  specificity: 25,
  consistency: 15,
  compliance: 20,
  readability: 10,
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-500"
      : score >= 60
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{score}</span>
    </div>
  );
}

export function QualityBadge({ result, className }: QualityBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const styles = GRADE_STYLES[result.grade];

  return (
    <div
      className={cn(
        "rounded-lg border text-sm overflow-hidden",
        styles.bg,
        styles.border,
        className
      )}
    >
      {/* ヘッダー */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 hover:opacity-80 transition-opacity",
          styles.text
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">{result.grade}</span>
          <div className="text-left">
            <p className="font-medium">{GRADE_LABELS[result.grade]}</p>
            <p className="text-xs opacity-70">品質スコア: {result.totalScore} / 100</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" />
        )}
      </button>

      {/* 詳細ブレークダウン */}
      {expanded && (
        <div className="border-t border-current/10 px-4 py-3 space-y-2.5 bg-white/50">
          {(
            Object.entries(result.breakdown) as [
              keyof QualityScoreResult["breakdown"],
              number,
            ][]
          ).map(([key, score]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className={cn("text-xs font-medium", styles.text)}>
                  {BREAKDOWN_LABELS[key]}
                  <span className="opacity-60 font-normal ml-1">
                    (重み {BREAKDOWN_WEIGHTS[key]}%)
                  </span>
                </span>
              </div>
              <ScoreBar score={score} />
            </div>
          ))}

          {result.sectionScores.length > 0 && (
            <div className="pt-1 border-t border-current/10">
              <p className={cn("text-xs font-medium mb-2", styles.text)}>
                セクション別スコア
              </p>
              <div className="space-y-1.5">
                {result.sectionScores.map(({ sectionKey, sectionTitle, score }) => (
                  <div key={sectionKey}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {sectionTitle}
                      </span>
                    </div>
                    <ScoreBar score={score} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
