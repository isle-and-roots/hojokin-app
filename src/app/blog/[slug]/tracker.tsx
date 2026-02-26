"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle } from "lucide-react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

export function BlogPostTracker({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  useEffect(() => {
    posthog.capture(EVENTS.BLOG_POST_VIEWED, { slug, title });
  }, [slug, title]);

  return null;
}

export function BlogCtaLink({
  slug,
  variant = "bottom",
}: {
  slug: string;
  variant?: "bottom" | "inline";
}) {
  return (
    <Link
      href="/login"
      onClick={() =>
        posthog.capture(EVENTS.BLOG_CTA_CLICKED, { slug, variant })
      }
      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
    >
      <Sparkles className="h-4 w-4" />
      無料で始める
    </Link>
  );
}

export function InlineBlogCta({ slug }: { slug: string }) {
  return (
    <div className="my-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-semibold text-sm text-foreground mb-1">
            AIで申請書の下書きを自動作成
          </p>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 text-primary shrink-0" />
              無料プランで月3セクションまで生成
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 text-primary shrink-0" />
              3分で申請書の骨格が完成
            </li>
          </ul>
        </div>
        <Link
          href="/login"
          onClick={() =>
            posthog.capture(EVENTS.BLOG_CTA_CLICKED, {
              slug,
              variant: "inline",
            })
          }
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Sparkles className="h-4 w-4" />
          無料で試す
        </Link>
      </div>
    </div>
  );
}
