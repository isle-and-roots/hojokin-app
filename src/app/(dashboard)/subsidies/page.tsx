import type { Metadata } from "next";
import { SubsidySearchPage } from "@/components/subsidies/subsidy-search-page";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

export const metadata: Metadata = {
  title: "補助金検索 | 中小企業向け補助金を探す",
  description:
    "持続化補助金・IT導入補助金・ものづくり補助金など100件以上の補助金を検索。業種・金額・締切で絞り込み可能。AIで申請書類も自動生成。小規模事業者・中小企業向け。",
  keywords: [
    "補助金 検索",
    "中小企業 補助金一覧",
    "補助金 2026",
    "持続化補助金",
    "IT導入補助金",
    "ものづくり補助金",
    "小規模事業者 補助金",
  ],
  openGraph: {
    title: "補助金検索 | 中小企業向け補助金を探す",
    description:
      "100件以上の補助金から最適な補助金を検索。業種・目的別に絞り込んで、AIで申請書類を自動生成できます。",
    url: `${siteUrl}/subsidies`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/subsidies`,
  },
};

export default function SubsidiesPage() {
  return <SubsidySearchPage />;
}
