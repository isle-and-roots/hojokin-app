import type { SubsidyInfo } from "@/types";

/**
 * 地域活性化カテゴリの補助金データ
 * CHIIKI_KASSEIKA - 地域活性化・地方創生・自治体独自支援
 */
export const chiikiKasseikaSubsidies: SubsidyInfo[] = [
  // ============================================================
  // 東京都 創業助成事業
  // ============================================================
  {
    id: "tokyo-sougyou-001",
    name: "東京都 創業助成事業",
    nameShort: "東京都創業助成",
    department: "東京都中小企業振興公社",
    summary:
      "都内で創業を予定している方、または創業後5年未満の中小企業者に対し、創業に要する経費の一部を助成します。",
    description:
      "東京都創業助成事業は、東京都及び公社が実施する創業支援事業の利用者のうち、都内で創業を予定している個人または創業後5年未満の中小企業者等を対象に、創業初期に必要な経費の一部を助成する制度です。賃借料、広告費、器具備品購入費、産業財産権出願・導入費、専門家指導費、従業員人件費等が対象となります。",
    maxAmount: 400,
    minAmount: 100,
    subsidyRate: "2/3",
    deadline: "2026-04-30",
    applicationPeriod: { start: "2026-03-01", end: "2026-04-30" },
    url: "https://startup-station.jp/m2/services/sogyokassei/",
    categories: ["CHIIKI_KASSEIKA", "HANBAI_KAIKAKU", "SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "東京都",
      "創業",
      "起業",
      "スタートアップ",
      "助成金",
      "都内限定",
      "TOKYO",
    ],
    eligibilityCriteria: [
      "都内で創業を具体的に計画している個人、または都内で創業後5年未満の中小企業者等であること",
      "東京都や公社が実施する創業支援事業を利用していること（TOKYO創業ステーション等）",
      "法人の場合は都内に本店登記があること、個人の場合は都内で開業届を提出していること",
      "過去に本助成事業の交付決定を受けていないこと",
    ],
    excludedCases: [
      "東京都外に本店登記がある法人",
      "フランチャイズ加盟による創業の場合",
      "過去に本助成事業の交付決定を受けた者",
      "みなし大企業に該当する者",
    ],
    requiredDocuments: [
      "創業助成事業申請書",
      "事業計画書",
      "創業支援事業利用証明書",
      "開業届の写しまたは履歴事項全部証明書",
      "見積書（対象経費に関するもの）",
      "直近の確定申告書（既に創業している場合）",
    ],
    applicationSections: [
      {
        key: "business_idea",
        title: "ビジネスプラン概要",
        description:
          "創業するビジネスの概要、提供する商品・サービス、ビジネスモデルを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "target_market",
        title: "市場分析とターゲット顧客",
        description:
          "参入する市場の規模、ターゲット顧客、競合状況を分析して記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "marketing_strategy",
        title: "マーケティング・販売戦略",
        description:
          "集客方法、販売チャネル、価格戦略等のマーケティング計画を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "revenue_plan",
        title: "売上計画・資金計画",
        description:
          "月次・年次の売上見込み、必要資金と調達方法、損益計画を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
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
  // 地域・企業共生型ビジネス導入・創業促進事業
  // ============================================================
  {
    id: "chiiki-kyousei-001",
    name: "地域・企業共生型ビジネス導入・創業促進事業",
    nameShort: "地域共生型ビジネス補助金",
    department: "経済産業省",
    summary:
      "地域課題の解決と企業の成長を両立させる共生型ビジネスモデルの導入を支援します。",
    description:
      "地域・企業共生型ビジネス導入・創業促進事業は、地域の社会課題解決と企業の持続的な成長を両立させるビジネスモデルの構築・導入を支援する制度です。地域資源を活用した新事業の立ち上げ、地域課題をビジネスチャンスとして捉えた事業展開、地域と企業が連携した新たな価値創造の取り組み等が対象となります。地方創生やソーシャルビジネスの推進に貢献する事業を広く支援します。",
    maxAmount: 1000,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-08-31",
    applicationPeriod: { start: "2026-05-15", end: "2026-08-31" },
    url: "https://www.meti.go.jp/policy/sme_chiiki/",
    categories: ["CHIIKI_KASSEIKA", "SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "地方創生",
      "地域課題",
      "共生ビジネス",
      "社会課題解決",
      "ソーシャルビジネス",
      "地域資源",
      "連携",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "地域の社会課題解決に資するビジネスモデルであること",
      "地方公共団体や地域の関係機関との連携体制が構築されていること",
      "事業の持続可能性・収益性が見込まれる計画であること",
    ],
    excludedCases: [
      "地域との連携が認められない事業",
      "社会課題解決の要素がない純粋な営利事業",
      "既に事業化済みで新規性がない事業",
      "反社会的勢力に該当する者",
    ],
    requiredDocuments: [
      "事業計画書",
      "地方公共団体等との連携を示す書類（協定書、覚書等）",
      "決算書（直近1期分）",
      "事業実施体制図",
      "経費の見積書",
    ],
    applicationSections: [
      {
        key: "regional_issue",
        title: "地域課題の分析",
        description:
          "取り組む地域課題の現状、背景、影響度を具体的なデータとともに記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "business_model",
        title: "共生型ビジネスモデル",
        description:
          "地域課題の解決と事業収益を両立させるビジネスモデルの具体的な仕組みを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "collaboration_plan",
        title: "地域連携体制",
        description:
          "地方公共団体、地域団体、関係企業等との連携体制と各主体の役割を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "sustainability",
        title: "事業の持続性と波及効果",
        description:
          "補助期間終了後の事業継続計画、地域への波及効果、スケーラビリティを記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "MEDIUM",
    isActive: false,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 大阪府 中小企業新事業展開テイクオフ支援事業
  // ============================================================
  {
    id: "osaka-takeoff-001",
    name: "大阪府 中小企業新事業展開テイクオフ支援事業",
    nameShort: "大阪府テイクオフ補助金",
    department: "大阪府商工労働部（公益財団法人大阪産業局）",
    summary:
      "大阪府内の中小企業が新事業・新分野への展開に取り組む際の経費の一部を補助します。",
    description:
      "大阪府中小企業新事業展開テイクオフ支援事業は、大阪府内に事業所を有する中小企業者が、新たな事業分野への進出や新製品・新サービスの開発・販路開拓等に取り組む際に、その経費の一部を補助する制度です。府内経済の活性化と中小企業の成長を促進することを目的としています。",
    maxAmount: 200,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.pref.osaka.lg.jp/o100050/keieishien/index.html",
    categories: ["CHIIKI_KASSEIKA", "SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "大阪府",
      "新事業",
      "新分野進出",
      "製品開発",
      "販路開拓",
      "大阪産業局",
      "府内限定",
    ],
    eligibilityCriteria: [
      "大阪府内に事業所を有する中小企業者であること",
      "新事業・新分野への展開に取り組む事業計画を有すること",
      "事業の実施期間内に成果が見込まれること",
      "過去に同一事業で本補助金の交付を受けていないこと",
    ],
    excludedCases: [
      "大阪府外のみで事業を実施する場合",
      "既存事業の単純な拡大や維持に留まる場合",
      "みなし大企業に該当する者",
      "反社会的勢力に該当する者",
    ],
    requiredDocuments: [
      "補助金交付申請書",
      "事業計画書（新事業の内容・スケジュール）",
      "経費の見積書",
      "直近の決算書",
      "大阪府内の事業所を確認できる書類",
    ],
    applicationSections: [
      {
        key: "new_business_plan",
        title: "新事業展開計画",
        description:
          "新たに取り組む事業の内容、既存事業との関連性、新規性を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "market_analysis",
        title: "市場・顧客分析",
        description:
          "ターゲット市場の分析、想定顧客、競合状況を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "revenue_effect",
        title: "売上・収益見通し",
        description:
          "新事業による売上見込み、投資回収計画、地域経済への波及効果を記載します。",
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
  // 愛知県 新あいち創造産業立地補助金
  // ============================================================
  {
    id: "aichi-souzou-001",
    name: "新あいち創造産業立地補助金",
    nameShort: "あいち創造産業補助金",
    department: "愛知県経済産業局",
    summary:
      "愛知県内への本社機能移転や研究開発拠点の設置を行う企業に対し、設備投資等の一部を補助します。",
    description:
      "新あいち創造産業立地補助金は、愛知県が産業集積の更なる発展を図るため、県内への企業立地（本社機能移転、研究開発拠点設置、生産拠点の新設・増設等）を促進する制度です。特に先端産業分野（次世代自動車、航空宇宙、ロボット等）への重点支援があり、愛知県のものづくり産業基盤の強化を目指しています。",
    maxAmount: 10000,
    minAmount: null,
    subsidyRate: "投資額の5%〜15%",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.pref.aichi.jp/soshiki/ricchi/",
    categories: ["CHIIKI_KASSEIKA", "SETSUBI_TOUSHI"],
    targetScale: ["CHUSHO", "ALL"],
    targetIndustries: ["SEIZOU", "IT", "ALL"],
    tags: [
      "愛知県",
      "企業立地",
      "本社移転",
      "研究開発拠点",
      "ものづくり",
      "先端産業",
      "産業集積",
    ],
    eligibilityCriteria: [
      "愛知県内に新たに事業所・工場を設置または増設すること",
      "一定規模以上の設備投資を行うこと",
      "地元雇用の創出が見込まれること",
      "事業計画が県の産業振興方針に合致すること",
    ],
    excludedCases: [
      "既存施設の単純な更新・維持に留まる場合",
      "県外への移転を前提とした一時的な立地",
      "風俗営業等の一部業種",
    ],
    requiredDocuments: [
      "立地計画書",
      "設備投資計画書・見積書",
      "雇用計画書",
      "直近の決算書（3期分）",
      "事業所設置に係る契約書（案）",
    ],
    applicationSections: [
      {
        key: "location_plan",
        title: "立地計画",
        description:
          "立地場所、設備内容、投資規模、雇用計画を記載します。",
        group: "立地計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "business_effect",
        title: "事業効果と地域貢献",
        description:
          "立地による事業効果、地元雇用の創出、地域経済への貢献を記載します。",
        group: "立地計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 福岡県 中小企業生産性向上支援補助金
  // ============================================================
  {
    id: "fukuoka-seisansei-001",
    name: "福岡県 中小企業生産性向上支援補助金",
    nameShort: "福岡県生産性向上補助金",
    department: "福岡県商工部（公益財団法人福岡県中小企業振興センター）",
    summary:
      "福岡県内の中小企業がIoT・AI等の先端技術を活用した生産性向上に取り組む経費を補助します。",
    description:
      "福岡県中小企業生産性向上支援補助金は、福岡県内の中小企業がIoT、AI、ロボット等の先端技術を活用し、生産工程の自動化・効率化、業務のデジタル化等の生産性向上に取り組む際の経費の一部を補助する制度です。ものづくり分野のDX推進と県内中小企業の競争力強化を目的としています。",
    maxAmount: 500,
    minAmount: null,
    subsidyRate: "1/2〜2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.joho-fukuoka.or.jp/",
    categories: ["CHIIKI_KASSEIKA", "IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "SERVICE", "ALL"],
    tags: [
      "福岡県",
      "生産性向上",
      "IoT",
      "AI",
      "DX",
      "ものづくり",
      "先端技術",
      "県限定",
    ],
    eligibilityCriteria: [
      "福岡県内に事業所を有する中小企業者であること",
      "IoT・AI・ロボット等を活用した生産性向上の取り組みであること",
      "事業計画に基づく具体的な成果指標を設定していること",
      "補助事業期間内に事業を完了できる計画であること",
    ],
    excludedCases: [
      "福岡県外のみで事業を実施する場合",
      "単なるパソコンやソフトウェアの購入のみの場合",
      "他の補助金と重複して申請する場合",
      "みなし大企業に該当する者",
    ],
    requiredDocuments: [
      "補助金交付申請書",
      "生産性向上計画書",
      "見積書（導入する設備・システムに関するもの）",
      "直近の決算書",
      "福岡県内の事業所を確認できる書類",
    ],
    applicationSections: [
      {
        key: "productivity_plan",
        title: "生産性向上計画",
        description:
          "導入する先端技術の内容、現状の課題、改善目標を記載します。",
        group: "計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "tech_implementation",
        title: "技術導入の詳細",
        description:
          "導入するIoT・AI等の技術仕様、導入スケジュール、期待される効果を記載します。",
        group: "計画書",
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
  // 地方創生推進交付金（地方版総合戦略関連）
  // ============================================================
  {
    id: "chihou-sousei-001",
    name: "地方創生推進交付金",
    nameShort: "地方創生交付金",
    department: "内閣府（まち・ひと・しごと創生本部）",
    summary:
      "地方公共団体が地方版総合戦略に基づいて実施する、自主的・主体的な地方創生の取り組みを支援します。",
    description:
      "地方創生推進交付金は、地方公共団体が策定した地方版総合戦略に位置付けられた事業のうち、地方の自主的・主体的な取り組みで、先導的なものを支援する交付金です。官民協働、地域間連携、政策間連携等の先駆性のある取り組みが対象で、中小企業は地方公共団体と連携して間接的に支援を受けることができます。",
    maxAmount: 50000,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chisou.go.jp/sousei/about/kouhukin/index.html",
    categories: ["CHIIKI_KASSEIKA"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "地方創生",
      "総合戦略",
      "内閣府",
      "官民協働",
      "地域間連携",
      "交付金",
      "まち・ひと・しごと",
    ],
    eligibilityCriteria: [
      "地方公共団体が地方版総合戦略に基づく事業であること",
      "官民協働、地域間連携等の先駆的な要素を含むこと",
      "KPI（重要業績評価指標）を設定し、PDCAサイクルにより検証・改善する仕組みがあること",
      "事業終了後も自走可能な計画であること",
    ],
    excludedCases: [
      "地方版総合戦略に位置付けられていない事業",
      "先駆性・横展開性が認められない事業",
      "単なる施設の建設・改修のみを目的とする事業",
    ],
    requiredDocuments: [
      "地方創生推進交付金実施計画書",
      "地方版総合戦略（該当部分の抜粋）",
      "KPI設定・検証計画書",
      "事業費積算書",
      "官民連携体制を示す書類",
    ],
    applicationSections: [
      {
        key: "regional_strategy",
        title: "地域戦略と事業概要",
        description:
          "地域の課題分析、地方版総合戦略との関連性、事業の概要を記載します。",
        group: "実施計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "innovation_elements",
        title: "先駆的な取り組み要素",
        description:
          "官民協働、地域間連携等の先駆的要素と横展開の可能性を記載します。",
        group: "実施計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "kpi_plan",
        title: "KPI設定とPDCA",
        description:
          "設定するKPI、目標値、検証方法、改善プロセスを記載します。",
        group: "実施計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 商店街活性化・観光消費創出事業
  // ============================================================
  {
    id: "shoutengai-001",
    name: "商店街活性化・観光消費創出事業",
    nameShort: "商店街活性化補助金",
    department: "経済産業省（中小企業庁）",
    summary:
      "商店街が地域と連携してインバウンドや観光需要を取り込むための事業に対して補助します。",
    description:
      "商店街活性化・観光消費創出事業は、商店街組織が地域の行政機関や観光協会等と連携して、インバウンド需要や観光消費の取り込みに資する事業を実施する際に、その経費の一部を補助する制度です。多言語対応、免税対応、観光案内機能の整備、イベント開催等、商店街の魅力向上と集客力強化に資する取り組みが対象です。",
    maxAmount: 2000,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/shogyo/shogyo/index.html",
    categories: ["CHIIKI_KASSEIKA", "HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["KOURI", "INSHOKU", "SERVICE"],
    tags: [
      "商店街",
      "観光",
      "インバウンド",
      "集客",
      "免税",
      "イベント",
      "中小企業庁",
      "多言語対応",
    ],
    eligibilityCriteria: [
      "商店街振興組合、事業協同組合等の商店街組織であること",
      "地域の行政機関や観光協会等との連携体制があること",
      "インバウンドや観光消費の取り込みに資する事業であること",
      "事業完了後も継続的に取り組む体制が整備されていること",
    ],
    excludedCases: [
      "商店街組織以外の個別店舗単独の事業",
      "観光消費との関連性が認められない事業",
      "単なる施設の修繕・維持管理のみの事業",
    ],
    requiredDocuments: [
      "事業計画書",
      "商店街組織の概要・構成員名簿",
      "連携機関との協定書または覚書",
      "経費の見積書",
      "商店街の現状分析資料（来街者数等）",
    ],
    applicationSections: [
      {
        key: "current_analysis",
        title: "商店街の現状分析",
        description:
          "商店街の現状（来街者数、売上推移、課題）を分析して記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "tourism_plan",
        title: "観光消費創出計画",
        description:
          "インバウンド・観光需要の取り込み施策、多言語対応等の計画を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "sustainability_plan",
        title: "継続性確保の計画",
        description:
          "補助事業終了後の自走体制、継続的な集客施策を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜400字",
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
  // 北海道 中小・小規模企業新事業展開・販路拡大支援補助金
  // ============================================================
  {
    id: "hokkaido-hanro-001",
    name: "北海道 中小・小規模企業新事業展開・販路拡大支援補助金",
    nameShort: "北海道販路拡大補助金",
    department: "北海道経済部（公益財団法人北海道中小企業総合支援センター）",
    summary:
      "北海道内の中小企業が行う新事業展開や道外・海外への販路拡大の取り組みを支援します。",
    description:
      "北海道中小・小規模企業新事業展開・販路拡大支援補助金は、北海道内に事業所を有する中小企業・小規模事業者が、新たな事業分野への参入や道外・海外市場への販路拡大に取り組む際の経費を補助する制度です。展示会出展、マーケティング調査、販促物制作、EC構築等の販路開拓に関する幅広い経費が対象です。",
    maxAmount: 200,
    minAmount: null,
    subsidyRate: "1/2〜2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.hsc.or.jp/",
    categories: ["CHIIKI_KASSEIKA", "HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "北海道",
      "販路拡大",
      "新事業",
      "道外販路",
      "海外展開",
      "展示会",
      "EC",
      "地域限定",
    ],
    eligibilityCriteria: [
      "北海道内に事業所を有する中小企業・小規模事業者であること",
      "新事業展開または販路拡大に資する取り組みであること",
      "事業計画の実現可能性が認められること",
      "過去に同一事業で本補助金の交付を受けていないこと",
    ],
    excludedCases: [
      "北海道内のみの販路開拓に留まる場合（一部事業類型）",
      "既存取引先への単純な営業活動",
      "みなし大企業に該当する者",
    ],
    requiredDocuments: [
      "補助金交付申請書",
      "事業計画書",
      "経費の見積書",
      "直近の決算書",
      "北海道内の事業所を確認できる書類",
    ],
    applicationSections: [
      {
        key: "expansion_plan",
        title: "販路拡大・新事業計画",
        description:
          "新たに開拓するマーケットの分析と販路拡大の戦略を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "specific_actions",
        title: "具体的な取り組み内容",
        description:
          "展示会出展、EC構築等の具体的なアクションとスケジュールを記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 過疎地域持続的発展支援交付金
  // ============================================================
  {
    id: "kaso-chiiki-001",
    name: "過疎地域持続的発展支援交付金",
    nameShort: "過疎地域支援交付金",
    department: "総務省",
    summary:
      "過疎地域における地域運営組織の形成、生活支援サービスの維持、移住促進等の取り組みを支援します。",
    description:
      "過疎地域持続的発展支援交付金は、過疎地域の持続的発展の支援に関する特別措置法に基づき、過疎地域の市町村等が行う地域の持続的発展のための取り組みを支援する制度です。地域運営組織の形成・運営、買い物支援・交通支援等の生活サービスの維持、UIJターンの推進、テレワークの推進等が対象となります。",
    maxAmount: 20000,
    minAmount: null,
    subsidyRate: "1/2〜定額",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/ichiran13_01.html",
    categories: ["CHIIKI_KASSEIKA"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "過疎地域",
      "地域運営",
      "生活支援",
      "移住促進",
      "総務省",
      "UIJターン",
      "テレワーク",
      "持続的発展",
    ],
    eligibilityCriteria: [
      "過疎地域に該当する市町村であること（又はその市町村と連携する事業者）",
      "過疎地域持続的発展市町村計画に位置付けられた事業であること",
      "地域の持続的発展に資する先導的な取り組みであること",
      "事業完了後も継続して実施する見込みがあること",
    ],
    excludedCases: [
      "過疎地域に該当しない地域での事業",
      "市町村計画に位置付けられていない事業",
      "一時的なイベントのみで持続性が見込まれない事業",
    ],
    requiredDocuments: [
      "交付金事業計画書",
      "過疎地域持続的発展市町村計画（該当部分）",
      "事業費積算書",
      "事業実施体制図",
      "事業の持続性を示す計画書",
    ],
    applicationSections: [
      {
        key: "regional_challenge",
        title: "地域の課題と背景",
        description:
          "過疎地域の人口動態、生活課題、地域資源の状況を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "sustainability_model",
        title: "持続的発展モデル",
        description:
          "地域の持続的発展に向けた事業モデル、住民参加の仕組みを記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 3,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // まちなか再生支援事業（中心市街地活性化）
  // ============================================================
  {
    id: "machinaka-001",
    name: "まちなか再生支援事業",
    nameShort: "まちなか再生支援",
    department: "経済産業省（中小企業庁）",
    summary:
      "中心市街地の商業機能やにぎわいの回復を図るための民間主導の取り組みを支援します。",
    description:
      "まちなか再生支援事業は、中心市街地活性化法に基づく基本計画の認定を受けた地域等において、商業機能の回復やにぎわいの創出を図るための取り組みを支援する制度です。空き店舗の活用、商業施設のリノベーション、まちづくり会社による事業等が対象で、民間の創意工夫を活かしたまちなか再生を促進します。",
    maxAmount: 3000,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/shogyo/shogyo/machinaka.html",
    categories: ["CHIIKI_KASSEIKA"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["KOURI", "INSHOKU", "SERVICE", "ALL"],
    tags: [
      "中心市街地",
      "まちづくり",
      "空き店舗",
      "リノベーション",
      "にぎわい",
      "中小企業庁",
      "商業活性化",
    ],
    eligibilityCriteria: [
      "中心市街地活性化基本計画の認定地域等であること",
      "商業機能の回復やにぎわい創出に資する事業であること",
      "まちづくり会社、商店街組織等の法人格を有する団体であること",
      "地元の合意形成が得られていること",
    ],
    excludedCases: [
      "中心市街地活性化基本計画の認定地域外の事業",
      "単なる施設の維持管理のみの事業",
      "個別店舗の私的利益のみを目的とする事業",
    ],
    requiredDocuments: [
      "事業計画書",
      "中心市街地活性化基本計画との関連性を示す書類",
      "事業実施体制図",
      "経費の見積書",
      "地元の合意形成を示す書類",
    ],
    applicationSections: [
      {
        key: "area_analysis",
        title: "中心市街地の現状分析",
        description:
          "対象地域の商業環境、来街者数、空き店舗率等の現状を分析して記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "regeneration_plan",
        title: "まちなか再生計画",
        description:
          "にぎわい創出の具体的な施策、空き店舗活用計画、事業スケジュールを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "stakeholder_plan",
        title: "関係者連携・合意形成",
        description:
          "地域の関係者（商店主、住民、行政等）との連携体制と合意形成の状況を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 農商工連携促進支援事業
  // ============================================================
  {
    id: "noushoukou-001",
    name: "農商工連携促進支援事業",
    nameShort: "農商工連携補助金",
    department: "農林水産省・経済産業省",
    summary:
      "農林漁業者と商工業者が連携して新商品・新サービスの開発等に取り組む事業を支援します。",
    description:
      "農商工連携促進支援事業は、農商工等連携促進法に基づき、農林漁業者と中小企業者が有機的に連携し、それぞれの経営資源を有効に活用して行う新商品・新サービスの開発や販路開拓等の取り組みを支援する制度です。6次産業化の推進や地域産品のブランド化を通じて、地域経済の活性化を図ります。",
    maxAmount: 500,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.maff.go.jp/j/shokusan/sanki/nosyoko/",
    categories: ["CHIIKI_KASSEIKA", "HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "KOURI", "INSHOKU", "ALL"],
    tags: [
      "農商工連携",
      "6次産業化",
      "農林水産省",
      "地域産品",
      "新商品開発",
      "ブランド化",
      "農林漁業",
    ],
    eligibilityCriteria: [
      "農林漁業者と中小企業者の連携体であること",
      "農商工等連携事業計画の認定を受けていること（又は認定を目指すこと）",
      "新商品・新サービスの開発や販路開拓に取り組むこと",
      "連携によるシナジー効果が見込まれる事業であること",
    ],
    excludedCases: [
      "農林漁業者又は商工業者のいずれか単独の事業",
      "既存商品の単純な販売促進に留まる場合",
      "連携の実態が認められない場合",
    ],
    requiredDocuments: [
      "農商工等連携事業計画書",
      "連携体の構成員一覧・役割分担表",
      "新商品・新サービスの企画書",
      "経費の見積書",
      "各構成員の決算書",
    ],
    applicationSections: [
      {
        key: "collaboration_concept",
        title: "連携のコンセプト",
        description:
          "農林漁業者と商工業者が連携する意義、各者の経営資源、シナジー効果を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "product_development",
        title: "新商品・新サービスの開発計画",
        description:
          "開発する商品・サービスの内容、新規性、ターゲット顧客を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "sales_channel",
        title: "販路開拓計画",
        description:
          "販売チャネル、マーケティング戦略、売上目標を記載します。",
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
  // 広域連携型まちなかウォーカブル推進事業
  // ============================================================
  {
    id: "walkable-001",
    name: "まちなかウォーカブル推進事業",
    nameShort: "ウォーカブル推進事業",
    department: "国土交通省",
    summary:
      "居心地が良く歩きたくなるまちなかの創出に向けた、官民連携のまちづくりプロジェクトを支援します。",
    description:
      "まちなかウォーカブル推進事業は、「居心地が良く歩きたくなるまちなか」の実現を目指し、公共空間（道路、公園、河川等）と民間空間（建物の低層部、空き地等）を一体的にデザインし、まちなかのにぎわいを創出するための取り組みを支援する制度です。歩行者中心のまちづくり、パブリックスペースの利活用、エリアマネジメントの推進等が対象です。",
    maxAmount: 10000,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mlit.go.jp/toshi/walkable/index.html",
    categories: ["CHIIKI_KASSEIKA"],
    targetScale: ["ALL"],
    targetIndustries: ["KENSETSU", "SERVICE", "ALL"],
    tags: [
      "ウォーカブル",
      "まちづくり",
      "公共空間",
      "国土交通省",
      "エリアマネジメント",
      "歩行者中心",
      "にぎわい創出",
    ],
    eligibilityCriteria: [
      "「居心地が良く歩きたくなるまちなか」づくりに取り組む地方公共団体・民間事業者であること",
      "ウォーカブル推進都市に賛同する自治体と連携していること",
      "官民連携のまちづくり体制が構築されていること",
      "パブリックスペースの利活用を含む計画であること",
    ],
    excludedCases: [
      "ウォーカブル推進都市に賛同していない地域の事業",
      "自動車中心のまちづくりを推進する事業",
      "単なる道路舗装等のインフラ整備のみの事業",
    ],
    requiredDocuments: [
      "事業計画書",
      "まちなかの空間デザイン計画",
      "官民連携体制を示す書類",
      "事業費積算書",
      "地元の合意形成を示す書類",
    ],
    applicationSections: [
      {
        key: "walkable_vision",
        title: "ウォーカブルまちなかのビジョン",
        description:
          "目指すまちなかの姿、歩行者中心の空間デザインの方針を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "public_private_plan",
        title: "官民連携のまちづくり計画",
        description:
          "公共空間と民間空間の一体的な利活用計画、関係者の役割分担を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },
];
