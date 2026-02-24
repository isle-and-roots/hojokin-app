import Link from "next/link";
import { Building2, Search, Sparkles, Check, ArrowRight } from "lucide-react";

interface OnboardingStepperProps {
  currentStep: 1 | 2 | 3;
  isWelcome?: boolean;
  completedAll?: boolean;
}

const steps = [
  {
    number: 1,
    label: "企業プロフィール登録",
    href: "/profile",
    icon: Building2,
    ctaText: "プロフィールを登録する",
  },
  {
    number: 2,
    label: "おすすめ補助金を確認",
    href: "/subsidies",
    icon: Search,
    ctaText: "補助金を確認する",
  },
  {
    number: 3,
    label: "AI で申請書を作成",
    href: "/applications/new",
    icon: Sparkles,
    ctaText: "申請書を作成する",
  },
] as const;

export function OnboardingStepper({
  currentStep,
  isWelcome = false,
  completedAll = false,
}: OnboardingStepperProps) {
  if (completedAll) {
    return (
      <div className="mb-8 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">
            セットアップ完了！ダッシュボードをご活用ください
          </p>
        </div>
      </div>
    );
  }

  const heading = isWelcome
    ? "補助金サポートへようこそ！"
    : "セットアップを続けましょう";

  const subtext = isWelcome
    ? "3ステップで補助金申請をはじめましょう"
    : null;

  return (
    <div className="mb-8 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{heading}</h2>
        {subtext && (
          <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>
        )}
      </div>

      {/* Progress bar */}
      <div
        aria-label={`オンボーディング進捗: ステップ${currentStep}/3`}
        className="mb-6 flex items-center gap-0"
      >
        {steps.map((step, index) => {
          const isDone = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex items-center">
              {/* Step indicator */}
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isDone
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>

              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div
                  className={[
                    "h-0.5 w-12 sm:w-20 transition-colors",
                    isDone ? "bg-primary" : "bg-muted",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Steps list */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {steps.map((step) => {
          const isDone = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const StepIcon = step.icon;

          return (
            <div
              key={step.number}
              className={[
                "flex flex-1 items-start gap-3 rounded-lg p-3 transition-colors",
                isCurrent
                  ? "bg-background shadow-sm"
                  : isDone
                    ? "opacity-60"
                    : "opacity-40",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-0.5 rounded-full p-1.5",
                  isDone || isCurrent ? "bg-primary/10" : "bg-muted",
                ].join(" ")}
              >
                {isDone ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <StepIcon
                    className={[
                      "h-4 w-4",
                      isCurrent ? "text-primary" : "text-muted-foreground",
                    ].join(" ")}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={[
                    "text-sm font-medium",
                    isDone
                      ? "text-muted-foreground line-through"
                      : "text-foreground",
                  ].join(" ")}
                >
                  {step.label}
                </p>

                {isCurrent && (
                  <Link
                    href={step.href}
                    className="mt-2 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {step.ctaText}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
