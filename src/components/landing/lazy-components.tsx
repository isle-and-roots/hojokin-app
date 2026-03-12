"use client";

import dynamic from "next/dynamic";

export const LazyAiTypewriterDemo = dynamic(
  () => import("@/components/landing/ai-typewriter-demo").then(m => ({ default: m.AiTypewriterDemo })),
  { ssr: false }
);

export const LazyRoiCalculator = dynamic(
  () => import("@/components/landing/roi-calculator").then(m => ({ default: m.RoiCalculator })),
  { ssr: false }
);

export const LazyExitIntentModal = dynamic(
  () => import("@/components/landing/exit-intent-modal").then(m => ({ default: m.ExitIntentModal })),
  { ssr: false }
);
