import type { Metadata } from "next";
import { PricingPageClient } from "@/components/pricing/pricing-page";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

export const metadata: Metadata = {
  title: "料金プラン | 補助金申請サポート",
  description:
    "補助金申請サポートの料金プラン。無料〜月額¥9,800。AI申請書自動生成・DOCXエクスポート・全補助金AI対応など。中小企業・小規模事業者の補助金申請を強力サポート。",
  openGraph: {
    title: "料金プラン | 補助金申請サポート",
    description:
      "月額¥0〜¥9,800。AIで補助金申請書類を自動生成。無料プランで今すぐ始められます。年額プランで最大25%OFF。",
    url: `${siteUrl}/pricing`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/pricing`,
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
  {
    question: "AIが生成する申請書の品質はどの程度ですか？",
    answer:
      "中小企業診断士の知見をベースにしたプロンプトで、審査員に「具体的で実現可能」と評価される品質を目指しています。生成後にお客様自身で内容を確認・修正していただくことを前提としています。",
  },
  {
    question: "コンサルタントに依頼する場合との違いは？",
    answer:
      "コンサルタントへの依頼は一般的に10〜30万円程度かかります。当サービスはAIによる下書き自動生成で、月額¥980〜¥9,800で何度でも利用できます。ただし、最終的な内容確認はお客様ご自身で行っていただく必要があります。",
  },
  {
    question: "返金はできますか？",
    answer:
      "サブスクリプションはいつでもキャンセル可能で、キャンセル後は次回請求日まで引き続きご利用いただけます。日割り返金には対応しておりませんが、1ヶ月単位で気軽にお試しいただけます。",
  },
];

const PLANS_SCHEMA = [
  { name: "Free", price: 0, description: "AI申請書生成 3回/月、補助金検索・閲覧、申請書 1件" },
  { name: "Starter", price: 980, description: "AI申請書生成 15回/月、DOCXエクスポート、申請書 5件" },
  { name: "Pro", price: 2980, description: "AI申請書生成 100回/月、全補助金AI対応、申請書 無制限" },
  { name: "Business", price: 9800, description: "AI申請書生成 500回/月、高精度AIモデル、優先サポート" },
  { name: "Enterprise", price: 29800, description: "AI申請書生成 無制限、専任サポート、カスタムプロンプト、SLA保証" },
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
