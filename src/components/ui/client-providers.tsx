"use client";

import { Suspense, type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmProvider } from "@/components/ui/confirm-dialog";
import { PostHogProvider } from "@/components/posthog/posthog-provider";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PostHogProvider>
        <ToastProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </ToastProvider>
      </PostHogProvider>
    </Suspense>
  );
}
