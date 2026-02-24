import type { Metadata } from "next";
import { SubsidySearchPage } from "@/components/subsidies/subsidy-search-page";

export const metadata: Metadata = {
  title: "補助金検索 | 中小企業向け補助金を探す",
  description:
    "持続化補助金・IT導入補助金・ものづくり補助金など、中小企業・小規模事業者が活用できる補助金を検索。カテゴリ・金額・締切で絞り込み可能。AIで申請書類も自動生成。",
  openGraph: {
    title: "補助金検索 | 中小企業向け補助金を探す",
    description:
      "30件以上の補助金から最適な補助金を検索。AIで申請書類を自動生成できます。",
  },
};

export default function SubsidiesPage() {
  return <SubsidySearchPage />;
}
