/**
 * PostHog Feature Flag 定数
 *
 * PostHog ダッシュボードで同名のフラグを作成してください。
 * フラグが未設定の場合、control バリアントがデフォルトで表示されます。
 */
export const FEATURE_FLAGS = {
  /** Hero CTA テキストの A/B テスト */
  HERO_CTA_TEXT: "hero-cta-text",

  /** 料金ページのレイアウト A/B テスト（将来用） */
  PRICING_LAYOUT: "pricing-layout",
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

/**
 * Hero CTA A/B テストのバリアント定義
 *
 * PostHog で multivariate flag として設定:
 * - control: "無料で申請書を作成する"
 * - variant_a: "今すぐ無料で始める"
 */
export const HERO_CTA_VARIANTS = {
  control: "無料で申請書を作成する",
  variant_a: "今すぐ無料で始める",
} as const;
