import posthog from "posthog-js";

/** PostHog ブラウザ SDK を初期化（1回だけ）。キーが未設定なら何もしない。 */
export function initPostHog() {
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key) return;

  posthog.init(key, {
    api_host: host || "https://us.i.posthog.com",
    autocapture: false,
    capture_pageview: false,
    persistence: "localStorage+cookie",
    loaded: (ph) => {
      // 開発環境ではデバッグモード有効
      if (process.env.NODE_ENV === "development") {
        ph.debug();
      }
    },
  });
}

export { posthog };
