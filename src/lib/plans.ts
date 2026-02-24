export type PlanKey = "free" | "starter" | "pro" | "business";

export interface PlanInfo {
  key: PlanKey;
  name: string;
  price: number;
  productId: string;
  aiLimit: number;
  docxExport: boolean;
  maxApplications: number;
  features: string[];
  highlighted: boolean;
}

export const PLAN_LIST: PlanInfo[] = [
  {
    key: "free",
    name: "Free",
    price: 0,
    productId: "",
    aiLimit: 3,
    docxExport: false,
    maxApplications: 1,
    highlighted: false,
    features: [
      "AI申請書生成 3回/月",
      "補助金検索・閲覧",
      "申請書 1件まで",
    ],
  },
  {
    key: "starter",
    name: "Starter",
    price: 980,
    productId: process.env.POLAR_STARTER_PRODUCT_ID ?? "",
    aiLimit: 15,
    docxExport: true,
    maxApplications: 5,
    highlighted: false,
    features: [
      "AI申請書生成 15回/月",
      "Word(DOCX)エクスポート",
      "申請書 5件まで",
      "補助金検索・閲覧",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: 2980,
    productId: process.env.POLAR_PRO_PRODUCT_ID ?? "",
    aiLimit: 100,
    docxExport: true,
    maxApplications: -1,
    highlighted: true,
    features: [
      "AI申請書生成 100回/月",
      "Word(DOCX)エクスポート",
      "申請書 無制限",
      "全補助金 AI対応",
      "メールサポート",
    ],
  },
  {
    key: "business",
    name: "Business",
    price: 9800,
    productId: process.env.POLAR_BUSINESS_PRODUCT_ID ?? "",
    aiLimit: 500,
    docxExport: true,
    maxApplications: -1,
    highlighted: false,
    features: [
      "AI申請書生成 500回/月",
      "Word(DOCX)エクスポート",
      "申請書 無制限",
      "高精度AIモデル",
      "複数事業者プロフィール",
      "優先サポート",
    ],
  },
];

/** Polar Product ID → PlanKey 逆引き（Webhook用） */
export function getPlanKeyByProductId(productId: string): PlanKey | null {
  const plan = PLAN_LIST.find((p) => p.productId && p.productId === productId);
  return plan?.key ?? null;
}

export function canUseFeature(
  plan: PlanKey,
  feature: "docxExport" | "aiGeneration" | "multipleProfiles"
): boolean {
  switch (feature) {
    case "docxExport":
      return plan === "starter" || plan === "pro" || plan === "business";
    case "aiGeneration":
      return true; // すべてのプランで利用可能（回数制限あり）
    case "multipleProfiles":
      return plan === "business";
    default:
      return false;
  }
}

export function getAiLimit(plan: PlanKey): number {
  const limits: Record<PlanKey, number> = { free: 3, starter: 15, pro: 100, business: 500 };
  return limits[plan] ?? 3;
}
