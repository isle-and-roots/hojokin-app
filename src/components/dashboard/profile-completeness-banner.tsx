"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCompletenessBannerProps {
  completeness: number;
  plan: string;
}

interface Tier {
  label: string;
  hint: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  subTextColor: string;
  barColor: string;
  iconColor: string;
  iconBg: string;
}

function getTier(completeness: number): Tier {
  if (completeness <= 30) {
    return {
      label: "一般的な申請書",
      hint: "業種情報を追加しましょう",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50/50",
      textColor: "text-orange-900",
      subTextColor: "text-orange-700",
      barColor: "bg-orange-400",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    };
  }
  if (completeness <= 70) {
    return {
      label: "業種最適化",
      hint: "事業内容を追加しましょう",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50/50",
      textColor: "text-blue-900",
      subTextColor: "text-blue-700",
      barColor: "bg-blue-500",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    };
  }
  return {
    label: "完全最適化",
    hint: "すべての情報が活用されています",
    borderColor: "border-green-200",
    bgColor: "bg-green-50/50",
    textColor: "text-green-900",
    subTextColor: "text-green-700",
    barColor: "bg-green-500",
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  };
}

export function ProfileCompletenessBanner({
  completeness,
}: ProfileCompletenessBannerProps) {
  const tier = getTier(completeness);

  return (
    <div className={cn("rounded-xl border p-4 mb-6", tier.borderColor, tier.bgColor)}>
      <div className="flex items-start gap-3">
        <div className={cn("rounded-full p-1.5 shrink-0 mt-0.5", tier.iconBg)}>
          <TrendingUp className={cn("h-4 w-4", tier.iconColor)} />
        </div>
        <div className="flex-1">
          <p className={cn("text-sm font-medium", tier.textColor)}>
            プロフィール充実度 {completeness}% — AI精度レベル: {tier.label}
          </p>
          <p className={cn("text-xs mt-1", tier.subTextColor)}>{tier.hint}</p>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", tier.barColor)}
              style={{ width: `${completeness}%` }}
            />
          </div>

          <div className="mt-2">
            <Link
              href="/profile"
              className={cn("text-xs hover:underline font-medium", tier.subTextColor)}
            >
              プロフィールを編集する →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
