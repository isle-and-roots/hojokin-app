"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Building2, Search, Sparkles, ArrowRight } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

const STEPS = [
  {
    icon: Building2,
    title: "企業プロフィール登録",
    description: "会社名・業種・従業員数の3項目だけでOK",
    time: "1分",
  },
  {
    icon: Search,
    title: "おすすめ補助金を確認",
    description: "AIがあなたに最適な補助金を自動で提案",
    time: "30秒",
  },
  {
    icon: Sparkles,
    title: "AI で申請書を自動生成",
    description: "プロの中小企業診断士レベルの申請書が完成",
    time: "1分",
  },
];

export function WelcomeModal({ show }: { show: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();
  const tracked = useRef(false);

  useEffect(() => {
    if (show && !tracked.current) {
      tracked.current = true;
      posthog.capture(EVENTS.WELCOME_MODAL_SHOWN);
    }
  }, [show]);

  const open = show && !dismissed;

  const handleStart = () => {
    posthog.capture(EVENTS.WELCOME_MODAL_CTA_CLICKED);
    setDismissed(true);
    router.push("/profile?quick=true");
  };

  const handleClose = () => {
    setDismissed(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-[scale-in_250ms_ease-out]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent transition-colors z-10"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="p-8 pb-4 text-center bg-gradient-to-b from-primary/5 to-transparent">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">
            補助金サポートへようこそ！
          </h2>
          <p className="text-muted-foreground mt-2">
            <span className="font-semibold text-primary">たった3分</span>でAI申請書を体験できます
          </p>
        </div>

        <div className="px-8 py-6">
          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px h-6 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{step.title}</h3>
                      <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-8 pb-8">
          <button
            onClick={handleStart}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            プロフィール登録を始める
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-3"
          >
            あとで設定する
          </button>
        </div>
      </div>
    </div>
  );
}
