import { track } from "@vercel/analytics";

/** Vercel Analytics カスタムイベント送信ヘルパー */

/** AI生成開始イベント */
export function trackAiGeneration(subsidy: string, section: string) {
  track("ai_generation_started", { subsidy, section });
}

/** アップグレードクリックイベント */
export function trackUpgradeClick(source: string, plan: string) {
  track("upgrade_click", { source, plan });
}

/** チェックアウト開始イベント */
export function trackCheckoutStarted(plan: string) {
  track("checkout_started", { plan });
}

/** プロフィール保存完了イベント */
export function trackProfileCompleted() {
  track("profile_completed");
}

/** 申請書保存イベント */
export function trackApplicationSaved(subsidyId: string) {
  track("application_saved", { subsidy_id: subsidyId });
}
