"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, X, ArrowRight } from "lucide-react";

interface UnifiedUpgradeBannerProps {
  plan: string;
  quotaRemaining?: number;
  quotaLimit?: number;
  profileCompleteness?: number;
}

export function UnifiedUpgradeBanner({ plan, quotaRemaining, quotaLimit, profileCompleteness }: UnifiedUpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (plan === "pro" || plan === "business") return null;

  // Priority: exhausted > low quota > low profile
  let message: string;
  let href: string;
  let ctaText: string;
  let icon: typeof Sparkles;
  let variant: "red" | "orange" | "blue";

  if (quotaRemaining !== undefined && quotaRemaining === 0) {
    message = "今月の生成回数を使い切りました。Proプランなら月100回まで生成可能です。";
    href = "/pricing";
    ctaText = "Proプランを見る";
    icon = Sparkles;
    variant = "red";
  } else if (quotaRemaining !== undefined && quotaLimit !== undefined && quotaRemaining <= 3) {
    message = `残り${quotaRemaining}回。Proなら月100回まで生成可能です。`;
    href = "/pricing";
    ctaText = "Proプランを見る";
    icon = Sparkles;
    variant = "orange";
  } else if (profileCompleteness !== undefined && profileCompleteness < 50) {
    message = "プロフィールを充実させると、AI生成の精度が向上します。";
    href = "/profile";
    ctaText = "プロフィールを編集";
    icon = TrendingUp;
    variant = "blue";
  } else {
    return null;
  }

  const Icon = icon;
  const colors = {
    red: "border-red-200 bg-red-50/50 text-red-900",
    orange: "border-orange-200 bg-orange-50/50 text-orange-900",
    blue: "border-blue-200 bg-blue-50/50 text-blue-900",
  };
  const btnColors = {
    red: "bg-red-600 hover:bg-red-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    blue: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <div className={`rounded-xl border p-4 mb-6 ${colors[variant]}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          <div className="flex items-center gap-3 mt-3">
            <Link href={href} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors ${btnColors[variant]}`}>
              {ctaText}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="p-1 rounded hover:bg-black/5 transition-colors" aria-label="閉じる">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
