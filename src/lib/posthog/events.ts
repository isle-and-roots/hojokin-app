/** PostHog イベント名定数 — タイポ防止 + 一覧性 */

// ─── LP / マーケティング ───
export const EVENTS = {
  CTA_CLICK: "cta_click",
  LOGIN_STARTED: "login_started",

  // ─── 料金ページ ───
  PRICING_PAGE_VIEWED: "pricing_page_viewed",
  UPGRADE_BUTTON_CLICKED: "upgrade_button_clicked",
  MANAGE_SUBSCRIPTION_CLICKED: "manage_subscription_clicked",

  // ─── AI 生成 ───
  AI_GENERATION_STARTED: "ai_generation_started",
  AI_GENERATION_COMPLETED: "ai_generation_completed",
  AI_GENERATION_FAILED: "ai_generation_failed",

  // ─── AI 生成（サーバーサイド） ───
  AI_GENERATION_SUCCESS: "ai_generation_success",
  QUOTA_EXCEEDED: "quota_exceeded",

  // ─── 申請書 ───
  DOCX_EXPORT_ATTEMPTED: "docx_export_attempted",
  DOCX_EXPORTED: "docx_exported",
  APPLICATION_DELETED: "application_deleted",

  // ─── クォータ / アップセル ───
  QUOTA_WARNING_SHOWN: "quota_warning_shown",
  UPGRADE_MODAL_SHOWN: "upgrade_modal_shown",
  UPGRADE_MODAL_CLICKED: "upgrade_modal_clicked",
  UPGRADE_MODAL_DISMISSED: "upgrade_modal_dismissed",
  PROGRESSIVE_UPSELL_SHOWN: "progressive_upsell_shown",
  EXPORT_PAYWALLED: "export_paywalled",
  EXPORT_PAYWALL_UPGRADE_CLICKED: "export_paywall_upgrade_clicked",

  // ─── コンバージョン ───
  PROFILE_CREATED: "profile_created",
  ONBOARDING_STEP_COMPLETED: "onboarding_step_completed",
  SIGNUP_COMPLETED: "signup_completed",

  // ─── メールキャプチャー ───
  EMAIL_CAPTURE_SHOWN: "email_capture_shown",
  EMAIL_CAPTURE_SUBMITTED: "email_capture_submitted",
  EMAIL_CAPTURE_DISMISSED: "email_capture_dismissed",
  EXIT_INTENT_SHOWN: "exit_intent_shown",

  // ─── ブログ ───
  BLOG_POST_VIEWED: "blog_post_viewed",
  BLOG_CTA_CLICKED: "blog_cta_clicked",

  // ─── 課金（サーバーサイド） ───
  CHECKOUT_INITIATED: "checkout_initiated",
  SUBSCRIPTION_CREATED: "subscription_created",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
} as const;

export type PostHogEventName = (typeof EVENTS)[keyof typeof EVENTS];
