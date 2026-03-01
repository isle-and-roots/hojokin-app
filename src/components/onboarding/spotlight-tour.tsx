"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, ChevronLeft } from "lucide-react";
import { posthog } from "@/lib/posthog/client";

const STORAGE_KEY = "hojokin_tour_completed";

type TourStep = {
  /** data-tour 属性のセレクタ値 */
  target: string;
  title: string;
  description: string;
  /** ツールチップの表示位置 */
  placement?: "top" | "bottom" | "left" | "right";
};

const TOUR_STEPS: TourStep[] = [
  {
    target: "profile-card",
    title: "企業プロフィールを登録",
    description:
      "会社名・業種・従業員数の3項目だけでOKです。AIが最適な補助金と申請書を自動で提案します。",
    placement: "bottom",
  },
  {
    target: "subsidy-search-card",
    title: "補助金を検索",
    description:
      "105件以上の補助金から条件に合ったものを検索できます。AIがあなたの事業に最適な補助金を推薦します。",
    placement: "bottom",
  },
  {
    target: "application-card",
    title: "AIが申請書を自動生成",
    description:
      "補助金を選んでボタンを押すだけ。プロの中小企業診断士レベルの申請書が数分で完成します。",
    placement: "top",
  },
];

type TargetRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const PADDING = 8;

function getPlacementStyle(
  rect: TargetRect,
  placement: TourStep["placement"]
): React.CSSProperties {
  const { top, left, width, height } = rect;
  switch (placement) {
    case "top":
      return {
        top: top - PADDING,
        left: left + width / 2,
        transform: "translate(-50%, -100%) translateY(-12px)",
      };
    case "left":
      return {
        top: top + height / 2,
        left: left - PADDING,
        transform: "translate(-100%, -50%) translateX(-12px)",
      };
    case "right":
      return {
        top: top + height / 2,
        left: left + width + PADDING,
        transform: "translateY(-50%) translateX(12px)",
      };
    case "bottom":
    default:
      return {
        top: top + height + PADDING,
        left: left + width / 2,
        transform: "translate(-50%, 12px)",
      };
  }
}


interface SpotlightOverlayProps {
  rect: TargetRect | null;
  children: ReactNode;
}

function SpotlightOverlay({ rect, children }: SpotlightOverlayProps) {
  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* 暗いオーバーレイ: rect部分に穴を開ける */}
      {rect && (
        <div
          className="absolute inset-0 bg-black/50 transition-all duration-300"
          style={{
            clipPath: `polygon(
              0% 0%, 100% 0%, 100% 100%, 0% 100%,
              0% ${rect.top - PADDING}px,
              ${rect.left - PADDING}px ${rect.top - PADDING}px,
              ${rect.left - PADDING}px ${rect.top + rect.height + PADDING}px,
              ${rect.left + rect.width + PADDING}px ${rect.top + rect.height + PADDING}px,
              ${rect.left + rect.width + PADDING}px ${rect.top - PADDING}px,
              0% ${rect.top - PADDING}px
            )`,
          }}
        />
      )}
      {/* ターゲット周辺のリングハイライト */}
      {rect && (
        <div
          className="absolute rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-transparent transition-all duration-300"
          style={{
            top: rect.top - PADDING,
            left: rect.left - PADDING,
            width: rect.width + PADDING * 2,
            height: rect.height + PADDING * 2,
          }}
        />
      )}
      {/* ツールチップ */}
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}

export function SpotlightTour() {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [neverShow, setNeverShow] = useState(false);
  const startedRef = useRef(false);

  // localStorage チェック → 未完了なら遅延起動
  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (completed) return;
    // ページ描画後に起動（WelcomeModal との干渉回避で少し遅延）
    const timer = setTimeout(() => {
      setActive(true);
      if (!startedRef.current) {
        startedRef.current = true;
        posthog.capture("tour_started", { step_count: TOUR_STEPS.length });
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // ステップ変化時にターゲット要素の位置を取得
  useEffect(() => {
    if (!active) return;
    const step = TOUR_STEPS[stepIndex];
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      const t = setTimeout(() => setTargetRect(null), 0);
      return () => clearTimeout(t);
    }
    const update = () => {
      const r = el.getBoundingClientRect();
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    const t = setTimeout(update, 0);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, stepIndex]);

  const complete = useCallback((skipped: boolean) => {
    localStorage.setItem(STORAGE_KEY, "1");
    setActive(false);
    if (skipped) {
      posthog.capture("tour_skipped", { at_step: stepIndex });
    } else {
      posthog.capture("tour_completed", { step_count: TOUR_STEPS.length });
    }
    if (neverShow) {
      localStorage.setItem(STORAGE_KEY, "never");
    }
  }, [stepIndex, neverShow]);

  const goNext = useCallback(() => {
    posthog.capture(`tour_step_${stepIndex + 1}`, {
      target: TOUR_STEPS[stepIndex].target,
    });
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      complete(false);
    }
  }, [stepIndex, complete]);

  const goPrev = useCallback(() => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const skip = useCallback(() => complete(true), [complete]);

  if (!active) return null;

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const tooltipStyle = targetRect
    ? getPlacementStyle(targetRect, step.placement)
    : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  return (
    <SpotlightOverlay rect={targetRect}>
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-[61] w-80 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
          style={tooltipStyle}
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {stepIndex + 1} / {TOUR_STEPS.length}
            </span>
            <button
              onClick={skip}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              aria-label="ツアーをスキップ"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* ステップインジケーター */}
          <div className="flex gap-1.5 px-5 pb-3">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                  i <= stepIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* コンテンツ */}
          <div className="px-5 pb-4">
            <h3 className="font-semibold text-base mb-1.5">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* フッター */}
          <div className="flex items-center justify-between px-5 pb-5">
            <button
              onClick={goPrev}
              disabled={stepIndex === 0}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              戻る
            </button>

            <button
              onClick={goNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {isLast ? "完了" : "次へ"}
              {!isLast && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* もう表示しない */}
          <div className="border-t border-border px-5 py-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={neverShow}
                onChange={(e) => setNeverShow(e.target.checked)}
                className="rounded"
              />
              もう表示しない
            </label>
          </div>
        </motion.div>
      </AnimatePresence>
    </SpotlightOverlay>
  );
}
