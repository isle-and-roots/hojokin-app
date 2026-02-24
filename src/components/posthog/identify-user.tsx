"use client";

import { useEffect } from "react";
import { posthog } from "@/lib/posthog/client";

interface IdentifyUserProps {
  userId: string;
  email?: string;
  plan?: string;
}

/** Supabase Auth ユーザーを PostHog に識別させる Client Component */
export function IdentifyUser({ userId, email, plan }: IdentifyUserProps) {
  useEffect(() => {
    if (!userId) return;

    posthog.identify(userId, {
      email,
      plan: plan || "free",
    });
  }, [userId, email, plan]);

  return null;
}
