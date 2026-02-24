import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ui/client-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
