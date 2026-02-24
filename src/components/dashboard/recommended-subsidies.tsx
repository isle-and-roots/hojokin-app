import Link from "next/link";
import { Sparkles, ArrowRight, Clock, Target } from "lucide-react";
import type { ScoredSubsidy } from "@/types";
import {
  PROMPT_SUPPORT_CONFIG,
  DIFFICULTY_CONFIG,
} from "@/lib/data/subsidy-categories";

const REASON_COLORS: Record<string, string> = {
  industry: "bg-blue-50 text-blue-700 border-blue-200",
  scale: "bg-green-50 text-green-700 border-green-200",
  challenge: "bg-purple-50 text-purple-700 border-purple-200",
  business: "bg-orange-50 text-orange-700 border-orange-200",
  channel: "bg-teal-50 text-teal-700 border-teal-200",
  amount: "bg-amber-50 text-amber-700 border-amber-200",
  age: "bg-pink-50 text-pink-700 border-pink-200",
  deadline: "bg-red-50 text-red-700 border-red-200",
  ai: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

function ProfileCompletenessBar({ completeness }: { completeness: number }) {
  if (completeness >= 100) return null;

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-amber-800">
          プロフィール充実度: {completeness}%
        </span>
        <Link
          href="/profile"
          className="text-xs text-amber-700 hover:text-amber-900 underline"
        >
          プロフィールを充実させる
        </Link>
      </div>
      <div className="h-2 w-full rounded-full bg-amber-200">
        <div
          className="h-2 rounded-full bg-amber-500 transition-all"
          style={{ width: `${completeness}%` }}
        />
      </div>
      <p className="text-xs text-amber-600 mt-1">
        情報を追加するとより精度の高いおすすめが表示されます
      </p>
    </div>
  );
}

export function RecommendedSubsidies({
  companyName,
  items,
  profileCompleteness,
}: {
  companyName: string;
  items: ScoredSubsidy[];
  profileCompleteness: number;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            {companyName}様へのおすすめ補助金
          </h2>
        </div>
        <Link
          href="/subsidies"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          すべて見る
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ProfileCompletenessBar completeness={profileCompleteness} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(({ subsidy: s, totalScore, reasons }) => {
          const promptConf = PROMPT_SUPPORT_CONFIG[s.promptSupport];
          const diffConf = DIFFICULTY_CONFIG[s.difficulty];
          const topReasons = reasons.filter((r) => r.score > 0).slice(0, 3);

          return (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              {/* ヘッダー: AI対応 + 難易度 + スコア */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${promptConf.color}`}
                  >
                    <Sparkles className="h-3 w-3" />
                    {promptConf.label}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${diffConf.color}`}
                  >
                    {diffConf.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  適合度 {totalScore}pt
                </span>
              </div>

              {/* 補助金名 */}
              <h3 className="font-semibold">{s.nameShort}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {s.summary}
              </p>

              {/* 金額・補助率・締切 */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <span>
                  上限{" "}
                  {s.maxAmount
                    ? `${s.maxAmount.toLocaleString()}万円`
                    : "—"}
                </span>
                <span>|</span>
                <span>補助率 {s.subsidyRate}</span>
                {s.deadline && (
                  <>
                    <span>|</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-3 w-3" />
                      {s.deadline}
                    </span>
                  </>
                )}
              </div>

              {/* マッチ理由バッジ */}
              {topReasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {topReasons.map((reason) => (
                    <span
                      key={reason.key}
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${
                        REASON_COLORS[reason.key] ?? "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {reason.label}
                      {reason.detail ? `: ${reason.detail}` : ""}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Link
                href={`/subsidies/${s.id}`}
                className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                この補助金で申請
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
