import type { Metadata } from "next";
import { ShindanTool } from "./shindan-tool";
import { ALL_SUBSIDIES } from "@/lib/data/subsidies";
import { getAllSubsidiesFromDb } from "@/lib/db/subsidies";

export const metadata: Metadata = {
  title: "補助金診断 — あなたに合った補助金を3問で見つける",
  description:
    "業種・目的・規模の3問に答えるだけで、あなたの事業に最適な補助金を無料で診断。小規模事業者持続化補助金・IT導入補助金など15種類以上から厳選してご提案します。",
  keywords: [
    "補助金診断",
    "補助金 おすすめ",
    "補助金 選び方",
    "中小企業 補助金",
    "補助金 無料診断",
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com"}/shindan`,
  },
  openGraph: {
    title: "補助金診断 — 3問で最適な補助金を見つける",
    description:
      "業種・目的・規模を選ぶだけ。あなたの事業に合った補助金を無料で診断します。",
    type: "website",
  },
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "補助金診断ツール",
  description:
    "3問に答えるだけで、あなたの事業に最適な補助金を診断します。",
  url: `${siteUrl}/shindan`,
  provider: {
    "@type": "Organization",
    name: "ISLE & ROOTS Inc.",
    url: siteUrl,
  },
};

export default async function ShindanPage() {
  // DB優先で補助金データ取得（フォールバック: 静的データ）
  let subsidies;
  try {
    const dbSubsidies = await getAllSubsidiesFromDb();
    subsidies = dbSubsidies && dbSubsidies.length > 0 ? dbSubsidies : ALL_SUBSIDIES;
  } catch {
    subsidies = ALL_SUBSIDIES;
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShindanTool subsidies={subsidies} />
    </div>
  );
}
