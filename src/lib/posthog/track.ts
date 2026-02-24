import { getPostHogServer } from "./server";
import type { PostHogEventName } from "./events";

/** サーバーサイドでイベントを送信。PostHog 未設定時は no-op。 */
export function trackServerEvent(
  userId: string,
  event: PostHogEventName,
  properties?: Record<string, unknown>
) {
  const ph = getPostHogServer();
  if (!ph) return;

  ph.capture({
    distinctId: userId,
    event,
    properties,
  });
}

/** サーバーサイドでユーザーを identify。plan などのプロパティを PostHog に同期。 */
export function identifyUser(
  userId: string,
  properties: Record<string, unknown>
) {
  const ph = getPostHogServer();
  if (!ph) return;

  ph.identify({
    distinctId: userId,
    properties,
  });
}
