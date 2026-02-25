"use client";

import { useEffect, useRef } from "react";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";

export function SignupTracker({ isWelcome }: { isWelcome: boolean }) {
  const fired = useRef(false);

  useEffect(() => {
    if (isWelcome && !fired.current) {
      fired.current = true;
      posthog.capture(EVENTS.SIGNUP_COMPLETED);
    }
  }, [isWelcome]);

  return null;
}
