"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";
import {
  FEATURE_FLAGS,
  HERO_CTA_VARIANTS,
} from "@/lib/posthog/feature-flags";
import Link from "next/link";

/**
 * Hero CTA ボタン — PostHog Feature Flag で A/B テスト対応。
 *
 * フラグが読み込まれるまではデフォルトテキストを表示。
 * バリアント値に応じてボタンテキストを切り替え、
 * クリック時にバリアント情報付きで cta_click イベントを送信。
 */
export function HeroCtaButton() {
  const [ctaText, setCtaText] = useState<string>(HERO_CTA_VARIANTS.control);
  const [variant, setVariant] = useState("control");

  useEffect(() => {
    // PostHog のフラグが読み込まれたらバリアントを取得
    const checkFlag = () => {
      const flagValue = posthog.getFeatureFlag(FEATURE_FLAGS.HERO_CTA_TEXT);
      if (flagValue === "variant_a") {
        setCtaText(HERO_CTA_VARIANTS.variant_a);
        setVariant("variant_a");
      }
    };

    // 既にフラグが読み込まれている場合
    checkFlag();

    // フラグ読み込み完了を待つ
    posthog.onFeatureFlags(checkFlag);
  }, []);

  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
      onClick={() =>
        posthog.capture(EVENTS.CTA_CLICK, {
          location: "hero",
          href: "/login",
          variant,
          cta_text: ctaText,
        })
      }
    >
      {ctaText}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}
