import type { Metadata } from "next";
import { PricingPageClient } from "@/components/pricing/pricing-page";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

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

const FAQ_ITEMS = [
  {
    question: "無料プランでどこまで使えますか？",
    answer:
      "補助金の検索・閲覧は無制限です。AI申請書生成は月3回まで、申請書の保存は1件までご利用いただけます。まずは無料でお試しください。",
  },
  {
    question: "プランの変更やキャンセルはいつでもできますか？",
    answer:
      "はい、いつでも変更・キャンセルが可能です。アップグレードは即時反映、ダウングレードは次回請求日から適用されます。",
  },
  {
    question: "AI生成の回数は翌月に繰り越せますか？",
    answer:
      "未使用の生成回数は翌月に繰り越されません。毎月1日にリセットされます。",
  },
  {
    question: 'Businessプランの「高精度AIモデル」とは何ですか？',
    answer:
      "最新の Claude Opus モデルを使用し、より高品質な申請書を生成します。他のプランでは Claude Sonnet を使用しています。",
  },
  {
    question: "請求書や領収書は発行できますか？",
    answer:
      "顧客ポータルから請求書・領収書をダウンロードできます。アカウント設定ページの「サブスクリプション管理」ボタン、または「請求書・領収書」カードからアクセスしてください。",
  },
];

const PLANS_SCHEMA = [
  { name: "Free", price: 0, description: "AI申請書生成 3回/月、補助金検索・閲覧、申請書 1件" },
  { name: "Starter", price: 980, description: "AI申請書生成 15回/月、DOCXエクスポート、申請書 5件" },
  { name: "Pro", price: 2980, description: "AI申請書生成 100回/月、全補助金AI対応、申請書 無制限" },
  { name: "Business", price: 9800, description: "AI申請書生成 500回/月、高精度AIモデル、優先サポート" },
];

export default function PricingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const productJsonLd = PLANS_SCHEMA.map((plan) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `補助金申請サポート ${plan.name}プラン`,
    description: plan.description,
    brand: { "@type": "Organization", name: "ISLE & ROOTS Inc." },
    offers: {
      "@type": "Offer",
      price: plan.price,
      priceCurrency: "JPY",
      priceValidUntil: new Date(
        new Date().getFullYear() + 1,
        11,
        31
      ).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/pricing`,
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <PricingPageClient />
    </>
  );
}
