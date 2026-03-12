import { AlertTriangle } from "lucide-react";

const AI_DISCLAIMER_TEXT =
  "この内容はAIによる参考情報です。最終判断はご自身で行ってください。";

/**
 * Standardized AI disclaimer banner.
 * Use this in every UI that displays AI-generated results.
 */
export function AiDisclaimer({
  disclaimer,
  timestamp,
}: {
  disclaimer?: string;
  timestamp?: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div className="flex-1">
        <span>{disclaimer ?? AI_DISCLAIMER_TEXT}</span>
        {timestamp && (
          <span className="ml-2 text-amber-600 dark:text-amber-400">
            ({new Date(timestamp).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })})
          </span>
        )}
      </div>
    </div>
  );
}
