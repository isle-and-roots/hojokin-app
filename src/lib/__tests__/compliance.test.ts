import { describe, it, expect } from "vitest";
import { checkCompliance } from "@/lib/reports/compliance";
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

const VALID_JIZOKUKA_SECTIONS: DocumentSection[] = [
  makeSection(
    "company_overview",
    "1. 企業概要",
    "当社は2010年に設立した小売業者です。従業員数10名、年商3000万円の規模で、地域の顧客に商品やサービスを提供しています。主力事業は生活雑貨の販売で、差別化された独自商品を取り扱い、リピート率80%以上を維持しています。創業以来15年間、地域密着型の経営スタイルを貫き、顧客満足度の向上に努めてきました。",
    0
  ),
  makeSection(
    "customer_needs_market",
    "2. 顧客ニーズと市場の動向",
    "顧客のニーズとして健康志向と利便性重視が高まっており、EC市場が年間10%拡大しています。市場調査では30〜50代の主婦層を中心に、オンラインでの購買行動が増加しています。競合他社との差別化として、地元産品を40%以上取り扱い、鮮度と品質で優位性を確立しています。",
    1
  ),
  makeSection(
    "strengths",
    "3. 自社の強み",
    "当社の強みは地元農家30軒との直接取引ネットワークです。この差別化により、流通コストを15%削減し、競合他社より10%安く新鮮な商品を提供できています。独自の品質管理体制により顧客満足度は98%を維持し、リピート購入率は業界平均の2倍以上です。また、地域コミュニティとの強い結びつきが新規顧客獲得にも貢献しています。",
    2
  ),
  makeSection(
    "management_plan",
    "4. 経営方針・目標",
    "経営方針として3年間で売上10%向上を目標とし、段階的な施策を実施します。第1年目はECサイト構築と新規顧客100名獲得、第2年目はリピート率85%達成、第3年目は年商5000万円突破を計画しています。具体的な施策として、SNS活用と地域イベント参加による認知度向上に注力します。",
    3
  ),
  makeSection("project_name", "1. 補助事業で行う事業名", "EC販路拡大プロジェクト", 4),
  makeSection(
    "sales_expansion_plan",
    "2. 販路開拓の取組内容",
    "販路拡大のため、ECサイトを新規構築し、月間30件の新規注文増加を目指します。SNSマーケティングでフォロワー1000名を獲得し、リターゲティング広告で転換率3%を達成する取り組みを行います。また、他社との差別化として、地元産品の定期購入サービスを開始し、安定収益の確保を図ります。",
    5
  ),
  makeSection(
    "efficiency_plan",
    "3. 業務効率化の取組内容",
    "業務効率化として在庫管理システムを導入し、生産性向上と改善を図ります。現状の手作業による在庫確認を自動化することで、作業時間を20%削減する計画です。また、受発注システムとの連携により、発注ミスをゼロにします。",
    6
  ),
  makeSection(
    "expected_effects",
    "4. 補助事業の効果",
    "補助事業による効果として、売上30%向上（3000万円→3900万円）を見込みます。新規顧客100件増加、リピート率20%向上という数値目標を設定しています。また、業務効率化により人件費を年間50万円削減できる見込みです。",
    7
  ),
];

describe("checkCompliance - JIZOKUKA", () => {
  it("全セクションが揃っていて内容が充実していればpassedになる", () => {
    const report = checkCompliance(VALID_JIZOKUKA_SECTIONS, "JIZOKUKA");
    expect(report.overallPassed).toBe(true);
    expect(report.score).toBeGreaterThan(70);
  });

  it("空のセクションはエラーになる", () => {
    const sections = [
      makeSection("company_overview", "1. 企業概要", ""),
    ];
    const report = checkCompliance(sections, "JIZOKUKA");
    const companyResult = report.sectionResults.find(
      (r) => r.sectionKey === "company_overview"
    );
    expect(companyResult?.passed).toBe(false);
    const errors = companyResult?.issues.filter((i) => i.severity === "error");
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors?.[0].rule).toBe("content_required");
  });

  it("文字数不足はエラーになる", () => {
    const sections = [
      makeSection("company_overview", "1. 企業概要", "短い内容です。数値あり: 100件。強みがあります。事業の特徴です。"),
    ];
    const report = checkCompliance(sections, "JIZOKUKA");
    const result = report.sectionResults[0];
    const charIssue = result.issues.find((i) => i.rule === "char_count");
    expect(charIssue).toBeDefined();
    expect(charIssue?.severity).toBe("error");
  });

  it("プレースホルダーが残っているとエラーになる", () => {
    const content =
      "当社は[要入力: 設立年]に設立した企業です。従業員数は[要入力: 人数]名で、年商3000万円を超えています。主力事業は商品販売で、市場において強みと差別化を持っています。";
    const sections = [makeSection("company_overview", "1. 企業概要", content)];
    const report = checkCompliance(sections, "JIZOKUKA");
    const result = report.sectionResults[0];
    const placeholderIssue = result.issues.find(
      (i) => i.rule === "placeholder_detection"
    );
    expect(placeholderIssue).toBeDefined();
    expect(placeholderIssue?.severity).toBe("error");
  });

  it("数値がないとwarningになる", () => {
    const content =
      "当社は長年にわたり地域に根ざした事業を展開しています。商品ラインアップは豊富で、顧客の課題解決に貢献しています。サービスの品質向上に努め、市場での競争優位性を確立しています。";
    const sections = [makeSection("company_overview", "1. 企業概要", content)];
    const report = checkCompliance(sections, "JIZOKUKA");
    const result = report.sectionResults[0];
    const numericIssue = result.issues.find((i) => i.rule === "numeric_presence");
    expect(numericIssue).toBeDefined();
    expect(numericIssue?.severity).toBe("warning");
  });

  it("必須セクションが欠けているとエラーになる", () => {
    const report = checkCompliance([], "JIZOKUKA");
    const completenessErrors = report.allIssues.filter(
      (i) => i.rule === "section_completeness"
    );
    expect(completenessErrors.length).toBe(8); // JIZOKUKA_SECTIONS.length
    expect(report.overallPassed).toBe(false);
  });

  it("scoreは0-100の範囲内", () => {
    const report = checkCompliance([], "JIZOKUKA");
    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(report.score).toBeLessThanOrEqual(100);
  });

  it("JIZOKUKAでないsubsidyTypeはセクション完全性チェックをスキップ", () => {
    const report = checkCompliance([], "IT_DONYU");
    const completenessErrors = report.allIssues.filter(
      (i) => i.rule === "section_completeness"
    );
    expect(completenessErrors.length).toBe(0);
  });

  it("finalContentが優先して使用される", () => {
    const section: DocumentSection = {
      id: "section-test",
      applicationId: "app-001",
      sectionKey: "company_overview",
      sectionTitle: "1. 企業概要",
      orderIndex: 0,
      aiGeneratedContent: "",
      userEditedContent: null,
      finalContent: "最終コンテンツです。数値100件。当社の事業と商品とサービスの強みがあり市場での差別化を実現しています。顧客に向けた高品質なサービス提供を行っています。",
      modelUsed: null,
      generatedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const report = checkCompliance([section], "JIZOKUKA");
    const result = report.sectionResults[0];
    // finalContentは短いがcontent_required エラーはない
    const contentError = result.issues.find((i) => i.rule === "content_required");
    expect(contentError).toBeUndefined();
  });
});
