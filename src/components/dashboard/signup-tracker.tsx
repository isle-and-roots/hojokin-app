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
      posthog.capture(EVENTS.FTUE_STEP_REACHED, { step: "signup" });
      try {
        sessionStorage.setItem("ftue_start", Date.now().toString());
      } catch {
        // sessionStorage may be unavailable (private browsing)
      }
    }
  }, [isWelcome]);

  return null;
}
