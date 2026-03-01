"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, Crown, Zap } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "¥980",
    icon: Zap,
    features: ["AI生成 15回/月", "DOCXエクスポート", "申請書 5件"],
    highlighted: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "¥2,980",
    icon: Crown,
    features: ["AI生成 100回/月", "全補助金 AI対応", "申請書 無制限"],
    highlighted: true,
  },
  {
    key: "business",
    name: "Business",
    price: "¥9,800",
    icon: Sparkles,
    features: ["AI生成 500回/月", "高精度AIモデル", "優先サポート"],
    highlighted: false,
  },
] as const;

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  useEffect(() => {
    if (open) {
      posthog.capture(EVENTS.UPGRADE_MODAL_SHOWN);
    }
  }, [open]);

  if (!open) return null;

  const handleUpgradeClick = () => {
    posthog.capture(EVENTS.UPGRADE_MODAL_CLICKED);
  };

  const handleDismiss = () => {
    posthog.capture(EVENTS.UPGRADE_MODAL_DISMISSED);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={handleDismiss}
      />
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-[scale-in_250ms_ease-out]">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent transition-colors z-10"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="p-8 text-center border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold">
            今月の無料生成を使い切りました
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            アップグレードして、より多くの申請書をAIで作成しましょう
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.key}
                className={`rounded-xl border p-4 ${
                  plan.highlighted
                    ? "border-primary shadow-md shadow-primary/10"
                    : "border-border"
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium mb-2">
                    <Crown className="h-3 w-3" />
                    おすすめ
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{plan.name}</span>
                </div>
                <p className="text-lg font-bold">
                  {plan.price}
                  <span className="text-xs font-normal text-muted-foreground">
                    /月
                  </span>
                </p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="text-xs text-muted-foreground flex items-start gap-1.5"
                    >
                      <span className="text-green-600 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="p-6 pt-0 flex flex-col items-center gap-3">
          <Link
            href="/pricing"
            onClick={handleUpgradeClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            プランを選択する
          </Link>
          <button
            onClick={handleDismiss}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            後で検討する
          </button>
        </div>
      </div>
    </div>
  );
}
