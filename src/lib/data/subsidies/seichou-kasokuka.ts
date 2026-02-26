import type { SubsidyInfo } from "@/types";

/**
 * 中小企業成長加速化補助金データ
 * SEICHOU_KASOKUKA - 成長加速化のための大規模投資を支援
 */
export const seichouKasokukaSubsidies: SubsidyInfo[] = [
  // ============================================================
  // 中小企業成長加速化補助金
  // ============================================================
  {
    id: "seichou-kasokuka-001",
    name: "中小企業成長加速化補助金",
    nameShort: "成長加速化補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "成長意欲の高い中小企業が行う大規模な設備投資・システム開発・人材育成を一括支援します。締切: 2026年3月26日。",
    description:
      "中小企業成長加速化補助金は、成長意欲の高い中小企業・小規模事業者が、事業の飛躍的な成長を実現するために行う大規模な投資（設備投資・システム開発・人材育成・販路開拓等）を一括して支援する制度です。従来の補助金では対応しきれなかった複合的な成長投資を、補助上限2,500〜5,000万円という大規模な枠組みで後押しします。明確な成長戦略と数値目標が求められます。",
    maxAmount: 5000,
    minAmount: 500,
    subsidyRate: "1/2〜2/3",
    deadline: "2026-03-26",
    applicationPeriod: { start: "2026-01-15", end: "2026-03-26" },
    url: "https://seichou-kasokuka.go.jp/",
    categories: ["SETSUBI_TOUSHI", "KENKYUU_KAIHATSU", "JINZAI_IKUSEI"],
    targetScale: ["CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "成長加速化",
      "大規模投資",
      "設備投資",
      "DX",
      "人材育成",
      "スケールアップ",
      "成長戦略",
      "KPI",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること（小規模事業者も含む場合あり）",
      "直近3年以上の業歴があること",
      "直近期の売上高が一定基準以上であること（詳細は公募要領参照）",
      "明確な成長戦略と数値目標（売上高・付加価値額・従業員数等）を有すること",
      "認定経営革新等支援機関の確認を受けた事業計画を策定していること",
      "補助事業終了後5年間で目標KPIを達成する見込みがあること",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "業歴3年未満の事業者",
      "過去5年以内に本補助金または類似補助金で不正受給を行った者",
      "事業計画の実現可能性が著しく低いと判断される者",
      "暴力団関係者または反社会的勢力",
    ],
    requiredDocuments: [
      "事業計画書（成長戦略・KPI・投資計画を含む）",
      "認定経営革新等支援機関による確認書",
      "決算書（直近3期分）",
      "従業員数・賃金状況に関する資料",
      "投資計画の見積書（複数業者からの相見積もり）",
      "市場調査・競合分析資料",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要と現在の事業状況",
        description:
          "事業内容、主要製品・サービス、直近の業績推移（売上・利益・従業員数）、業界内ポジションを記載します。成長加速化の基盤となる現状を示してください。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "growth_strategy",
        title: "成長戦略と目指す姿",
        description:
          "5年後に目指すビジョン・成長戦略の全体像を記載します。市場機会をどう捉え、どのように競争優位を確立するかを明確に示してください。",
        group: "事業計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "investment_plan",
        title: "投資計画の詳細",
        description:
          "成長加速化のために行う投資の内容（設備・システム・人材育成・販路開拓等）、各投資の目的・金額・スケジュールを記載します。投資の相互連携と相乗効果も説明してください。",
        group: "事業計画書",
        estimatedLength: "800〜1000字",
      },
      {
        key: "kpi_targets",
        title: "KPI設定と目標達成計画",
        description:
          "補助事業終了後5年間の具体的なKPI（売上高・付加価値額・従業員数・賃金水準等）と年度別目標値を設定します。各KPIの根拠と達成に向けたアクションプランを記載してください。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "implementation_structure",
        title: "実施体制と推進マネジメント",
        description:
          "成長加速化投資の実施体制、責任者・担当者の役割、外部専門家・認定支援機関との連携方法を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "financial_projection",
        title: "収支計画と投資回収",
        description:
          "5年間の売上・利益計画、投資回収シナリオ、補助金なしでの場合との比較を記載します。数値の根拠を示し、実現可能性の高い計画を提示してください。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "SEICHOU_KASOKUKA",
    popularity: 8,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-26",
  },
];
