import type { SubsidyInfo } from "@/types";

/**
 * 中小企業省力化投資補助金データ
 * SHOURYOKUKA - カタログ型省力化投資補助金
 */
export const shouryokukaSubsidies: SubsidyInfo[] = [
  // ============================================================
  // 中小企業省力化投資補助金
  // ============================================================
  {
    id: "shouryokuka-001",
    name: "中小企業省力化投資補助金",
    nameShort: "省力化補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "人手不足に悩む中小企業がカタログに掲載された省力化製品を導入する費用を補助します。随時申請受付中。",
    description:
      "中小企業省力化投資補助金は、人手不足が深刻な中小企業・小規模事業者が、あらかじめ登録された省力化製品（カタログ掲載製品）を導入するための費用を補助する制度です。IoT・AI・ロボット等を活用した製品のカタログから選んで申請できるため、従来の補助金と比べて申請手続きが簡素化されています。随時申請可能で、採択後すぐに導入を開始できます。",
    maxAmount: 1500,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: null,
    applicationPeriod: { start: "2024-09-01", end: null },
    url: "https://shoryokuka.smrj.go.jp/",
    categories: ["SETSUBI_TOUSHI", "IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "省力化",
      "人手不足",
      "カタログ型",
      "ロボット",
      "IoT",
      "AI",
      "自動化",
      "随時申請",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者または小規模事業者であること",
      "gBizIDプライムを取得していること",
      "カタログに掲載された省力化製品を導入すること",
      "省力化製品の販売・導入を行う登録事業者（販売店）と連携すること",
      "補助事業終了後3年間の事業計画の達成見込みがあること",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "カタログ未掲載の製品の導入",
      "過去に本補助金で不正受給を行った者",
      "申請時点で事業を実施していない者",
      "風俗営業等の規制及び業務の適正化等に関する法律に規定する事業を行う者",
    ],
    requiredDocuments: [
      "申請書（電子申請）",
      "事業計画書",
      "導入する省力化製品の見積書",
      "決算書（直近1期分）または確定申告書",
      "gBizIDプライムのアカウント",
      "省力化製品の登録事業者（販売店）との連携確認書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "事業概要と人手不足の現状",
        description:
          "現在の事業内容、従業員数、人手不足の実態と業務への影響を具体的に記載します。どの業務でどの程度の人手が不足しているかを数値で示してください。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "labor_saving_plan",
        title: "省力化計画と導入製品の概要",
        description:
          "導入する省力化製品の概要、選定理由、導入後の業務フローの変化を記載します。カタログ掲載製品の具体的な機能と自社業務への適合性を説明してください。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "equipment_details",
        title: "導入設備の詳細と費用計画",
        description:
          "導入する省力化製品の仕様、数量、費用の内訳を記載します。補助対象経費と自己負担額を明確にしてください。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "effect_forecast",
        title: "省力化効果と生産性向上の見通し",
        description:
          "省力化製品の導入によって期待される労働時間削減、生産性向上、売上・利益への効果を数値で記載します。導入前後の比較を具体的に示してください。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "implementation_schedule",
        title: "実施スケジュールと体制",
        description:
          "製品の発注・納品・設置・稼働開始までのスケジュール、担当者・実施体制を記載します。",
        group: "事業計画書",
        estimatedLength: "200〜400字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "SHOURYOKUKA",
    popularity: 9,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-26",
  },
];
