import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY が設定されていません。Vercel の環境変数を確認してください。");
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return _stripe;
}


export interface PlanConfig {
  name: string;
  priceId: string;
  price: number;
  aiLimit: number;
  docxExport: boolean;
  maxApplications: number;
  features: string[];
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    name: "Free",
    priceId: "",
    price: 0,
    aiLimit: 3,
    docxExport: false,
    maxApplications: 1,
    features: [
      "AI申請書生成 3回/月",
      "補助金検索・閲覧",
      "申請書 1件まで",
    ],
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    price: 2980,
    aiLimit: 100,
    docxExport: true,
    maxApplications: -1, // 無制限
    features: [
      "AI申請書生成 100回/月",
      "Word(DOCX)エクスポート",
      "申請書 無制限",
      "全補助金 AI対応",
    ],
  },
  business: {
    name: "Business",
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? "",
    price: 9800,
    aiLimit: 500,
    docxExport: true,
    maxApplications: -1,
    features: [
      "AI申請書生成 500回/月",
      "Word(DOCX)エクスポート",
      "申請書 無制限",
      "高精度AIモデル",
      "複数事業者プロフィール",
      "優先サポート",
    ],
  },
};
