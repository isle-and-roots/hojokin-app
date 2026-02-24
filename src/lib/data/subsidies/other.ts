import type { SubsidyInfo } from "@/types";

/**
 * その他カテゴリの補助金データ
 * OTHER - 認定制度・税制優遇・その他支援
 */
export const otherSubsidies: SubsidyInfo[] = [
  // ============================================================
  // 経営力向上計画
  // ============================================================
  {
    id: "keiei-koujo-001",
    name: "経営力向上計画",
    nameShort: "経営力向上計画",
    department: "経済産業省・中小企業庁",
    summary:
      "中小企業等が経営力向上のための取り組みを計画し、認定を受けることで税制優遇等の支援措置を受けられます。",
    description:
      "経営力向上計画は、人材育成、コスト管理等のマネジメントの向上や設備投資など、自社の経営力を向上するための計画を策定し、国の認定を受けることで、税制優遇（固定資産税の軽減、中小企業経営強化税制による即時償却等）、金融支援、法的支援等のさまざまな支援措置を受けられる制度です。補助金とは異なり直接的な資金補助はありませんが、税制面でのメリットが大きい制度です。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/kyoka/",
    categories: ["SETSUBI_TOUSHI", "JINZAI_IKUSEI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "税制優遇",
      "固定資産税",
      "即時償却",
      "経営力向上",
      "認定制度",
      "通年申請",
      "税金",
    ],
    eligibilityCriteria: [
      "中小企業等経営強化法に定める中小企業者等であること",
      "経営力向上に係る取り組みの計画を策定すること",
      "認定経営革新等支援機関の所見を得ること（設備投資の場合は工業会等の証明書）",
    ],
    excludedCases: [
      "大企業に該当する者",
      "経営力向上の取り組み内容が不明確な計画",
      "既に取得済みの設備に対する計画（原則として設備取得前に認定を受ける必要あり）",
    ],
    requiredDocuments: [
      "経営力向上計画に係る認定申請書",
      "経営力向上計画（別紙）",
      "工業会等による証明書（設備投資の場合）",
    ],
    applicationSections: [
      {
        key: "company_info",
        title: "企業の概要",
        description:
          "事業者名、所在地、業種、資本金、従業員数等の基本情報を記載します。",
        group: "認定申請書",
        estimatedLength: "200〜300字",
      },
      {
        key: "enhancement_content",
        title: "経営力向上の内容",
        description:
          "実施する経営力向上の取り組み（設備投資、人材育成等）の具体的内容を記載します。",
        group: "認定申請書",
        estimatedLength: "300〜500字",
      },
      {
        key: "implementation_period",
        title: "計画の実施期間と目標",
        description:
          "経営力向上計画の実施期間（3〜5年）と労働生産性等の目標値を記載します。",
        group: "認定申請書",
        estimatedLength: "200〜300字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 6,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 認定経営革新等支援機関活用事業
  // ============================================================
  {
    id: "nintei-shien-001",
    name: "認定経営革新等支援機関による経営改善支援",
    nameShort: "認定支援機関活用",
    department: "中小企業庁",
    summary:
      "認定経営革新等支援機関（税理士、中小企業診断士等）による経営支援を活用する制度です。",
    description:
      "認定経営革新等支援機関による経営改善支援は、税理士、公認会計士、中小企業診断士、金融機関等のうち、国の認定を受けた専門家（認定経営革新等支援機関）が、中小企業・小規模事業者の経営課題の解決に向けた支援を行う制度です。経営改善計画の策定支援、事業計画の作成支援、補助金申請のサポート等を受けることができます。直接的な補助金ではありませんが、他の補助金申請時に認定支援機関の関与が要件となるケースが多く、まず相談先として活用する重要な公的支援基盤です。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/kakushin/nintei/",
    categories: ["OTHER"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "認定支援機関",
      "経営支援",
      "専門家",
      "経営改善",
      "事業計画",
      "通年対応",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "経営改善・経営革新等に取り組む意欲があること",
      "認定経営革新等支援機関に相談すること",
    ],
    excludedCases: [
      "大企業に該当する者",
      "経営改善の意思がない場合",
    ],
    requiredDocuments: [
      "相談申込書",
      "決算書（直近2期分）",
      "会社概要書",
    ],
    applicationSections: [
      {
        key: "management_issues",
        title: "経営課題の概要",
        description:
          "現在直面している経営課題と支援を受けたい内容を記載します。",
        group: "相談申込書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 7,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // BCP策定支援事業（事業継続力強化計画認定制度）
  // ============================================================
  {
    id: "bcp-001",
    name: "事業継続力強化計画認定制度",
    nameShort: "BCP認定制度",
    department: "中小企業庁",
    summary:
      "中小企業が策定した防災・減災の事業継続力強化計画を経済産業大臣が認定し、各種支援措置を受けられます。",
    description:
      "事業継続力強化計画認定制度は、中小企業が自然災害等のリスクに備えて策定した事業継続力強化計画（簡易版BCP）を経済産業大臣が認定する制度です。認定を受けると、日本政策金融公庫の低利融資、信用保証枠の拡大、防災・減災設備に対する税制優遇（特別償却20%）、補助金申請時の加点等の支援措置を受けることができます。計画の策定は比較的簡易で、中小企業の防災意識向上と事業継続体制の強化を促進します。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—（認定制度）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/antei/bousai/keizokuryoku.htm",
    categories: ["OTHER"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "BCP",
      "事業継続",
      "防災",
      "減災",
      "税制優遇",
      "認定制度",
      "加点要素",
      "通年申請",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "事業継続力強化計画を策定すること",
      "自然災害等のリスクに対する取り組みを記載すること",
      "計画期間は3年間とすること",
    ],
    excludedCases: [
      "大企業に該当する者",
      "計画内容が形式的で実効性がないと判断される場合",
      "認定後に計画の実行に取り組まない場合",
    ],
    requiredDocuments: [
      "事業継続力強化計画認定申請書",
      "事業継続力強化計画（様式に沿って記載）",
      "会社概要（直近の事業報告等）",
    ],
    applicationSections: [
      {
        key: "risk_assessment",
        title: "事業活動に対するリスクの認識",
        description:
          "自然災害等のハザードマップ確認結果と自社への影響を記載します。",
        group: "計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "initial_response",
        title: "初動対応の内容",
        description:
          "災害発生時の従業員の安全確保、情報収集・発信体制を記載します。",
        group: "計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "business_continuity_measures",
        title: "事業継続のための取り組み",
        description:
          "ヒト、モノ、カネ、情報の観点から事前の備えと復旧対策を記載します。",
        group: "計画書",
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
  // 知的財産支援事業（中小企業知的財産活動支援事業費補助金）
  // ============================================================
  {
    id: "chizai-001",
    name: "中小企業等海外侵害対策支援事業（海外知財支援）",
    nameShort: "海外知財支援",
    department: "特許庁・JETRO（日本貿易振興機構）",
    summary:
      "中小企業の海外における知的財産権の取得・侵害対策にかかる費用を支援します。",
    description:
      "中小企業等海外侵害対策支援事業は、海外で事業展開する中小企業が直面する知的財産の課題を支援する制度です。海外での特許・商標・意匠の出願費用の助成（外国出願補助金）、模倣品・海賊版への対策支援（侵害調査・警告状作成等の費用助成）、海外知財訴訟費用の貸付等を行います。JETROの海外事務所を通じた現地対応支援も利用可能です。グローバル展開を目指す中小企業の知的財産戦略を支援します。",
    maxAmount: 300,
    minAmount: null,
    subsidyRate: "1/2〜2/3",
    deadline: "2026-08-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-08-31" },
    url: "https://www.jetro.go.jp/services/ip_service/",
    categories: ["OTHER", "HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "IT", "ALL"],
    tags: [
      "知的財産",
      "特許",
      "商標",
      "海外展開",
      "模倣品対策",
      "JETRO",
      "外国出願",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "海外での事業展開を行っている、または予定していること",
      "知的財産権の取得または侵害対策の必要があること",
      "都道府県等中小企業支援センター等の推薦を受けること（外国出願補助金の場合）",
    ],
    excludedCases: [
      "大企業に該当する者",
      "国内のみの知的財産に関する費用",
      "出願・対策の必要性が認められない場合",
    ],
    requiredDocuments: [
      "交付申請書",
      "出願予定の知的財産の概要書",
      "見積書（弁理士費用、翻訳費用等）",
      "事業計画書（海外展開計画）",
      "支援センター等の推薦書（外国出願の場合）",
    ],
    applicationSections: [
      {
        key: "ip_overview",
        title: "知的財産の概要",
        description:
          "出願・保護を求める知的財産の内容と重要性を記載します。",
        group: "申請書",
        estimatedLength: "300〜500字",
      },
      {
        key: "overseas_strategy",
        title: "海外展開と知財戦略",
        description:
          "海外展開の状況・計画と知的財産権取得の必要性を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
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
  // 小規模企業共済制度
  // ============================================================
  {
    id: "kyousai-001",
    name: "小規模企業共済制度",
    nameShort: "小規模企業共済",
    department: "中小企業基盤整備機構",
    summary:
      "小規模企業の経営者や役員が退職・廃業時に備えて積み立てる退職金制度です。掛金は全額所得控除の対象です。",
    description:
      "小規模企業共済制度は、独立行政法人中小企業基盤整備機構が運営する、小規模企業の経営者・役員のための退職金制度です。月額1,000円〜70,000円の掛金を積み立て、廃業時や退職時に共済金として受け取れます。掛金は全額が「小規模企業共済等掛金控除」として所得控除の対象となり、節税効果が非常に高い制度です。共済金の受取方法は一括・分割・一括と分割の併用が選択可能で、税制上も退職所得扱いまたは公的年金等の雑所得扱いとなります。また、掛金の範囲内で事業資金の貸付制度も利用可能です。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—（共済制度）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.smrj.go.jp/kyosai/skyosai/",
    categories: ["OTHER"],
    targetScale: ["KOBOKIGYO"],
    targetIndustries: ["ALL"],
    tags: [
      "退職金",
      "節税",
      "所得控除",
      "共済",
      "小規模企業",
      "中小機構",
      "通年加入",
    ],
    eligibilityCriteria: [
      "常時使用する従業員が20人以下（商業・サービス業は5人以下）の個人事業主または会社等の役員であること",
      "加入後、掛金を継続して納付すること",
    ],
    excludedCases: [
      "従業員数が基準を超える事業者",
      "法人の従業員（役員以外）",
      "サラリーマン（給与所得者）として勤務する者",
    ],
    requiredDocuments: [
      "加入申込書",
      "確定申告書の写し（個人事業主の場合）",
      "登記事項証明書（法人の役員の場合）",
    ],
    applicationSections: [
      {
        key: "applicant_info",
        title: "加入者情報",
        description:
          "事業の概要、従業員数、加入者の役職等の基本情報を記載します。",
        group: "加入申込書",
        estimatedLength: "200〜300字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 8,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // セーフティネット保証制度
  // ============================================================
  {
    id: "safety-net-001",
    name: "セーフティネット保証制度",
    nameShort: "セーフティネット保証",
    department: "中小企業庁・各市区町村",
    summary:
      "経営の安定に支障が生じている中小企業に対し、信用保証協会の保証枠を別枠で追加する制度です。",
    description:
      "セーフティネット保証制度は、取引先の倒産、自然災害、感染症の影響等により経営の安定に支障が生じている中小企業者に対し、信用保証協会が通常の保証限度額とは別枠で保証を行う制度です。1号から8号まであり、それぞれ認定要件が異なります。市区町村長の認定を受けた上で、金融機関を通じて信用保証協会に保証申込を行います。中小企業が融資を受けやすくするためのセーフティネットとして重要な役割を果たしています。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—（信用保証制度）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/kinyu/sefu_net_gaiyou.htm",
    categories: ["OTHER"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "セーフティネット",
      "信用保証",
      "資金繰り",
      "融資",
      "経営安定",
      "災害",
      "通年対応",
    ],
    eligibilityCriteria: [
      "中小企業信用保険法に定める中小企業者であること",
      "経営の安定に支障が生じていること（売上減少等の認定要件を満たすこと）",
      "事業所の所在地の市区町村長の認定を受けること",
      "保証付融資を利用して事業の継続・安定化を図ること",
    ],
    excludedCases: [
      "認定要件（売上減少率等）を満たさない場合",
      "既に保証限度額に達している場合（追加保証は不可の場合あり）",
      "反社会的勢力に該当する者",
    ],
    requiredDocuments: [
      "セーフティネット保証認定申請書",
      "売上高等の減少を示す書類（試算表、売上台帳等）",
      "確定申告書・決算書の写し",
      "許認可証の写し（許認可業種の場合）",
    ],
    applicationSections: [
      {
        key: "business_impact",
        title: "経営への影響",
        description:
          "売上減少の状況、経営への影響、認定要件に該当する根拠を記載します。",
        group: "認定申請書",
        estimatedLength: "300〜500字",
      },
      {
        key: "fund_usage_plan",
        title: "資金使途計画",
        description:
          "融資を受けた場合の資金使途と事業安定化の見通しを記載します。",
        group: "認定申請書",
        estimatedLength: "300〜400字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 7,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },
];
