"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Building2, Search, Sparkles, Check, ArrowRight, UserCheck } from "lucide-react";
import { Confetti } from "@/components/ui/confetti";

const LOGIN_COUNT_KEY = "hojokin_login_count";
const SHINDAN_VISITED_KEY = "hojokin_shindan_visited";
const CONFETTI_SHOWN_KEY = "hojokin_onboarding_confetti_shown";

interface OnboardingStepperProps {
  /** 後方互換: step番号を渡す旧スタイル (1=プロフィール未作成, 3=申請未作成) */
  currentStep?: 1 | 2 | 3;
  isWelcome?: boolean;
  /** 新スタイル: サーバーから取得した完了状態 */
  hasProfile?: boolean;
  hasApplication?: boolean;
}

interface StepConfig {
  id: string;
  label: string;
  description: string;
  icon: typeof UserCheck;
  href: string;
  ctaText: string;
}

const STEP_CONFIGS: StepConfig[] = [
  {
    id: "account",
    label: "アカウント作成",
    description: "補助金サポートへようこそ",
    icon: UserCheck,
    href: "/",
    ctaText: "完了",
  },
  {
    id: "profile",
    label: "企業プロフィール登録",
    description: "事業者情報を入力してAI生成精度を上げましょう",
    icon: Building2,
    href: "/profile",
    ctaText: "プロフィールを登録する",
  },
  {
    id: "shindan",
    label: "補助金診断を受ける",
    description: "自社にぴったりの補助金を診断しましょう",
    icon: Search,
    href: "/shindan",
    ctaText: "診断をはじめる",
  },
  {
    id: "application",
    label: "AI で申請書を作成",
    description: "AIが申請書類の下書きを自動生成します",
    icon: Sparkles,
    href: "/applications/new",
    ctaText: "申請書を作成する",
  },
];

function readLocalStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/**
 * Inner component — only mounts client-side, so localStorage access is safe.
 * Splitting avoids hydration mismatch without needing a mounted state guard.
 */
function StepperInner({
  hasProfile,
  hasApplication,
  isWelcome,
}: {
  hasProfile: boolean;
  hasApplication: boolean;
  isWelcome: boolean;
}) {
  // Lazy-initialize from localStorage (runs only on client, once)
  const [shindanVisited] = useState<boolean>(() => {
    return readLocalStorage(SHINDAN_VISITED_KEY) === "true";
  });

  const [loginCount] = useState<number>(() => {
    const current = parseInt(readLocalStorage(LOGIN_COUNT_KEY) ?? "0", 10);
    const next = current + 1;
    writeLocalStorage(LOGIN_COUNT_KEY, String(next));
    return next;
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const confettiTriggeredRef = useRef(false);

  const stepDone: Record<string, boolean> = {
    account: true,
    profile: hasProfile,
    shindan: shindanVisited,
    application: hasApplication,
  };

  const doneCount = STEP_CONFIGS.filter((s) => stepDone[s.id]).length;
  const allDone = doneCount === STEP_CONFIGS.length;
  const progressPercent = Math.round((doneCount / STEP_CONFIGS.length) * 100);

  const handleConfettiDone = useCallback(() => {
    setShowConfetti(false);
    writeLocalStorage(CONFETTI_SHOWN_KEY, "true");
  }, []);

  // Trigger confetti once when all steps complete
  useEffect(() => {
    if (
      allDone &&
      !confettiTriggeredRef.current &&
      readLocalStorage(CONFETTI_SHOWN_KEY) !== "true"
    ) {
      confettiTriggeredRef.current = true;
      // Use setTimeout(0) to defer setState out of synchronous effect execution
      const timer = setTimeout(() => setShowConfetti(true), 0);
      return () => clearTimeout(timer);
    }
  }, [allDone]);

  // Hide conditions
  if (dismissed) return null;
  if (loginCount >= 3 && !allDone) return null;

  const nextStep = STEP_CONFIGS.find((s) => !stepDone[s.id]);
  const heading = isWelcome ? "補助金サポートへようこそ！" : "セットアップを続けましょう";

  return (
    <>
      <Confetti show={showConfetti} onDone={handleConfettiDone} />

      <div className="mb-8 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{heading}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {allDone
                ? "すべてのステップが完了しました！"
                : `${doneCount} / ${STEP_CONFIGS.length} 完了`}
            </p>
          </div>
          {!allDone && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="チェックリストを閉じる"
            >
              閉じる
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div
          className="mb-5 h-2 w-full rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-label={`オンボーディング進捗: ${doneCount}/${STEP_CONFIGS.length}完了`}
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={STEP_CONFIGS.length}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps checklist */}
        <div className="flex flex-col gap-2">
          {STEP_CONFIGS.map((step) => {
            const StepIcon = step.icon;
            const done = stepDone[step.id];
            const isCurrent = !done && step.id === nextStep?.id;

            return (
              <div
                key={step.id}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  isCurrent ? "bg-background shadow-sm" : "",
                  done ? "opacity-60" : "",
                ].join(" ")}
              >
                {/* Completion indicator */}
                <div
                  className={[
                    "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary bg-background"
                        : "border-muted bg-muted",
                  ].join(" ")}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <StepIcon
                      className={[
                        "h-3 w-3",
                        isCurrent ? "text-primary" : "text-muted-foreground",
                      ].join(" ")}
                    />
                  )}
                </div>

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <p
                    className={[
                      "text-sm font-medium",
                      done ? "text-muted-foreground line-through" : "text-foreground",
                    ].join(" ")}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* CTA for current step */}
                {isCurrent && (
                  <Link
                    href={step.href}
                    className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {step.ctaText}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* All done message */}
        {allDone && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm font-medium text-primary">
              セットアップ完了！補助金申請をどんどん活用しましょう
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * OnboardingStepper — renders nothing on server, mounts StepperInner client-side.
 * This prevents hydration mismatch from localStorage-derived state.
 */
export function OnboardingStepper({
  currentStep,
  isWelcome = false,
  hasProfile: hasProfileProp,
  hasApplication: hasApplicationProp,
}: OnboardingStepperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Derive hasProfile/hasApplication from legacy currentStep if new props not provided
  const hasProfile = hasProfileProp ?? (currentStep !== undefined ? currentStep > 1 : false);
  const hasApplication = hasApplicationProp ?? false;

  return (
    <StepperInner
      hasProfile={hasProfile}
      hasApplication={hasApplication}
      isWelcome={isWelcome}
    />
  );
}
