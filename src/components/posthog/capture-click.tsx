"use client";

import { cloneElement, useCallback } from "react";
import { posthog } from "@/lib/posthog/client";
import type { PostHogEventName } from "@/lib/posthog/events";

interface CaptureClickProps {
  event: PostHogEventName;
  properties?: Record<string, unknown>;
  children: React.ReactElement<{ onClick?: (...args: unknown[]) => void }>;
}

/** クリック時に PostHog イベントを送信するラッパー */
export function CaptureClick({
  event,
  properties,
  children,
}: CaptureClickProps) {
  const originalOnClick = children.props.onClick;

  const handleClick = useCallback(
    (...args: unknown[]) => {
      posthog.capture(event, properties);
      originalOnClick?.(...args);
    },
    [event, properties, originalOnClick]
  );

  return cloneElement(children, { onClick: handleClick });
}
