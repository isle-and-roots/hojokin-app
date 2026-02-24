"use client";

import Link from "next/link";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

interface CtaLinkProps {
  href: string;
  location: string;
  className?: string;
  children: React.ReactNode;
}

/** LP 上の CTA リンク。クリック時に cta_click イベントを送信。 */
export function CtaLink({ href, location, className, children }: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        posthog.capture(EVENTS.CTA_CLICK, { location, href })
      }
    >
      {children}
    </Link>
  );
}
