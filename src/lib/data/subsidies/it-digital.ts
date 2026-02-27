import type { SubsidyInfo } from "@/types";

/**
 * IT・DXカテゴリの補助金データ
 * IT_DIGITAL - IT導入・デジタル化・DX推進
 */
export const itDigitalSubsidies: SubsidyInfo[] = [
  // ============================================================
  // IT導入補助金（デジタル化基盤導入枠）
  // ============================================================
  {
    id: "it-donyu-001",
    name: "IT導入補助金（デジタル化基盤導入枠）",
    nameShort: "IT導入補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "中小企業・小規模事業者がITツール（ソフトウェア、サービス等）を導入する費用の一部を補助します。",
    description:
      "IT導入補助金は、中小企業・小規模事業者等が自社の課題やニーズに合ったITツール（ソフトウェア、サービス等）を導入する経費の一部を補助する制度です。デジタル化基盤導入枠では、会計ソフト・受発注ソフト・決済ソフト・ECソフトの導入費用に加え、PC・タブレット等のハードウェア購入費も対象となります。インボイス制度への対応も支援します。",
    maxAmount: 450,
    minAmount: 5,
    subsidyRate: "3/4",
    deadline: "2026-05-31",
    applicationPeriod: { start: "2026-03-15", end: "2026-05-31" },
    url: "https://www.it-hojo.jp/",
    categories: ["IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "IT導入",
      "デジタル化",
      "会計ソフト",
      "EC",
      "インボイス",
      "DX",
      "クラウド",
      "業務効率化",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "日本国内で法人登記され、日本国内で事業を営む法人または個人であること",
      "gBizIDプライムのアカウントを取得していること",
      "独立行政法人情報処理推進機構（IPA）が実施するSECURITY ACTIONの宣言を行うこと",
      "IT導入支援事業者が登録するITツールを導入すること",
    ],
    excludedCases: [
      "大企業の子会社等、みなし大企業に該当する者",
      "発注先との間に資本関係・人的関係がある場合",
      "過去1年以内に同一のITツールの導入で本補助金の交付を受けた者",
    ],
    requiredDocuments: [
      "履歴事項全部証明書（法人）または本人確認書類（個人）",
      "直近分の法人税の納税証明書（法人）または所得税の納税証明書（個人）",
      "gBizIDプライムのアカウント",
      "SECURITY ACTION宣言済みであることの確認書類",
      "導入するITツールの見積書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "事業概要",
        description:
          "自社の事業内容、主な商品・サービス、従業員数等の基本情報を記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "current_issues",
        title: "現在の業務課題",
        description:
          "IT導入によって解決したい現在の業務上の課題を具体的に記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "it_tool_plan",
        title: "導入するITツールと活用方法",
        description:
          "導入予定のITツールの名称、機能、活用方法を具体的に記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "expected_outcome",
        title: "導入による期待効果",
        description:
          "ITツール導入後の業務改善効果や生産性向上の見込みを数値目標を含めて記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "IT_DONYU",
    popularity: 9,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // IT導入補助金（通常枠）
  // ============================================================
  {
    id: "it-donyu-002",
    name: "IT導入補助金（通常枠）",
    nameShort: "IT導入補助金（通常枠）",
    department: "経済産業省・中小企業庁",
    summary:
      "中小企業が業務効率化や売上向上のためにITツールを導入する費用を最大450万円まで補助します。",
    description:
      "IT導入補助金の通常枠は、中小企業・小規模事業者が生産性向上のためにITツール（ソフトウェア、クラウドサービス等）を導入する際の費用を補助する制度です。A類型（30万～150万円未満）とB類型（150万～450万円以下）の2種類があり、労働生産性の向上や業務プロセスの改善を目指す幅広いITツールが対象です。",
    maxAmount: 450,
    minAmount: 30,
    subsidyRate: "1/2",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-15", end: "2026-06-30" },
    url: "https://www.it-hojo.jp/",
    categories: ["IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "IT導入",
      "業務効率化",
      "クラウド",
      "ERP",
      "CRM",
      "生産性向上",
      "SaaS",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "gBizIDプライムのアカウントを取得していること",
      "SECURITY ACTIONの宣言を行うこと",
      "IT導入支援事業者が登録するITツールを導入すること",
      "労働生産性の向上に関する数値目標を策定すること",
    ],
    excludedCases: [
      "大企業の子会社等、みなし大企業に該当する者",
      "過去に同一のITツールで本補助金の交付を受けた者",
      "ハードウェアのみの導入（通常枠ではソフトウェア必須）",
    ],
    requiredDocuments: [
      "履歴事項全部証明書（法人）または本人確認書類（個人）",
      "法人税または所得税の納税証明書",
      "gBizIDプライムのアカウント",
      "導入するITツールの見積書・事業計画書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "事業概要",
        description:
          "自社の事業内容、業種、従業員数等の基本情報を記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "current_issues",
        title: "現在の業務課題",
        description:
          "ITツール導入で解決したい業務課題を具体的に記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "it_tool_plan",
        title: "導入ITツールと活用計画",
        description:
          "導入予定のITツールの機能と業務への活用方法を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "productivity_target",
        title: "生産性向上目標",
        description:
          "ITツール導入後の労働生産性向上に関する数値目標を記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "IT_DONYU",
    popularity: 8,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // IT導入補助金（セキュリティ対策推進枠）
  // ============================================================
  {
    id: "it-donyu-003",
    name: "IT導入補助金（セキュリティ対策推進枠）",
    nameShort: "IT導入補助金（セキュリティ枠）",
    department: "経済産業省・中小企業庁",
    summary:
      "サイバーセキュリティ対策のためのサービス利用料を最大100万円、最長2年間補助します。",
    description:
      "IT導入補助金のセキュリティ対策推進枠は、サイバー攻撃の増加を踏まえ、中小企業のサイバーセキュリティ対策を支援する制度です。独立行政法人情報処理推進機構（IPA）が公表する「サイバーセキュリティお助け隊サービスリスト」に掲載されたサービスの利用料が対象となります。",
    maxAmount: 100,
    minAmount: 5,
    subsidyRate: "1/2",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-15", end: "2026-06-30" },
    url: "https://www.it-hojo.jp/",
    categories: ["IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "サイバーセキュリティ",
      "セキュリティ対策",
      "情報セキュリティ",
      "IT導入",
      "お助け隊",
      "IPA",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "gBizIDプライムのアカウントを取得していること",
      "SECURITY ACTIONの宣言を行うこと",
      "IPAが公表するサイバーセキュリティお助け隊サービスを導入すること",
    ],
    excludedCases: [
      "大企業の子会社等、みなし大企業に該当する者",
      "お助け隊サービスリストに掲載されていないサービスの導入",
      "過去に同一サービスで交付を受けた者",
    ],
    requiredDocuments: [
      "履歴事項全部証明書または本人確認書類",
      "法人税または所得税の納税証明書",
      "gBizIDプライムのアカウント",
      "導入するセキュリティサービスの見積書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "事業概要",
        description:
          "自社の事業内容と情報資産の状況を記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "security_issues",
        title: "セキュリティ課題",
        description:
          "自社のサイバーセキュリティ上の課題やリスクを記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "security_plan",
        title: "セキュリティ対策計画",
        description:
          "導入するセキュリティサービスと期待される効果を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "IT_DONYU",
    popularity: 7,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // IT導入補助金（複数社連携IT導入枠）
  // ============================================================
  {
    id: "it-donyu-004",
    name: "IT導入補助金（複数社連携IT導入枠）",
    nameShort: "IT導入補助金（複数社連携枠）",
    department: "経済産業省・中小企業庁",
    summary:
      "商業集積地の複数の中小企業が連携してITツールを導入する場合、最大3,000万円を補助します。",
    description:
      "IT導入補助金の複数社連携IT導入枠は、商店街等の商業集積地に所在する複数の中小企業・小規模事業者が連携してITツールを導入し、地域DXの実現や生産性向上を図る取り組みを支援します。幹事社が取りまとめを行い、参加事業者全体でITツールを導入します。",
    maxAmount: 3000,
    minAmount: 50,
    subsidyRate: "2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-15", end: "2026-06-30" },
    url: "https://www.it-hojo.jp/",
    categories: ["IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "IT導入",
      "複数社連携",
      "商店街",
      "地域DX",
      "デジタル化",
      "共同導入",
    ],
    eligibilityCriteria: [
      "商業集積地に所在する複数の中小企業・小規模事業者であること",
      "10者以上の事業者が参加すること",
      "幹事社が取りまとめを行うこと",
      "gBizIDプライムのアカウントを取得していること",
      "SECURITY ACTIONの宣言を行うこと",
    ],
    excludedCases: [
      "参加事業者が10者未満の場合",
      "商業集積地の枠組みに該当しない場合",
      "大企業の子会社等、みなし大企業に該当する者",
    ],
    requiredDocuments: [
      "幹事社の履歴事項全部証明書",
      "参加事業者一覧と各社の確認書類",
      "連携事業計画書",
      "導入するITツールの見積書",
      "gBizIDプライムのアカウント",
    ],
    applicationSections: [
      {
        key: "partnership_overview",
        title: "連携体制概要",
        description:
          "連携する事業者の構成と幹事社の体制を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "regional_issues",
        title: "地域の課題",
        description:
          "商業集積地における共通の課題を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "it_tool_plan",
        title: "IT導入計画",
        description:
          "連携して導入するITツールとその活用計画を記載します。",
        group: "事業計画",
        estimatedLength: "500〜800字",
      },
      {
        key: "expected_outcome",
        title: "期待される効果",
        description:
          "連携IT導入による地域全体への波及効果を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "IT_DONYU",
    popularity: 5,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // ものづくり補助金（デジタル枠）
  // ============================================================
  {
    id: "it-digital-005",
    name: "ものづくり・商業・サービス生産性向上促進補助金（デジタル枠）",
    nameShort: "ものづくり補助金（デジタル枠）",
    department: "経済産業省・中小企業庁",
    summary:
      "DXに資する革新的な製品・サービスの開発やデジタル技術を活用した生産プロセス改善を最大1,250万円補助します。",
    description:
      "ものづくり補助金のデジタル枠は、DX（デジタルトランスフォーメーション）に資する革新的な製品・サービス開発や、デジタル技術を活用した生産プロセス・サービス提供方法の改善に必要な設備投資等を支援します。AI、IoT、ロボット等のデジタル技術の活用が求められます。",
    maxAmount: 1250,
    minAmount: 100,
    subsidyRate: "2/3",
    deadline: "2026-05-31",
    applicationPeriod: { start: "2026-02-01", end: "2026-05-31" },
    url: "https://portal.monodukuri-hojo.jp/",
    categories: ["IT_DIGITAL", "SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "ものづくり",
      "DX",
      "AI",
      "IoT",
      "ロボット",
      "生産性向上",
      "設備投資",
      "デジタル技術",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "事業計画期間において付加価値額年率3%以上増加の達成を目指すこと",
      "事業計画期間において給与支給総額年率1.5%以上増加の達成を目指すこと",
      "事業場内最低賃金を地域別最低賃金+30円以上の水準にすること",
      "DXに資するデジタル技術を活用した事業であること",
    ],
    excludedCases: [
      "大企業の子会社等、みなし大企業に該当する者",
      "過去3年以内にものづくり補助金の交付を受けた者（一部例外あり）",
      "単なるPCやソフトウェアの入替のみで革新性がない場合",
      "デジタル技術の活用が認められない場合",
    ],
    requiredDocuments: [
      "事業計画書（A4で10ページ以内）",
      "賃金引上げ計画の誓約書",
      "決算書（直近2年間）",
      "従業員数確認書類",
      "補助対象経費の見積書",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要",
        description:
          "自社の事業内容、組織体制、主要取引先等を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "digital_innovation",
        title: "デジタル技術を活用した革新的取り組み",
        description:
          "導入するデジタル技術（AI、IoT等）とその革新性を記載します。",
        group: "事業計画",
        estimatedLength: "600〜1000字",
      },
      {
        key: "implementation_plan",
        title: "実施体制と計画",
        description:
          "事業の実施体制、スケジュール、費用計画を記載します。",
        group: "事業計画",
        estimatedLength: "500〜800字",
      },
      {
        key: "expected_outcome",
        title: "事業効果",
        description:
          "付加価値額・生産性向上の数値目標と根拠を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "MONODZUKURI",
    popularity: 8,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 事業再構築補助金（デジタル活用型）
  // ============================================================
  {
    id: "it-digital-006",
    name: "事業再構築補助金",
    nameShort: "事業再構築補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "ポストコロナ時代の経済社会の変化に対応するため、事業再構築に取り組む中小企業を最大1億円補助します。",
    description:
      "事業再構築補助金は、新分野展開・事業転換・業種転換・業態転換・事業再編といった事業再構築に意欲ある中小企業等を支援します。デジタル技術を活用した新事業展開（EC事業への参入、オンラインサービスの開始等）も対象となり、成長枠や産業構造転換枠などの類型があります。",
    maxAmount: 10000,
    minAmount: 100,
    subsidyRate: "2/3",
    deadline: "2026-04-30",
    applicationPeriod: { start: "2026-01-15", end: "2026-04-30" },
    url: "https://jigyou-saikouchiku.go.jp/",
    categories: ["IT_DIGITAL", "SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "事業再構築",
      "新分野展開",
      "DX",
      "EC",
      "オンライン",
      "事業転換",
      "業態転換",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "事業再構築指針に沿った新分野展開等を行うこと",
      "事業計画を認定経営革新等支援機関と策定すること",
      "補助事業終了後3〜5年で付加価値額年率3%以上増加を達成する計画を策定すること",
    ],
    excludedCases: [
      "大企業の子会社等、みなし大企業に該当する者",
      "事業再構築の要件（新規性・市場の新規性等）を満たさない場合",
      "単なる設備の更新で新規性がない場合",
      "不動産賃貸業等、補助対象外の業種への展開",
    ],
    requiredDocuments: [
      "事業計画書（A4で15ページ以内）",
      "認定経営革新等支援機関の確認書",
      "決算書（直近2期分）",
      "従業員数確認書類",
      "経費明細書・見積書",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要",
        description:
          "自社の事業内容、経営状況、主要取引先等を記載します。",
        group: "事業計画",
        estimatedLength: "500〜800字",
      },
      {
        key: "restructuring_necessity",
        title: "事業再構築の必要性",
        description:
          "現在の事業環境と事業再構築が必要な理由を記載します。",
        group: "事業計画",
        estimatedLength: "600〜1000字",
      },
      {
        key: "restructuring_plan",
        title: "事業再構築の具体的内容",
        description:
          "新事業の内容、デジタル技術の活用方法、市場分析を記載します。",
        group: "事業計画",
        estimatedLength: "800〜1200字",
      },
      {
        key: "implementation_schedule",
        title: "実施体制とスケジュール",
        description:
          "事業実施の体制、スケジュール、費用計画を記載します。",
        group: "事業計画",
        estimatedLength: "500〜800字",
      },
      {
        key: "revenue_plan",
        title: "収益計画",
        description:
          "事業再構築後の売上・利益の見通しと付加価値額の計画を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "JIGYOU_SAIKOUCHIKU",
    popularity: 9,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 小規模事業者持続化補助金（IT活用型）
  // ============================================================
  {
    id: "it-digital-007",
    name: "小規模事業者持続化補助金",
    nameShort: "持続化補助金",
    department: "日本商工会議所・全国商工会連合会",
    summary:
      "小規模事業者の販路開拓や業務効率化（IT導入含む）の取り組みを最大200万円補助します。",
    description:
      "小規模事業者持続化補助金は、小規模事業者が経営計画を策定し、販路開拓や業務効率化に取り組む費用を補助する制度です。ウェブサイト構築、EC機能追加、業務用ソフトウェア導入等のIT活用による販路開拓も対象です。通常枠（50万円）のほか、賃金引上げ枠・卒業枠等で最大200万円まで補助されます。",
    maxAmount: 200,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-05-31",
    applicationPeriod: { start: "2026-02-01", end: "2026-05-31" },
    url: "https://r3.jizokukahojokin.info/",
    categories: ["IT_DIGITAL", "HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO"],
    targetIndustries: ["ALL"],
    tags: [
      "持続化補助金",
      "小規模事業者",
      "販路開拓",
      "EC構築",
      "ウェブサイト",
      "業務効率化",
      "IT活用",
    ],
    eligibilityCriteria: [
      "小規模事業者であること（商業・サービス業5人以下、製造業等20人以下）",
      "商工会議所または商工会の管轄地域内で事業を営んでいること",
      "経営計画を策定していること",
      "商工会議所または商工会の助言・指導を受けること",
    ],
    excludedCases: [
      "小規模事業者に該当しない事業者",
      "ウェブサイト関連費のみの申請（1/4が上限）",
      "直近3年以内に持続化補助金の採択を受け、事業実施中の者",
    ],
    requiredDocuments: [
      "経営計画書兼補助事業計画書",
      "補助事業計画書",
      "事業支援計画書（商工会議所等が発行）",
      "直近の確定申告書の写し",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "企業概要",
        description:
          "自社の事業内容、商品・サービス、顧客層を記載します。",
        group: "経営計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "sales_plan",
        title: "販路開拓の取り組み",
        description:
          "IT活用を含む具体的な販路開拓の取り組みを記載します。",
        group: "補助事業計画書",
        estimatedLength: "500〜800字",
      },
      {
        key: "expected_outcome",
        title: "補助事業の効果",
        description:
          "IT活用による売上向上や業務効率化の効果を数値で記載します。",
        group: "補助事業計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "JIZOKUKA",
    popularity: 8,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業省力化投資補助金（カタログ型）
  // ============================================================
  {
    id: "it-digital-008",
    name: "中小企業省力化投資補助金（カタログ型）",
    nameShort: "省力化投資補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "人手不足に悩む中小企業がカタログから省力化製品（IoT機器、ロボット等）を選んで導入する費用を最大1,500万円補助します。",
    description:
      "中小企業省力化投資補助金は、人手不足に直面する中小企業等に対し、IoTやロボット等の省力化製品を導入する費用を補助する制度です。あらかじめカタログに登録された製品から選んで導入するため、手続きが比較的簡便です。業務自動化、自動精算機、配膳ロボット等が対象となります。",
    maxAmount: 1500,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: "2026-09-30",
    applicationPeriod: { start: "2026-03-01", end: "2026-09-30" },
    url: "https://shoryokuka.smrj.go.jp/",
    categories: ["IT_DIGITAL", "SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "省力化",
      "IoT",
      "ロボット",
      "自動化",
      "人手不足",
      "生産性向上",
      "カタログ型",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "人手不足の状態にあることを示せること",
      "カタログに登録された省力化製品を導入すること",
      "省力化製品の販売事業者と共同で申請すること",
      "賃金引上げ計画を策定すること（賃金引上げ枠の場合）",
    ],
    excludedCases: [
      "大企業の子会社等、みなし大企業に該当する者",
      "カタログに登録されていない製品の導入",
      "既に保有している同等の製品の更新",
    ],
    requiredDocuments: [
      "履歴事項全部証明書または本人確認書類",
      "決算書（直近1期分）",
      "人手不足の状況を示す書類",
      "省力化製品の見積書",
      "販売事業者との共同申請書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "事業者概要",
        description:
          "自社の事業内容と人手不足の状況を記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "labor_saving_plan",
        title: "省力化計画",
        description:
          "導入する省力化製品と期待される省力化効果を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "expected_outcome",
        title: "導入効果",
        description:
          "省力化による業務改善と生産性向上の見込みを記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 7,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業デジタル化応援隊事業
  // ============================================================
  {
    id: "it-digital-009",
    name: "中小企業デジタル化応援隊事業",
    nameShort: "デジタル化応援隊",
    department: "経済産業省・中小企業庁",
    summary:
      "IT専門家によるデジタル化支援を受ける中小企業に対し、専門家謝金を時間単価3,500円（税別）まで補助します。",
    description:
      "中小企業デジタル化応援隊事業は、IT専門家（フリーランス含む）がデジタル化の相談や支援を行う際の謝金の一部を補助する制度です。デジタル化に関する相談、IT戦略策定、ツール選定・導入支援、セキュリティ対策支援等が対象です。中小企業がデジタル化の第一歩を踏み出すための伴走支援型の事業です。",
    maxAmount: 30,
    minAmount: null,
    subsidyRate: "1/1",
    deadline: "2026-12-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-12-31" },
    url: "https://digitalization-support.jp/",
    categories: ["IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "デジタル化支援",
      "IT専門家",
      "コンサルティング",
      "伴走支援",
      "DX推進",
      "IT戦略",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "デジタル化に関する相談・支援を希望すること",
      "本事業に登録されたIT専門家から支援を受けること",
    ],
    excludedCases: [
      "大企業の子会社等、みなし大企業に該当する者",
      "既にIT専門家と契約関係にある場合の既存業務",
      "ソフトウェア・ハードウェアの購入費用（対象は専門家謝金のみ）",
    ],
    requiredDocuments: [
      "中小企業者であることの確認書類",
      "デジタル化支援計画書",
      "IT専門家の支援内容・時間の記録",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "企業概要",
        description:
          "自社の事業内容とデジタル化の現状を記載します。",
        group: "支援計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "digitalization_needs",
        title: "デジタル化のニーズ",
        description:
          "どのような分野でデジタル化支援を受けたいかを記載します。",
        group: "支援計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 6,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 東京都中小企業DX推進支援事業
  // ============================================================
  {
    id: "it-digital-010",
    name: "東京都中小企業DX推進支援事業助成金",
    nameShort: "東京都DX推進助成金",
    department: "東京都・東京都中小企業振興公社",
    summary:
      "東京都内の中小企業がDXを推進するためのシステム開発・導入費用を最大300万円助成します。",
    description:
      "東京都中小企業DX推進支援事業助成金は、東京都内の中小企業がデジタルトランスフォーメーション（DX）を推進するために必要なシステム・ソフトウェア導入、クラウドサービス利用料、専門家への委託費等を助成する制度です。都が実施するDX推進支援プログラムの受講が前提条件となります。",
    maxAmount: 300,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-30" },
    url: "https://www.tokyo-kosha.or.jp/",
    categories: ["IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "東京都",
      "DX推進",
      "システム導入",
      "クラウド",
      "デジタル化",
      "自治体助成金",
    ],
    eligibilityCriteria: [
      "東京都内に事業所を有する中小企業者であること",
      "東京都のDX推進支援プログラムを受講していること",
      "DXに関する計画を策定していること",
      "都税の納税証明書を提出できること",
    ],
    excludedCases: [
      "東京都内に事業所がない事業者",
      "DX推進支援プログラムを未受講の事業者",
      "同一事業で他の都の助成金を受けている場合",
      "大企業の子会社等、みなし大企業に該当する者",
    ],
    requiredDocuments: [
      "DX推進支援プログラム受講証明",
      "DX推進計画書",
      "履歴事項全部証明書",
      "都税の納税証明書",
      "経費の見積書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "企業概要",
        description:
          "自社の事業内容と現在のIT活用状況を記載します。",
        group: "DX計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "dx_strategy",
        title: "DX推進戦略",
        description:
          "自社のDX推進方針と導入するシステム・サービスを記載します。",
        group: "DX計画",
        estimatedLength: "500〜800字",
      },
      {
        key: "expected_outcome",
        title: "期待される成果",
        description:
          "DX推進による業務改善・売上向上等の効果を記載します。",
        group: "DX計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "KEIEI_KAKUSHIN",
    popularity: 7,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業サイバーセキュリティ対策促進事業
  // ============================================================
  {
    id: "it-digital-011",
    name: "サイバーセキュリティ対策促進助成金",
    nameShort: "サイバーセキュリティ助成金",
    department: "東京都・東京都中小企業振興公社",
    summary:
      "中小企業のサイバーセキュリティ対策に必要な機器・サービスの導入費用を最大1,500万円助成します。",
    description:
      "サイバーセキュリティ対策促進助成金は、東京都内の中小企業がサイバーセキュリティ対策を強化するために、UTM等のセキュリティ機器、EDR等の対策ソフト、監視サービス等を導入する費用を助成する制度です。IPAのSECURITY ACTION二つ星を宣言していることが要件です。",
    maxAmount: 1500,
    minAmount: 5,
    subsidyRate: "1/2",
    deadline: "2026-09-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-09-30" },
    url: "https://www.tokyo-kosha.or.jp/",
    categories: ["IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "サイバーセキュリティ",
      "UTM",
      "EDR",
      "情報セキュリティ",
      "東京都",
      "セキュリティ機器",
    ],
    eligibilityCriteria: [
      "東京都内に事業所を有する中小企業者であること",
      "IPAのSECURITY ACTION二つ星を宣言していること",
      "サイバーセキュリティに関する取り組みを実施する意思があること",
      "都税の納税証明書を提出できること",
    ],
    excludedCases: [
      "東京都内に事業所がない事業者",
      "SECURITY ACTION二つ星を未宣言の事業者",
      "既に同一機器・サービスで助成を受けた場合",
    ],
    requiredDocuments: [
      "SECURITY ACTION二つ星宣言の証明書類",
      "セキュリティ対策計画書",
      "履歴事項全部証明書",
      "都税の納税証明書",
      "導入機器・サービスの見積書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "企業概要",
        description:
          "自社の事業内容とIT環境の現状を記載します。",
        group: "セキュリティ計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "security_assessment",
        title: "セキュリティ現状評価",
        description:
          "自社の情報セキュリティ上のリスクと課題を記載します。",
        group: "セキュリティ計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "security_plan",
        title: "セキュリティ対策計画",
        description:
          "導入するセキュリティ機器・サービスと対策の内容を記載します。",
        group: "セキュリティ計画",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 6,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業等経営強化法に基づく経営力向上計画（IT活用）
  // ============================================================
  {
    id: "it-digital-012",
    name: "経営力向上計画（IT関連設備投資の税制優遇）",
    nameShort: "経営力向上計画（IT税制）",
    department: "経済産業省・中小企業庁",
    summary:
      "経営力向上計画の認定を受けた中小企業がIT関連設備を導入する場合、即時償却または10%税額控除を受けられます。",
    description:
      "中小企業等経営強化法に基づく経営力向上計画の認定を受けた中小企業は、設備投資に対する税制優遇を受けることができます。IT関連設備（サーバー、ソフトウェア、IoT機器等）の導入に対し、即時償却または取得価額の10%の税額控除（資本金3,000万円超は7%）が適用されます。補助金ではなく税制優遇ですが、実質的な負担軽減効果があります。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "即時償却 or 10%税額控除",
    deadline: "2027-03-31",
    applicationPeriod: { start: "2026-04-01", end: "2027-03-31" },
    url: "https://www.chusho.meti.go.jp/keiei/kyoka/",
    categories: ["IT_DIGITAL", "SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "税制優遇",
      "経営力向上計画",
      "即時償却",
      "税額控除",
      "IT設備",
      "サーバー",
      "ソフトウェア",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "経営力向上計画を策定し、主務大臣の認定を受けること",
      "計画に基づくIT関連設備投資を行うこと",
      "認定後に設備を取得すること（事前取得は不可）",
    ],
    excludedCases: [
      "経営力向上計画の認定を受けていない事業者",
      "認定前に設備を取得した場合",
      "リース取引の場合（一部例外あり）",
    ],
    requiredDocuments: [
      "経営力向上計画申請書",
      "工業会等の証明書（生産性向上設備の場合）",
      "投資計画確認書（収益力強化設備の場合）",
      "履歴事項全部証明書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "企業概要",
        description:
          "自社の事業内容、経営状況を記載します。",
        group: "経営力向上計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "improvement_plan",
        title: "経営力向上の内容",
        description:
          "IT設備導入による経営力向上の具体的な内容を記載します。",
        group: "経営力向上計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "investment_plan",
        title: "設備投資計画",
        description:
          "導入するIT設備の内容、金額、導入時期を記載します。",
        group: "経営力向上計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 7,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業新事業活動促進事業（EC・オンライン販売支援）
  // ============================================================
  {
    id: "it-digital-013",
    name: "ECサイト構築・活用支援補助金",
    nameShort: "EC構築支援補助金",
    department: "各都道府県・市区町村（自治体独自）",
    summary:
      "中小企業のECサイト構築・リニューアル・EC機能追加にかかる費用を自治体が補助します（上限は自治体により50万～200万円）。",
    description:
      "各都道府県・市区町村が独自に実施するECサイト構築・活用支援補助金です。新規ECサイトの構築、既存サイトへのEC機能追加、ECモールへの出店費用、EC運用に必要な撮影・デザイン費用等が対象です。自治体によって補助上限額・補助率は異なりますが、多くの自治体が中小企業のオンライン販売参入を支援しています。",
    maxAmount: 200,
    minAmount: null,
    subsidyRate: "1/2〜2/3",
    deadline: null,
    applicationPeriod: null,
    url: null,
    categories: ["IT_DIGITAL", "HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "ECサイト",
      "オンライン販売",
      "EC構築",
      "ネットショップ",
      "自治体補助金",
      "販路開拓",
    ],
    eligibilityCriteria: [
      "対象自治体内に事業所を有する中小企業者であること",
      "ECサイトの新規構築またはリニューアルを行うこと",
      "各自治体の定める要件を満たすこと",
    ],
    excludedCases: [
      "対象自治体外の事業者",
      "既にEC事業で十分な売上がある場合（自治体による）",
      "個人的な物品販売（事業としてのEC運営でない場合）",
    ],
    requiredDocuments: [
      "事業計画書",
      "ECサイト構築の見積書",
      "履歴事項全部証明書または確定申告書",
      "各自治体が定める申請書類",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "事業概要",
        description:
          "自社の事業内容と現在の販売チャネルを記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "ec_plan",
        title: "EC事業計画",
        description:
          "構築するECサイトの概要、取扱商品、販売戦略を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "expected_outcome",
        title: "期待される効果",
        description:
          "EC展開による売上向上・新規顧客獲得の見込みを記載します。",
        group: "事業計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 6,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // テレワーク促進助成金
  // ============================================================
  {
    id: "it-digital-014",
    name: "テレワーク促進助成金",
    nameShort: "テレワーク助成金",
    department: "東京都・東京しごと財団",
    summary:
      "テレワーク環境整備に必要なシステム・機器の導入費用を最大250万円助成します。",
    description:
      "テレワーク促進助成金は、都内の中堅・中小企業がテレワーク環境を整備するための費用を助成する制度です。テレワーク用のクラウドサービス、VPN機器、Web会議システム、グループウェア、リモートアクセスツール、セキュリティ機器等の導入費用が対象です。新たにテレワーク制度を導入する企業を重点的に支援します。",
    maxAmount: 250,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-12-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-12-31" },
    url: "https://www.shigotozaidan.or.jp/",
    categories: ["IT_DIGITAL"],
    targetScale: ["CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "テレワーク",
      "リモートワーク",
      "VPN",
      "Web会議",
      "クラウド",
      "働き方改革",
      "東京都",
    ],
    eligibilityCriteria: [
      "都内に事業所を有する中堅・中小企業であること",
      "常時雇用する労働者が2名以上999名以下であること",
      "テレワーク制度を新たに導入または拡充すること",
      "都税の滞納がないこと",
    ],
    excludedCases: [
      "都内に事業所がない事業者",
      "常時雇用する労働者が1名以下または1,000名以上の事業者",
      "既にテレワーク環境が十分に整備されている場合",
    ],
    requiredDocuments: [
      "助成金申請書",
      "テレワーク導入計画書",
      "就業規則の写し（テレワーク規程を含む）",
      "履歴事項全部証明書",
      "都税の納税証明書",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "企業概要",
        description:
          "自社の事業内容と現在の勤務体制を記載します。",
        group: "導入計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "telework_plan",
        title: "テレワーク導入計画",
        description:
          "導入するテレワーク環境（システム・機器）と運用計画を記載します。",
        group: "導入計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "expected_outcome",
        title: "期待される効果",
        description:
          "テレワーク導入による生産性向上・従業員満足度向上の見込みを記載します。",
        group: "導入計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 6,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },
];
