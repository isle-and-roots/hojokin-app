import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ui/client-providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DatadogRumInit } from "@/components/datadog/rum-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "補助金申請サポート | ISLE & ROOTS",
    template: "%s | 補助金申請サポート",
  },
  description:
    "小規模事業者持続化補助金・IT導入補助金・ものづくり補助金など100件以上の補助金申請書類をAIで自動生成。中小企業の補助金申請を強力にサポート。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "補助金申請サポート",
    title: "補助金申請サポート | AIで申請書類を自動生成",
    description:
      "持続化補助金・IT導入補助金・ものづくり補助金など、中小企業向け補助金の申請書類をAIが自動生成。採択率アップを目指す経営計画書を3分で作成。",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "補助金申請サポート | AIで申請書類を自動生成",
    description:
      "中小企業向け補助金の申請書類をAIが自動生成。まずは無料でお試しください。",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "ISLE & ROOTS 合同会社",
                url: siteUrl,
                description:
                  "中小企業向け補助金申請書類をAIで自動生成するSaaSサービスを提供。持続化補助金・IT導入補助金・ものづくり補助金など100件以上の補助金に対応。",
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "補助金申請サポート",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url: siteUrl,
                description:
                  "持続化補助金・IT導入補助金・ものづくり補助金など100件以上の補助金申請書をAIが自動生成。中小企業診断士レベルの申請書の下書きを3分で作成。",
                offers: {
                  "@type": "AggregateOffer",
                  lowPrice: "0",
                  highPrice: "9800",
                  priceCurrency: "JPY",
                  offerCount: "4",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "補助金申請サポート",
                url: siteUrl,
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${siteUrl}/subsidies?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
        <Analytics />
        <SpeedInsights />
        <DatadogRumInit />
      </body>
    </html>
  );
}
