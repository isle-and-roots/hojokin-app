// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";

interface SectionData {
  sectionKey: string;
  sectionTitle: string;
  group?: string;
  content: string;
}

function makeSections(count: number): SectionData[] {
  return Array.from({ length: count }, (_, i) => ({
    sectionKey: `section_${i}`,
    sectionTitle: `セクション ${i + 1}`,
    group: i < Math.ceil(count / 2) ? "グループA" : "グループB",
    content: [
      `これはセクション ${i + 1} の本文です。`,
      "事業者は積極的に販路を拡大し、新規顧客の獲得を目指します。",
      "デジタルマーケティングを活用し、SNSやウェブ広告を通じた認知度向上を図ります。",
      "地域のニーズを把握し、顧客満足度の向上に努めてまいります。",
      "補助金を活用し、設備投資や人材育成を推進することで生産性向上を実現します。",
    ].join("\n"),
  }));
}

const SUBSIDY_NAME = "小規模事業者持続化補助金";
const COMPANY_INFO = {
  companyName: "株式会社テスト商事",
  representative: "山田 太郎",
  address: "東京都千代田区丸の内1-1-1",
  phone: "03-1234-5678",
  email: "info@test-shoji.co.jp",
};

beforeAll(async () => {
  // Register NotoSansJP pointing to the built-in Helvetica sources so that
  // no network request is made during tests while still satisfying the
  // FontStore lookup for the "NotoSansJP" family.
  const { Font } = await import("@react-pdf/renderer");
  Font.register({
    family: "NotoSansJP",
    fonts: [
      { src: "Helvetica", fontWeight: 400 },
      { src: "Helvetica-Bold", fontWeight: 700 },
    ],
  });
});

describe("PDF generation performance", () => {
  it("8セクションの申請書を3秒以内に生成できる", async () => {
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { registerFonts } = await import("@/lib/pdf/font-config");
    const { ApplicationPdf } = await import("@/lib/pdf/application-pdf");
    const React = await import("react");

    registerFonts();

    const sections = makeSections(8);
    const element = React.createElement(ApplicationPdf, {
      subsidyName: SUBSIDY_NAME,
      sections,
      companyInfo: COMPANY_INFO,
    }) as unknown as React.ReactElement<Record<string, unknown>>;

    const start = Date.now();
    const buffer = await renderToBuffer(
      element as Parameters<typeof renderToBuffer>[0]
    );
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(3000);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  }, 10000);

  it("出力バッファサイズが5MB未満である", async () => {
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { registerFonts } = await import("@/lib/pdf/font-config");
    const { ApplicationPdf } = await import("@/lib/pdf/application-pdf");
    const React = await import("react");

    registerFonts();

    const sections = makeSections(8);
    const element = React.createElement(ApplicationPdf, {
      subsidyName: SUBSIDY_NAME,
      sections,
      companyInfo: COMPANY_INFO,
    }) as unknown as React.ReactElement<Record<string, unknown>>;

    const buffer = await renderToBuffer(
      element as Parameters<typeof renderToBuffer>[0]
    );

    const fiveMB = 5 * 1024 * 1024;
    expect(buffer.length).toBeLessThan(fiveMB);
  }, 10000);

  it("セクション数を変えてもバッファが生成される (1, 4, 12セクション)", async () => {
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { registerFonts } = await import("@/lib/pdf/font-config");
    const { ApplicationPdf } = await import("@/lib/pdf/application-pdf");
    const React = await import("react");

    registerFonts();

    for (const count of [1, 4, 12]) {
      const sections = makeSections(count);
      const element = React.createElement(ApplicationPdf, {
        subsidyName: SUBSIDY_NAME,
        sections,
        companyInfo: COMPANY_INFO,
      }) as unknown as React.ReactElement<Record<string, unknown>>;

      const buffer = await renderToBuffer(
        element as Parameters<typeof renderToBuffer>[0]
      );

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    }
  }, 30000);
});
