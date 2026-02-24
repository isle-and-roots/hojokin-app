import type { Metadata } from "next";
import { PricingPageClient } from "@/components/pricing/pricing-page";

export const metadata: Metadata = {
  title: "料金プラン | 補助金申請サポート",
  description:
    "無料プランからBusinessプランまで4段階の料金体系。AI申請書生成・DOCXエクスポート・高性能AIモデルなど、プランに応じた機能をご利用いただけます。",
  openGraph: {
    title: "料金プラン | 補助金申請サポート",
    description:
      "月額¥0〜¥9,800。AIで補助金申請書類を自動生成。無料プランで今すぐ始められます。",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
