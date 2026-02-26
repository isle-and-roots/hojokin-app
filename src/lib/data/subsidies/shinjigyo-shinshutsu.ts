import type { SubsidyInfo } from "@/types";

/**
 * 中小企業新事業進出補助金データ
 * SHINJIGYO_SHINSHUTSU - 新たな事業領域への進出を支援
 */
export const shinjiyoShinshutsuSubsidies: SubsidyInfo[] = [
  // ============================================================
  // 中小企業新事業進出補助金
  // ============================================================
  {
    id: "shinjigyo-shinshutsu-001",
    name: "中小企業新事業進出補助金",
    nameShort: "新事業進出補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "既存の経営資源を活かして新たな事業領域に進出する中小企業の取り組みを支援します。締切: 2026年3月26日。",
    description:
      "中小企業新事業進出補助金は、既存事業の強み・ノウハウ・設備等の経営資源を活用して、新たな製品・サービスの開発や新市場への進出に取り組む中小企業・小規模事業者を支援する制度です。事業再構築補助金の流れを汲む新たな補助金として、2025年度から本格展開されています。既存事業とのシナジーを活かした新事業進出計画が求められます。",
    maxAmount: 9000,
    minAmount: 100,
    subsidyRate: "1/2〜2/3",
    deadline: "2026-03-26",
    applicationPeriod: { start: "2026-01-15", end: "2026-03-26" },
    url: "https://shinjigyo-shinshutsu.go.jp/",
    categories: ["SOUZOU_TENKAN", "SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "新事業進出",
      "新分野展開",
      "事業多角化",
      "新製品開発",
      "新市場開拓",
      "経営資源活用",
      "成長戦略",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者または小規模事業者であること",
      "既存の経営資源（設備・技術・ノウハウ・顧客基盤等）を活用した新事業進出であること",
      "新事業が既存事業とは異なる製品・サービスまたは市場への進出であること",
      "認定経営革新等支援機関の確認を受けた事業計画を策定していること",
      "補助事業終了後3〜5年の事業計画における付加価値額増加を示すこと",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "既存事業の単純な拡大・継続にとどまる取り組み",
      "事業計画について認定支援機関の確認を受けていない者",
      "過去3年間に本補助金または類似補助金で不正受給を行った者",
      "暴力団関係者または反社会的勢力",
    ],
    requiredDocuments: [
      "事業計画書",
      "認定経営革新等支援機関による確認書",
      "決算書（直近2期分）",
      "既存経営資源の活用を示す資料",
      "新事業市場の調査資料",
      "見積書（設備投資・システム開発等）",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "現在の事業概要と経営資源",
        description:
          "現在の事業内容、主要製品・サービス、強み・技術・ノウハウ等の経営資源を記載します。新事業進出の基盤となる既存の強みを明確にしてください。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "new_business_plan",
        title: "新事業進出の計画",
        description:
          "進出する新事業の概要、新製品・新サービスの内容、既存経営資源との関連性を記載します。なぜその新事業に進出するのか、なぜ自社が実現できるのかを示してください。",
        group: "事業計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "market_analysis",
        title: "市場分析と競合優位性",
        description:
          "新事業のターゲット市場規模・成長性、競合状況、自社の競争優位性を分析します。市場データや調査結果を用いて客観的に記載してください。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "implementation_structure",
        title: "実施体制と推進計画",
        description:
          "新事業の実施体制（担当者・組織体制・外部連携）、投資計画、マイルストーンを設定したスケジュールを記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "financial_projection",
        title: "収支計画と事業効果",
        description:
          "新事業の売上・利益計画（3〜5年）、付加価値額の増加見込み、投資回収計画を記載します。根拠のある数値を示してください。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "risk_measures",
        title: "リスクと対応策",
        description:
          "新事業進出における主要リスク（市場リスク、技術リスク、資金リスク等）とその対応策を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "SHINJIGYO_SHINSHUTSU",
    popularity: 8,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-26",
  },
];
