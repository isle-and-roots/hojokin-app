"use client";

import { cn } from "@/lib/utils";
import type { DiffResult, DiffChange } from "@/lib/reports/diff";

interface ReportDiffViewProps {
  oldLabel?: string;
  newLabel?: string;
  diff: DiffResult;
  className?: string;
}

function InlineDiffContent({ changes }: { changes: DiffChange[] }) {
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
      {changes.map((change, index) => {
        if (change.type === "equal") {
          return <span key={index}>{change.value}</span>;
        }
        if (change.type === "insert") {
          return (
            <span
              key={index}
              className="bg-green-100 text-green-800 rounded px-0.5"
              title="追加"
            >
              {change.value}
            </span>
          );
        }
        // delete
        return (
          <span
            key={index}
            className="bg-red-100 text-red-800 line-through rounded px-0.5"
            title="削除"
          >
            {change.value}
          </span>
        );
      })}
    </p>
  );
}

function SimilarityBar({ similarity }: { similarity: number }) {
  const color =
    similarity >= 80
      ? "bg-green-500"
      : similarity >= 50
        ? "bg-yellow-500"
        : "bg-red-500";

  const label =
    similarity >= 80
      ? "高い類似度"
      : similarity >= 50
        ? "中程度の変更"
        : "大幅な変更";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${similarity}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {similarity}% ({label})
      </span>
    </div>
  );
}

export function ReportDiffView({
  oldLabel = "修正前",
  newLabel = "修正後",
  diff,
  className,
}: ReportDiffViewProps) {
  const { changes, stats, similarity } = diff;

  const hasChanges = stats.inserted > 0 || stats.deleted > 0;

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      {/* ヘッダー: 統計情報 */}
      <div className="bg-muted/30 px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">
              {oldLabel} → {newLabel}
            </span>
            {hasChanges ? (
              <div className="flex items-center gap-3">
                {stats.inserted > 0 && (
                  <span className="text-green-600 font-medium">
                    +{stats.inserted} 追加
                  </span>
                )}
                {stats.deleted > 0 && (
                  <span className="text-red-600 font-medium">
                    -{stats.deleted} 削除
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">変更なし</span>
            )}
          </div>
        </div>
        <SimilarityBar similarity={similarity} />
      </div>

      {/* 差分内容 */}
      <div className="p-4">
        {!hasChanges ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            変更はありません
          </p>
        ) : (
          <div>
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-muted-foreground">凡例:</span>
                <span className="text-xs bg-green-100 text-green-800 rounded px-1.5 py-0.5">
                  追加テキスト
                </span>
                <span className="text-xs bg-red-100 text-red-800 line-through rounded px-1.5 py-0.5">
                  削除テキスト
                </span>
              </div>
            </div>
            <InlineDiffContent changes={changes} />
          </div>
        )}
      </div>

      {/* フッター: 変更統計 */}
      {hasChanges && (
        <div className="bg-muted/20 px-4 py-2 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>変更前: {stats.totalOld} トークン</span>
            <span>変更後: {stats.totalNew} トークン</span>
            <span>共通: {stats.unchanged} トークン</span>
          </div>
        </div>
      )}
    </div>
  );
}
