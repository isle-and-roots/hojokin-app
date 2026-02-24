"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export function OnboardingBanner() {
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get("from") === "onboarding";
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("onboarding-banner-dismissed") === "true") {
      setDismissed(true);
    }
  }, []);

  if (!fromOnboarding || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem("onboarding-banner-dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="mb-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            2
          </span>
          <div>
            <p className="text-sm font-medium">
              Step 2/3: 気になる補助金を選んで詳細を確認しましょう
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              補助金の詳細ページから「この補助金で申請を作成」をクリックすると次のステップへ進めます
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-lg p-1 hover:bg-accent transition-colors"
          aria-label="バナーを閉じる"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
