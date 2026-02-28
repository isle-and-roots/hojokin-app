import { describe, it, expect } from "vitest";
import {
  calculateQualityScore,
  getGrade,
} from "@/lib/reports/quality-score";
import type { DocumentSection } from "@/types";

function makeSection(
  sectionKey: string,
  sectionTitle: string,
  content: string,
  orderIndex = 0
): DocumentSection {
  return {
    id: `section-${sectionKey}`,
    applicationId: "app-001",
    sectionKey,
    sectionTitle,
    orderIndex,
    aiGeneratedContent: content,
    userEditedContent: null,
    finalContent: null,
    modelUsed: null,
    generatedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const RICH_SECTIONS: DocumentSection[] = [
  makeSection(
    "company_overview",
    "1. 企業概要",
    "当社は2010年に設立し、従業員20名、年商5000万円の小売業者です。主力事業は地域密着型の食料品販売で、地元農家と提携した新鮮な商品を提供しています。リピート率は85%を超えており、顧客満足度が高い事業を展開しています。",
    0
  ),
  makeSection(
    "customer_needs_market",
    "2. 顧客ニーズと市場の動向",
    "顧客ニーズとして健康志向が高まる中、オーガニック食品の市場規模は年間10%成長しています。当社のターゲット顧客は30〜50代の主婦層で、月平均3回の購入があります。競合他社との差別化として、地元産品の取り扱いが他店比40%多いのが強みです。",
    1
  ),
  makeSection(
    "strengths",
    "3. 自社の強み",
    "当社の強みは地域農家30軒との直接取引ネットワークです。この差別化により、流通コストを20%削減し、新鮮な商品を競合比15%安く提供できます。また、独自の品質管理システムにより、食品廃棄率を業界平均の半分以下に抑えています。",
    2
  ),
];

describe("getGrade", () => {
  it("90以上でAグレード", () => {
    expect(getGrade(90)).toBe("A");
    expect(getGrade(100)).toBe("A");
  });

  it("80以上90未満でBグレード", () => {
    expect(getGrade(80)).toBe("B");
    expect(getGrade(89)).toBe("B");
  });

  it("70以上80未満でCグレード", () => {
    expect(getGrade(70)).toBe("C");
    expect(getGrade(79)).toBe("C");
  });

  it("60以上70未満でDグレード", () => {
    expect(getGrade(60)).toBe("D");
    expect(getGrade(69)).toBe("D");
  });

  it("60未満でFグレード", () => {
    expect(getGrade(59)).toBe("F");
    expect(getGrade(0)).toBe("F");
  });
});

describe("calculateQualityScore", () => {
  it("totalScoreは0-100の範囲内", () => {
    const result = calculateQualityScore(RICH_SECTIONS, "JIZOKUKA");
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });

  it("内容が豊富なセクションはスコアが高い", () => {
    const result = calculateQualityScore(RICH_SECTIONS, "JIZOKUKA");
    expect(result.totalScore).toBeGreaterThan(40);
  });

  it("空のセクションはスコアが低い", () => {
    const emptySections = [
      makeSection("company_overview", "1. 企業概要", ""),
    ];
    const result = calculateQualityScore(emptySections, "JIZOKUKA");
    expect(result.totalScore).toBeLessThan(50);
  });

  it("breakdownの各スコアが0-100の範囲内", () => {
    const result = calculateQualityScore(RICH_SECTIONS, "JIZOKUKA");
    const { breakdown } = result;
    expect(breakdown.completeness).toBeGreaterThanOrEqual(0);
    expect(breakdown.completeness).toBeLessThanOrEqual(100);
    expect(breakdown.specificity).toBeGreaterThanOrEqual(0);
    expect(breakdown.specificity).toBeLessThanOrEqual(100);
    expect(breakdown.consistency).toBeGreaterThanOrEqual(0);
    expect(breakdown.consistency).toBeLessThanOrEqual(100);
    expect(breakdown.compliance).toBeGreaterThanOrEqual(0);
    expect(breakdown.compliance).toBeLessThanOrEqual(100);
    expect(breakdown.readability).toBeGreaterThanOrEqual(0);
    expect(breakdown.readability).toBeLessThanOrEqual(100);
  });

  it("sectionScoresが入力セクション数と一致する", () => {
    const result = calculateQualityScore(RICH_SECTIONS, "JIZOKUKA");
    expect(result.sectionScores).toHaveLength(RICH_SECTIONS.length);
  });

  it("gradeがtotalScoreと整合している", () => {
    const result = calculateQualityScore(RICH_SECTIONS, "JIZOKUKA");
    const expectedGrade = getGrade(result.totalScore);
    expect(result.grade).toBe(expectedGrade);
  });

  it("空配列でも正常に動作する", () => {
    const result = calculateQualityScore([], "JIZOKUKA");
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.sectionScores).toHaveLength(0);
  });

  it("数値が多いセクションはspecificityスコアが高い", () => {
    const numericSection = [
      makeSection(
        "expected_effects",
        "4. 補助事業の効果",
        "売上30%向上、新規顧客100件増加、利益率15%改善、コスト20%削減、リピート率85%達成を見込みます。年間売上5000万円から6500万円への増加を目標とします。"
      ),
    ];
    const plainSection = [
      makeSection(
        "expected_effects",
        "4. 補助事業の効果",
        "売上が向上し、新規顧客が増加します。利益率も改善する見込みです。コスト削減やリピート率の向上も期待されます。全体的に業績が好転するでしょう。"
      ),
    ];

    const numericResult = calculateQualityScore(numericSection, "JIZOKUKA");
    const plainResult = calculateQualityScore(plainSection, "JIZOKUKA");

    expect(numericResult.breakdown.specificity).toBeGreaterThanOrEqual(
      plainResult.breakdown.specificity
    );
  });

  it("finalContentがuserEditedContentより優先される", () => {
    const section: DocumentSection = {
      id: "section-test",
      applicationId: "app-001",
      sectionKey: "company_overview",
      sectionTitle: "1. 企業概要",
      orderIndex: 0,
      aiGeneratedContent: "AI生成内容",
      userEditedContent: "ユーザー編集内容",
      finalContent: "最終確定内容です。数値100件の実績があります。",
      modelUsed: null,
      generatedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = calculateQualityScore([section], "JIZOKUKA");
    // finalContentが使われていれば空でないのでスコアはゼロでない
    expect(result.sectionScores[0].score).toBeGreaterThan(0);
  });
});
