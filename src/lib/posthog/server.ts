import { PostHog } from "posthog-node";

let _posthog: PostHog | null = null;

/** サーバーサイド PostHog シングルトン（getPolar() パターン準拠） */
export function getPostHogServer(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key) return null;

  if (!_posthog) {
    _posthog = new PostHog(key, {
      host: host || "https://us.i.posthog.com",
      flushAt: 1, // サーバーレス対応 — 1イベントごとに即送信
      flushInterval: 0,
    });
  }

  return _posthog;
}
