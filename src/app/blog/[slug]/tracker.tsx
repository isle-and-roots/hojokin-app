"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
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

export function BlogCtaLink({ slug }: { slug: string }) {
  return (
    <Link
      href="/login"
      onClick={() =>
        posthog.capture(EVENTS.BLOG_CTA_CLICKED, { slug })
      }
      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
    >
      <Sparkles className="h-4 w-4" />
      無料で始める
    </Link>
  );
}
