import type { SubsidyInfo } from "@/types";

/**
 * 販路開拓カテゴリの補助金データ
 * HANBAI_KAIKAKU - 販路開拓・マーケティング・海外展開
 */
export const hanbaiKaikakuSubsidies: SubsidyInfo[] = [
  // ============================================================
  // 小規模事業者持続化補助金（一般型）
  // ============================================================
  {
    id: "jizokuka-001",
    name: "小規模事業者持続化補助金（一般型）",
    nameShort: "持続化補助金",
    department: "中小企業庁",
    summary:
      "小規模事業者が経営計画を策定し、販路開拓等に取り組む費用の一部を補助する制度です。",
    description:
      "小規模事業者持続化補助金は、小規模事業者が自社の経営を見直し、自らが持続的な経営に向けた経営計画を作成した上で行う販路開拓や生産性向上の取組を支援する制度です。商工会・商工会議所のサポートを受けながら経営計画書・補助事業計画書を作成し、審査を経て採択された場合に補助金が交付されます。地道な販路開拓等の取り組みに加え、業務効率化の取り組みも対象となります。",
    maxAmount: 250,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-30" },
    url: "https://r3.jizokukahojokin.info/",
    categories: ["HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO"],
    targetIndustries: ["ALL"],
    tags: [
      "販路開拓",
      "小規模事業者",
      "経営計画",
      "商工会議所",
      "持続化",
      "チラシ",
      "HP作成",
      "広告",
    ],
    eligibilityCriteria: [
      "商業・サービス業（宿泊業・娯楽業除く）は常時使用する従業員数が5人以下であること",
      "サービス業のうち宿泊業・娯楽業は常時使用する従業員数が20人以下であること",
      "製造業その他は常時使用する従業員数が20人以下であること",
      "商工会議所または商工会の管轄地域内で事業を営んでいること",
      "持続的な経営に向けた経営計画を策定していること",
    ],
    excludedCases: [
      "医師、歯科医師、助産師",
      "系統出荷による収入のみの個人農業者",
      "一般社団法人・一般財団法人・医療法人",
      "申請時点で開業届を提出していない創業予定者",
      "過去に本補助金の採択を受け、補助事業実施期間中である者",
    ],
    requiredDocuments: [
      "経営計画書兼補助事業計画書（様式2・様式3）",
      "補助事業計画書（様式3）",
      "事業支援計画書（様式4）※商工会議所が発行",
      "直近1期分の確定申告書（法人は決算書）",
      "貸借対照表および損益計算書（法人の場合）",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要",
        description:
          "事業の沿革、主な商品・サービス、従業員数、直近の売上・利益などの基本情報を記載します。審査員があなたの事業を理解するための最初のセクションです。",
        group: "様式2",
        estimatedLength: "400〜600字",
      },
      {
        key: "customer_needs_market",
        title: "顧客ニーズと市場の動向",
        description:
          "ターゲット顧客のニーズや市場環境の変化について分析します。市場の動向やトレンド、競合他社の状況なども含めて記載してください。",
        group: "様式2",
        estimatedLength: "400〜600字",
      },
      {
        key: "strengths",
        title: "自社や自社の提供する商品・サービスの強み",
        description:
          "自社の強みや他社との差別化ポイントを明確に記載します。技術力、立地、顧客基盤、ノウハウなど、具体的に示してください。",
        group: "様式2",
        estimatedLength: "300〜500字",
      },
      {
        key: "management_plan",
        title: "経営方針・目標と今後のプラン",
        description:
          "今後の経営方針・目標と、それを達成するための具体的な計画を記載します。数値目標を含めると効果的です。",
        group: "様式2",
        estimatedLength: "400〜600字",
      },
      {
        key: "project_name",
        title: "補助事業で行う事業名",
        description:
          "補助事業として実施する取り組みの名称を30字以内で簡潔に記載します。事業内容が一目でわかるタイトルにしてください。",
        group: "様式3",
        estimatedLength: "30字以内",
      },
      {
        key: "sales_expansion_plan",
        title: "販路開拓等の取組内容",
        description:
          "具体的に行う販路開拓の取り組み内容を記載します。新たな顧客層の獲得方法、広告宣伝の計画、展示会への出展計画などを具体的に示してください。",
        group: "様式3",
        estimatedLength: "800〜1200字",
      },
      {
        key: "efficiency_plan",
        title: "業務効率化（生産性向上）の取組内容",
        description:
          "業務プロセスの改善や生産性向上に向けた取り組みを記載します。IT活用や業務フローの見直し等、効率化の具体策を示してください。",
        group: "様式3",
        estimatedLength: "400〜600字",
      },
      {
        key: "expected_effects",
        title: "補助事業の効果",
        description:
          "補助事業を実施することで期待される売上増加、新規顧客獲得数、生産性向上等の効果を具体的な数値を含めて記載します。",
        group: "様式3",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "JIZOKUKA",
    popularity: 10,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 小規模事業者持続化補助金（創業枠）
  // ============================================================
  {
    id: "jizokuka-sougyou-001",
    name: "小規模事業者持続化補助金（創業枠）",
    nameShort: "持続化補助金（創業枠）",
    department: "中小企業庁",
    summary:
      "産業競争力強化法に基づく「特定創業支援等事業」の支援を受けた創業者が販路開拓を行う取り組みを支援します。",
    description:
      "小規模事業者持続化補助金の創業枠は、産業競争力強化法に基づく「特定創業支援等事業」の支援を受け、過去3年以内に開業届を提出した創業者または創業予定者を対象とした特別枠です。通常枠よりも手厚い上限額が設定されており、創業時の販路開拓の取り組みを支援します。",
    maxAmount: 200,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-30" },
    url: "https://r3.jizokukahojokin.info/",
    categories: ["HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO"],
    targetIndustries: ["ALL"],
    tags: [
      "創業",
      "起業",
      "スタートアップ",
      "販路開拓",
      "特定創業支援等事業",
      "小規模事業者",
    ],
    eligibilityCriteria: [
      "産業競争力強化法に基づく「特定創業支援等事業」の支援を受けた者であること",
      "過去3年以内に開業届を提出した者、または創業予定者であること",
      "小規模事業者の定義を満たすこと（従業員数の要件）",
      "商工会議所または商工会の管轄地域内で事業を営む（営む予定の）者であること",
    ],
    excludedCases: [
      "特定創業支援等事業の証明書を取得していない者",
      "過去3年以内に開業届を提出していない者（創業予定者を除く）",
      "一般社団法人・医療法人等",
    ],
    requiredDocuments: [
      "経営計画書兼補助事業計画書（様式2・様式3）",
      "特定創業支援等事業による支援を受けたことの証明書",
      "開業届の写し（提出済みの場合）",
      "事業支援計画書（様式4）※商工会議所が発行",
    ],
    applicationSections: [
      {
        key: "business_concept",
        title: "創業の動機と事業概要",
        description:
          "創業に至った動機、事業コンセプト、提供する商品・サービスの概要を記載します。",
        group: "経営計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "market_target",
        title: "ターゲット市場と顧客像",
        description:
          "想定するターゲット顧客層、市場環境、競合状況と差別化ポイントを記載します。",
        group: "経営計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "sales_strategy",
        title: "販路開拓の取組内容",
        description:
          "補助事業として行う販路開拓の具体的な取り組み内容を記載します。",
        group: "補助事業計画",
        estimatedLength: "600〜800字",
      },
      {
        key: "growth_plan",
        title: "事業の成長計画と期待効果",
        description:
          "創業後の成長見込み、売上目標、補助事業による期待効果を記載します。",
        group: "補助事業計画",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "JIZOKUKA",
    popularity: 7,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // JAPANブランド育成支援等事業
  // ============================================================
  {
    id: "japan-brand-001",
    name: "JAPANブランド育成支援等事業",
    nameShort: "JAPANブランド補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "海外展開やインバウンド需要の獲得を目指す中小企業の取り組みを支援します。",
    description:
      "JAPANブランド育成支援等事業は、海外展開やそれを見据えたインバウンド需要の獲得に取り組む中小企業等を支援する制度です。海外市場での新たな販路開拓、ブランディング、プロモーション活動等に必要な経費を補助します。海外見本市への出展、海外バイヤーとの商談、パッケージデザインの刷新、外国語対応のWebサイト構築等に活用できます。",
    maxAmount: 500,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-05-15",
    applicationPeriod: { start: "2026-03-01", end: "2026-05-15" },
    url: "https://www.chusho.meti.go.jp/shogyo/chiiki/japan_brand/",
    categories: ["HANBAI_KAIKAKU", "CHIIKI_KASSEIKA"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "INSHOKU", "SERVICE", "ALL"],
    tags: [
      "海外展開",
      "輸出",
      "インバウンド",
      "ブランディング",
      "越境EC",
      "海外見本市",
      "JAPAN",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "海外展開またはインバウンド需要の獲得に意欲があること",
      "海外展開に関する事業計画を策定していること",
      "自社の製品・サービスに独自のブランド価値を有すること",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "海外展開の具体的計画がない場合",
      "単なる海外旅行と区別がつかない渡航",
      "過去に本事業で不正受給を行った者",
    ],
    requiredDocuments: [
      "事業計画書",
      "海外展開戦略の概要書",
      "決算書（直近1期分）",
      "製品・サービスの資料（パンフレット等）",
      "見積書（海外見本市出展費、翻訳費等）",
    ],
    applicationSections: [
      {
        key: "brand_overview",
        title: "自社ブランドの概要",
        description:
          "自社の商品・サービスのブランド価値、独自性、これまでの実績を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "overseas_strategy",
        title: "海外展開戦略",
        description:
          "ターゲット国・地域、想定顧客、競合分析、参入方法を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "promotion_plan",
        title: "プロモーション計画",
        description:
          "海外見本市出展、EC活用、PR活動等の具体的なプロモーション施策を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "sales_projection",
        title: "売上目標と事業スケジュール",
        description:
          "海外売上の目標値、事業の実施スケジュール、KPI設定を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 小規模事業者持続化補助金（賃金引上げ枠）
  // ============================================================
  {
    id: "jizokuka-chingin-001",
    name: "小規模事業者持続化補助金（賃金引上げ枠）",
    nameShort: "持続化補助金（賃金引上げ枠）",
    department: "中小企業庁",
    summary:
      "事業場内最低賃金を地域別最低賃金より+50円以上とした上で、販路開拓に取り組む小規模事業者を支援します。",
    description:
      "小規模事業者持続化補助金の賃金引上げ枠は、事業場内最低賃金が地域別最低賃金より+50円以上である小規模事業者が行う販路開拓等の取り組みを支援する特別枠です。通常枠よりも補助上限額が引き上げられており、賃金引上げと販路開拓を同時に進める事業者を後押しします。赤字事業者はさらに補助率が3/4に引き上げられます。",
    maxAmount: 200,
    minAmount: null,
    subsidyRate: "2/3（赤字事業者は3/4）",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-30" },
    url: "https://r3.jizokukahojokin.info/",
    categories: ["HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO"],
    targetIndustries: ["ALL"],
    tags: [
      "販路開拓",
      "賃金引上げ",
      "最低賃金",
      "小規模事業者",
      "持続化",
      "人件費",
    ],
    eligibilityCriteria: [
      "事業場内最低賃金が地域別最低賃金より+50円以上であること",
      "小規模事業者の定義を満たすこと（従業員数の要件）",
      "商工会議所または商工会の管轄地域内で事業を営んでいること",
      "持続的な経営に向けた経営計画を策定していること",
    ],
    excludedCases: [
      "事業場内最低賃金が地域別最低賃金+50円未満の事業者",
      "医師、歯科医師、助産師",
      "一般社団法人・一般財団法人・医療法人",
    ],
    requiredDocuments: [
      "経営計画書兼補助事業計画書（様式2・様式3）",
      "事業支援計画書（様式4）※商工会議所が発行",
      "賃金台帳の写し（最低賃金要件の証明）",
      "直近1期分の確定申告書（法人は決算書）",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要",
        description:
          "事業の沿革、主な商品・サービス、従業員数、賃金状況などの基本情報を記載します。",
        group: "様式2",
        estimatedLength: "400〜600字",
      },
      {
        key: "wage_improvement",
        title: "賃金引上げの取組状況",
        description:
          "現在の賃金水準、引上げの経緯と今後の計画を記載します。",
        group: "様式2",
        estimatedLength: "300〜500字",
      },
      {
        key: "sales_expansion_plan",
        title: "販路開拓等の取組内容",
        description:
          "賃金引上げを支えるための販路開拓の具体的な取り組み内容を記載します。",
        group: "様式3",
        estimatedLength: "800〜1200字",
      },
      {
        key: "expected_effects",
        title: "補助事業の効果",
        description:
          "売上増加見込み、新規顧客獲得数、賃金引上げの持続可能性等を記載します。",
        group: "様式3",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "JIZOKUKA",
    popularity: 7,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 小規模事業者持続化補助金（インボイス枠）
  // ============================================================
  {
    id: "jizokuka-invoice-001",
    name: "小規模事業者持続化補助金（インボイス枠）",
    nameShort: "持続化補助金（インボイス枠）",
    department: "中小企業庁",
    summary:
      "免税事業者からインボイス発行事業者に転換した小規模事業者の販路開拓を支援します。",
    description:
      "小規模事業者持続化補助金のインボイス枠は、2021年9月30日から2023年9月30日の属する課税期間で一度でも免税事業者であった、またはインボイス発行事業者の登録を受けた事業者が対象の特別枠です。インボイス制度への対応に伴う事務負担の増加を克服し、販路開拓に取り組む事業者を手厚く支援します。",
    maxAmount: 100,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-30" },
    url: "https://r3.jizokukahojokin.info/",
    categories: ["HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO"],
    targetIndustries: ["ALL"],
    tags: [
      "販路開拓",
      "インボイス",
      "免税事業者",
      "適格請求書",
      "小規模事業者",
      "持続化",
    ],
    eligibilityCriteria: [
      "免税事業者からインボイス発行事業者に転換した（する予定の）事業者であること",
      "小規模事業者の定義を満たすこと（従業員数の要件）",
      "商工会議所または商工会の管轄地域内で事業を営んでいること",
      "持続的な経営に向けた経営計画を策定していること",
    ],
    excludedCases: [
      "インボイス制度開始前から課税事業者であった者",
      "インボイス発行事業者の登録を行わない者",
      "一般社団法人・医療法人等",
    ],
    requiredDocuments: [
      "経営計画書兼補助事業計画書（様式2・様式3）",
      "事業支援計画書（様式4）※商工会議所が発行",
      "適格請求書発行事業者の登録通知書の写し",
      "直近1期分の確定申告書（法人は決算書）",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要",
        description:
          "事業の沿革、主な商品・サービス、インボイス対応の状況を記載します。",
        group: "様式2",
        estimatedLength: "400〜600字",
      },
      {
        key: "invoice_transition",
        title: "インボイス対応の状況と課題",
        description:
          "インボイス制度への対応状況、それに伴う経営課題を記載します。",
        group: "様式2",
        estimatedLength: "300〜500字",
      },
      {
        key: "sales_expansion_plan",
        title: "販路開拓等の取組内容",
        description:
          "インボイス対応を踏まえた販路開拓の取り組み内容を記載します。",
        group: "様式3",
        estimatedLength: "600〜800字",
      },
      {
        key: "expected_effects",
        title: "補助事業の効果",
        description:
          "補助事業の実施による売上増、新規取引先確保等の効果を記載します。",
        group: "様式3",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "JIZOKUKA",
    popularity: 6,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // ものづくり補助金（グローバル展開型）
  // ============================================================
  {
    id: "monodzukuri-global-001",
    name: "ものづくり・商業・サービス生産性向上促進補助金（グローバル展開型）",
    nameShort: "ものづくり補助金（グローバル展開型）",
    department: "中小企業庁",
    summary:
      "海外事業の拡大・強化等を目的とした設備投資等を行い、国内の生産性向上を図る中小企業を支援します。",
    description:
      "ものづくり補助金のグローバル展開型は、海外直接投資、海外市場開拓（JAPANブランド類型）、インバウンド対応、海外事業者との共同事業のいずれかに取り組む中小企業・小規模事業者の設備投資等を支援します。海外展開を通じた販路開拓と国内の生産性向上を同時に実現する取り組みが対象です。通常の省力化枠よりも補助上限額が高く設定されています。",
    maxAmount: 3000,
    minAmount: null,
    subsidyRate: "1/2（小規模事業者は2/3）",
    deadline: "2026-07-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-07-31" },
    url: "https://portal.monodukuri-hojo.jp/",
    categories: ["HANBAI_KAIKAKU", "SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "SERVICE", "KOURI", "IT", "ALL"],
    tags: [
      "ものづくり",
      "海外展開",
      "グローバル",
      "設備投資",
      "生産性向上",
      "販路開拓",
      "越境EC",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "海外直接投資、海外市場開拓、インバウンド対応、海外事業者との共同事業のいずれかに該当すること",
      "事業計画期間において、付加価値額年率3%以上の増加等を達成する計画を策定すること",
      "給与支給総額を年率平均1.5%以上増加させる計画であること",
      "事業場内最低賃金を地域別最低賃金+30円以上とすること",
    ],
    excludedCases: [
      "大企業の子会社（みなし大企業）",
      "過去3年間に類似補助金の不正受給を行った者",
      "海外展開の具体的計画・実績がない場合",
      "単なる海外旅行と区別がつかない渡航計画",
    ],
    requiredDocuments: [
      "事業計画書（海外展開計画を含む）",
      "決算書（直近2期分）",
      "従業員名簿・賃金台帳",
      "海外展開に関する証憑（見積書、契約書等）",
      "認定支援機関の確認書",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要と海外展開の背景",
        description:
          "事業内容、技術的優位性、海外展開に至る背景を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜800字",
      },
      {
        key: "global_strategy",
        title: "グローバル展開戦略",
        description:
          "ターゲット国・地域、市場分析、参入戦略、販路開拓の計画を記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "investment_plan",
        title: "設備投資・事業実施計画",
        description:
          "導入する設備・システムの内容、スケジュール、費用の内訳を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "productivity_improvement",
        title: "生産性向上と事業効果",
        description:
          "付加価値額の増加見込み、売上目標、雇用・賃金への効果を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "MONODZUKURI",
    popularity: 7,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // IT導入補助金（デジタル化基盤導入枠）
  // ============================================================
  {
    id: "it-donyu-ec-001",
    name: "IT導入補助金（デジタル化基盤導入枠）",
    nameShort: "IT導入補助金（デジタル化基盤導入枠）",
    department: "経済産業省・中小企業庁",
    summary:
      "ECサイト構築やインボイス対応等のデジタル化基盤となるITツール導入を支援します。",
    description:
      "IT導入補助金のデジタル化基盤導入枠は、会計ソフト・受発注ソフト・決済ソフト・ECソフトの導入費用を支援する制度です。インボイス制度への対応やEC販売の開始など、デジタル化基盤の構築に取り組む中小企業・小規模事業者が対象です。ECサイトの構築や改修、オンライン決済システムの導入、受発注システムの電子化など、販路開拓のデジタル化に幅広く活用できます。",
    maxAmount: 350,
    minAmount: null,
    subsidyRate: "3/4以内（一部2/3以内）",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-01", end: "2026-06-30" },
    url: "https://it-shien.smrj.go.jp/",
    categories: ["HANBAI_KAIKAKU", "IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "IT導入",
      "ECサイト",
      "デジタル化",
      "インボイス",
      "オンライン販売",
      "受発注",
      "決済",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者または小規模事業者であること",
      "導入するITツールがIT導入支援事業者が提供する登録済みツールであること",
      "会計・受発注・決済・ECのいずれかの機能を含むITツールを導入すること",
      "gBizIDプライムを取得していること",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "IT導入支援事業者に登録されていないツールの導入",
      "ハードウェアのみの導入（ソフトウェアを伴わない場合）",
      "過去に同一のITツールで本補助金の交付を受けた者",
    ],
    requiredDocuments: [
      "交付申請書（電子申請）",
      "gBizIDプライムのアカウント",
      "直近1期分の確定申告書（法人は決算書）",
      "IT導入支援事業者との契約に関する書類",
      "導入するITツールの見積書",
    ],
    applicationSections: [
      {
        key: "current_issues",
        title: "現状の経営課題",
        description:
          "デジタル化が遅れている業務領域、販路開拓における課題を記載します。",
        group: "交付申請",
        estimatedLength: "400〜600字",
      },
      {
        key: "it_tool_plan",
        title: "導入するITツールと活用計画",
        description:
          "ECサイト構築や販売管理システムなど、導入するITツールの内容と活用方法を記載します。",
        group: "交付申請",
        estimatedLength: "500〜800字",
      },
      {
        key: "expected_effects",
        title: "導入効果と目標",
        description:
          "EC売上目標、業務効率化の数値目標、販路拡大の見込みを記載します。",
        group: "交付申請",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "IT_DONYU",
    popularity: 8,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 地域・企業共生型ビジネス導入・創業促進事業
  // ============================================================
  {
    id: "chiiki-kyousei-001",
    name: "地域・企業共生型ビジネス導入・創業促進事業補助金",
    nameShort: "地域共生型ビジネス補助金",
    department: "経済産業省",
    summary:
      "地域の課題解決と収益性を両立するビジネスモデルの導入・創業に取り組む事業者を支援します。",
    description:
      "地域・企業共生型ビジネス導入・創業促進事業は、地域課題の解決に資するビジネスの導入や創業を支援する制度です。地域の特産品のEC販売、地域ブランドの確立、観光客向けサービスの開発など、地域資源を活用した販路開拓・マーケティングに取り組む中小企業や創業者が対象です。地域との連携を前提としたビジネスモデルの構築を支援します。",
    maxAmount: 1000,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-05-31",
    applicationPeriod: { start: "2026-03-01", end: "2026-05-31" },
    url: "https://www.meti.go.jp/",
    categories: ["HANBAI_KAIKAKU", "CHIIKI_KASSEIKA"],
    targetScale: ["KOBOKIGYO", "CHUSHO", "ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "地域活性化",
      "地域資源",
      "創業",
      "特産品",
      "EC販売",
      "地域ブランド",
      "観光",
    ],
    eligibilityCriteria: [
      "地域課題の解決に資する新たなビジネスモデルを提案できること",
      "地方公共団体や地域の関係団体との連携体制が構築できること",
      "中小企業者、NPO法人、または創業予定者であること",
      "事業の持続可能性・収益性を示す事業計画を策定していること",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "地域との連携体制が不明確な事業",
      "既存事業の単純な拡大（新規性がない場合）",
    ],
    requiredDocuments: [
      "事業計画書（地域課題の分析、ビジネスモデルの説明を含む）",
      "地域連携体制の概要書",
      "決算書（直近1期分）※創業予定者は不要",
      "見積書（経費の内訳）",
    ],
    applicationSections: [
      {
        key: "regional_issues",
        title: "地域課題の分析",
        description:
          "対象地域の課題、市場環境、ビジネスチャンスを記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "business_model",
        title: "ビジネスモデルの概要",
        description:
          "提案するビジネスモデル、販路開拓の戦略、収益構造を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "collaboration_plan",
        title: "地域連携体制",
        description:
          "連携する自治体・団体、役割分担、連携のメリットを記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "sustainability",
        title: "事業の持続可能性と波及効果",
        description:
          "事業の収益見込み、雇用創出効果、地域への波及効果を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業等海外出願・侵害対策支援事業費補助金
  // ============================================================
  {
    id: "kaigai-shutsugan-001",
    name: "中小企業等海外出願・侵害対策支援事業費補助金",
    nameShort: "海外知財支援補助金",
    department: "特許庁・INPIT（工業所有権情報・研修館）",
    summary:
      "中小企業の海外への特許・商標等の出願にかかる費用の一部を補助し、海外展開を支援します。",
    description:
      "海外で事業を展開する際に不可欠な知的財産権の取得を支援する制度です。外国への特許出願、意匠出願、商標出願にかかる費用（現地代理人費用、翻訳費用、出願料等）を補助します。海外での販路開拓を行う際、模倣品対策やブランド保護のために商標権を取得することは極めて重要であり、海外展開型の販路開拓と密接に関連する補助金です。",
    maxAmount: 300,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: "2026-08-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-08-31" },
    url: "https://www.jpo.go.jp/support/chusho/shien_kaigaishutsugan.html",
    categories: ["HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "IT", "SERVICE", "ALL"],
    tags: [
      "海外展開",
      "知的財産",
      "特許",
      "商標",
      "ブランド保護",
      "模倣品対策",
      "海外出願",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "海外への事業展開を計画している、または既に行っていること",
      "外国への特許・意匠・商標の出願を予定していること",
      "都道府県等中小企業支援センター等を通じて応募すること",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "日本国内のみの出願（海外出願を含まない場合）",
      "既に出願済みの費用（遡及適用不可）",
    ],
    requiredDocuments: [
      "応募申請書",
      "海外事業計画書",
      "出願予定の知的財産の概要書",
      "見積書（現地代理人費用、翻訳費用等）",
      "決算書（直近1期分）",
    ],
    applicationSections: [
      {
        key: "overseas_business",
        title: "海外事業の概要と計画",
        description:
          "海外展開の背景、ターゲット市場、販路開拓の計画を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
      },
      {
        key: "ip_strategy",
        title: "知的財産戦略",
        description:
          "出願予定の知的財産の内容、取得の必要性、ブランド保護の計画を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
      },
      {
        key: "expected_effects",
        title: "期待される事業効果",
        description:
          "知的財産権取得による海外売上への効果、ブランド価値向上の見込みを記載します。",
        group: "申請書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業新展開プログラム（販路開拓等支援事業）
  // ============================================================
  {
    id: "shintenkaihi-001",
    name: "中小企業販路開拓助成事業（東京都）",
    nameShort: "東京都販路開拓助成金",
    department: "東京都中小企業振興公社",
    summary:
      "東京都内の中小企業が展示会出展等を通じて販路開拓を行う取り組みに助成します。",
    description:
      "東京都中小企業振興公社が実施する販路開拓助成事業は、都内中小企業の販路開拓を目的とした展示会への出展費用等を助成する制度です。国内外の展示会・見本市への出展小間料、装飾費、輸送費、広告費等が対象です。東京都が実施する各種支援プログラム（経営戦略プログラム等）を受けた企業が対象となり、計画的な販路開拓を後押しします。",
    maxAmount: 150,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-06-15",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-15" },
    url: "https://www.tokyo-kosha.or.jp/",
    categories: ["HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "展示会",
      "見本市",
      "東京都",
      "販路開拓",
      "出展費用",
      "地方自治体",
      "助成金",
    ],
    eligibilityCriteria: [
      "東京都内に主たる事業所を有する中小企業者であること",
      "東京都中小企業振興公社の各種支援プログラムを受けた（受ける予定の）企業であること",
      "展示会等への出展を通じた販路開拓計画を有すること",
      "法人事業税および法人都民税の未納がないこと",
    ],
    excludedCases: [
      "東京都外に本社がある企業",
      "大企業およびみなし大企業",
      "公社の支援プログラムを受けていない企業",
      "同一の展示会で他の公的助成を受けている場合",
    ],
    requiredDocuments: [
      "助成金交付申請書",
      "販路開拓計画書",
      "展示会出展の案内資料・見積書",
      "直近1期分の確定申告書",
      "登記簿謄本（法人の場合）",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要と事業内容",
        description:
          "企業の基本情報、主力製品・サービス、これまでの販売実績を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
      },
      {
        key: "exhibition_plan",
        title: "展示会出展計画",
        description:
          "出展する展示会の情報、出展の目的、ターゲット来場者層を記載します。",
        group: "申請書",
        estimatedLength: "500〜700字",
      },
      {
        key: "sales_strategy",
        title: "販路開拓戦略",
        description:
          "展示会後のフォローアップ計画、新規顧客獲得の目標を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
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
  // 事業再構築補助金（最低賃金枠・販路開拓型）
  // ============================================================
  {
    id: "jigyou-saikouchiku-hanro-001",
    name: "事業再構築補助金（成長枠）",
    nameShort: "事業再構築補助金（成長枠）",
    department: "経済産業省・中小企業庁",
    summary:
      "成長分野への大胆な事業再構築に取り組む中小企業の新市場進出・販路開拓を支援します。",
    description:
      "事業再構築補助金の成長枠は、成長分野への大胆な事業再構築に取り組む中小企業等を支援する制度です。新分野展開、業態転換、事業・業種転換等により新たな販路を開拓する取り組みが対象です。ECサイトの新規構築による販路のデジタル化、新市場への参入、新商品の開発・販売など、抜本的な販路開拓を伴う事業再構築を手厚く支援します。",
    maxAmount: 7000,
    minAmount: 100,
    subsidyRate: "1/2（中小企業）、1/3（中堅企業）",
    deadline: "2026-07-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-07-31" },
    url: "https://jigyou-saikouchiku.go.jp/",
    categories: ["HANBAI_KAIKAKU", "SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "事業再構築",
      "新分野展開",
      "業態転換",
      "販路開拓",
      "成長分野",
      "新市場進出",
      "EC化",
      "DX",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "事業計画について認定経営革新等支援機関の確認を受けていること",
      "付加価値額の年率平均4.0%以上の増加を達成する事業計画を策定していること",
      "取り組む事業が成長分野に該当する、または市場規模が10%以上拡大する業種・業態であること",
      "事業再構築指針に沿った新分野展開、業態転換等に該当すること",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "事業再構築指針の要件を満たさない取り組み",
      "既存事業の単なる拡大・改善にとどまるもの",
      "過去に不正受給を行った者",
    ],
    requiredDocuments: [
      "事業計画書",
      "認定経営革新等支援機関による確認書",
      "決算書（直近2期分）",
      "従業員名簿",
      "市場調査データ等（成長分野該当の根拠資料）",
    ],
    applicationSections: [
      {
        key: "current_business",
        title: "現在の事業概要と課題",
        description:
          "現在の事業内容、市場環境の変化、事業再構築に取り組む背景を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜800字",
      },
      {
        key: "restructuring_plan",
        title: "事業再構築の内容",
        description:
          "新分野展開・業態転換等の具体的内容、新たな販路開拓の計画を記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "market_analysis",
        title: "市場分析と競合優位性",
        description:
          "ターゲット市場の分析、競合状況、自社の競争優位性を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "financial_plan",
        title: "収支計画と事業効果",
        description:
          "売上・利益の見込み、付加価値額の推移、投資対効果を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "JIGYOU_SAIKOUCHIKU",
    popularity: 8,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業デジタル化応援隊事業（EC・マーケティング支援）
  // ============================================================
  {
    id: "ec-marketing-001",
    name: "中小企業デジタル化応援隊事業",
    nameShort: "デジタル化応援隊",
    department: "経済産業省・中小企業庁",
    summary:
      "IT専門家による伴走支援を通じ、中小企業のEC販売やデジタルマーケティングの導入を支援します。",
    description:
      "中小企業デジタル化応援隊事業は、ITに詳しい専門家（IT専門家）を中小企業に派遣し、デジタルツールの導入を支援する制度です。ECサイトの構築・運営支援、SNSマーケティングの導入、Web広告の活用、デジタル販促ツールの選定・導入など、販路開拓のデジタル化に関する伴走型支援が受けられます。専門家への謝金の一部を国が負担するため、低コストで専門的な支援を受けることができます。",
    maxAmount: 30,
    minAmount: null,
    subsidyRate: "時間単価3,500円（差額を企業負担・最低500円/時間）",
    deadline: "2026-09-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-09-30" },
    url: "https://www.digitalization-support.jp/",
    categories: ["HANBAI_KAIKAKU", "IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "デジタル化",
      "IT専門家",
      "ECサイト",
      "SNSマーケティング",
      "Web広告",
      "伴走支援",
      "デジタル販促",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者または小規模事業者であること",
      "デジタル化（EC販売、デジタルマーケティング等）に課題を有していること",
      "IT専門家の支援を受ける意思があること",
      "事業実施後のデジタル活用状況について報告すること",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "IT専門家側が主体となる開発・制作業務（伴走支援ではない場合）",
      "既にIT専門家の業務が完了している案件（遡及適用不可）",
    ],
    requiredDocuments: [
      "支援依頼申請書",
      "企業概要・課題シート",
      "IT専門家との支援計画書",
      "gBizIDプライムのアカウント",
    ],
    applicationSections: [
      {
        key: "current_digital_status",
        title: "デジタル化の現状と課題",
        description:
          "現在のIT活用状況、EC販売・デジタルマーケティングの課題を記載します。",
        group: "申請書",
        estimatedLength: "300〜500字",
      },
      {
        key: "support_plan",
        title: "支援内容と目標",
        description:
          "IT専門家に依頼する支援内容（EC構築、SNS活用等）と達成目標を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
      },
      {
        key: "digital_utilization",
        title: "デジタル活用計画",
        description:
          "支援終了後のデジタルツール活用計画、自走体制の構築方針を記載します。",
        group: "申請書",
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
  // 農商工等連携事業計画に基づく支援（販路開拓型）
  // ============================================================
  {
    id: "noshoko-renke-001",
    name: "農商工等連携支援事業補助金",
    nameShort: "農商工連携補助金",
    department: "経済産業省・農林水産省",
    summary:
      "農林水産業者と中小企業者が連携して行う新商品開発・販路開拓の取り組みを支援します。",
    description:
      "農商工等連携支援事業は、農林漁業者と中小企業者が互いの経営資源を活かして行う新商品・新サービスの開発や販路開拓の取り組みを支援する制度です。農林水産品を活用した加工品の開発・販売、地域食材を使ったメニュー開発、農産物の6次産業化によるEC販売など、農と商工の連携による新たなビジネスモデルの構築を補助します。農商工等連携事業計画の認定を受けることが前提です。",
    maxAmount: 500,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-15", end: "2026-06-30" },
    url: "https://www.chusho.meti.go.jp/keiei/noushoko/",
    categories: ["HANBAI_KAIKAKU", "CHIIKI_KASSEIKA"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "INSHOKU", "KOURI", "ALL"],
    tags: [
      "農商工連携",
      "6次産業化",
      "新商品開発",
      "地域食材",
      "農林水産",
      "販路開拓",
      "加工品",
    ],
    eligibilityCriteria: [
      "中小企業者と農林漁業者の連携体であること",
      "農商工等連携事業計画の認定を受けている（受ける予定の）こと",
      "新商品・新サービスの開発または販路開拓に取り組む計画があること",
      "連携により双方の経営改善が見込まれること",
    ],
    excludedCases: [
      "農商工等連携事業計画の認定を受けていない者",
      "大企業およびみなし大企業",
      "農林漁業者または中小企業者の一方のみでの取り組み（連携なし）",
      "既存商品の単純な仕入れ・販売のみの取り組み",
    ],
    requiredDocuments: [
      "農商工等連携事業計画の認定書の写し",
      "事業実施計画書",
      "連携体の構成員の概要書",
      "決算書（連携体の各構成員分）",
      "新商品・新サービスの開発計画書・見積書",
    ],
    applicationSections: [
      {
        key: "collaboration_overview",
        title: "連携体制の概要",
        description:
          "連携する農林漁業者と中小企業者の概要、連携の背景と狙いを記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "product_development",
        title: "新商品・新サービスの開発計画",
        description:
          "開発する商品・サービスの概要、活用する農林水産資源、差別化ポイントを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "sales_channel_plan",
        title: "販路開拓計画",
        description:
          "ターゲット顧客、販売チャネル（EC、直売、卸等）、プロモーション施策を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "business_impact",
        title: "事業効果と継続性",
        description:
          "売上目標、連携による相乗効果、事業の継続可能性を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },
];
