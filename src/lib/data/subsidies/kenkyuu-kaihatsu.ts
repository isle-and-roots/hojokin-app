import type { SubsidyInfo } from "@/types";

/**
 * 研究開発カテゴリの補助金データ
 * KENKYUU_KAIHATSU - 研究開発・技術革新・SBIR・産学連携・特許
 */
export const kenkyuuKaihatsuSubsidies: SubsidyInfo[] = [
  // ============================================================
  // 1. SBIR推進プログラム（中小企業技術革新制度）
  // ============================================================
  {
    id: "sbir-001",
    name: "SBIR推進プログラム（中小企業技術革新制度）",
    nameShort: "SBIR",
    department: "内閣府（各省庁連携）",
    summary:
      "政府が設定した研究開発テーマに対し、中小企業やスタートアップが技術シーズを活用して社会実装を目指す研究開発を支援します。",
    description:
      "SBIR推進プログラムは、科学技術・イノベーション創出の活性化に関する法律に基づき、中小企業やスタートアップによるイノベーション創出を促進するため、政府が設定した研究開発テーマに関する研究開発から事業化までを一貫して支援する制度です。フェーズ1（FS）からフェーズ3（事業化）までの段階的支援が特徴で、各省庁の特定補助金等がSBIR指定されています。",
    maxAmount: 5000,
    minAmount: 100,
    subsidyRate: "2/3〜定額",
    deadline: null,
    applicationPeriod: null,
    url: "https://www8.cao.go.jp/cstp/sbir/",
    categories: ["KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "SBIR",
      "研究開発",
      "技術革新",
      "イノベーション",
      "スタートアップ",
      "社会実装",
      "内閣府",
      "フェーズ支援",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者またはスタートアップであること",
      "政府が提示する研究開発テーマに合致した技術シーズを有すること",
      "研究開発から事業化までの具体的な計画を有すること",
      "過去に同一テーマでの不正受給がないこと",
    ],
    excludedCases: [
      "大企業に該当する者（みなし大企業を含む）",
      "政府提示テーマとの関連性が認められない研究",
      "既に事業化が完了している技術の改良のみを目的とするもの",
    ],
    requiredDocuments: [
      "研究開発計画書",
      "技術シーズの説明資料",
      "事業化計画書",
      "会社概要・研究体制図",
      "直近の決算書",
    ],
    applicationSections: [
      {
        key: "research_theme",
        title: "研究開発テーマと技術シーズ",
        description:
          "取り組む研究開発テーマ、保有する技術シーズ、新規性・優位性を記載します。",
        group: "研究開発計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "research_plan",
        title: "研究開発計画",
        description:
          "研究開発の内容、手法、スケジュール、マイルストーンを記載します。",
        group: "研究開発計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "commercialization",
        title: "事業化計画",
        description:
          "研究成果の社会実装に向けた事業化戦略、市場規模、収益計画を記載します。",
        group: "事業化計画書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 7,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 2. Go-Tech事業（成長型中小企業等研究開発支援事業）
  // ============================================================
  {
    id: "go-tech-001",
    name: "成長型中小企業等研究開発支援事業（Go-Tech事業）",
    nameShort: "Go-Tech事業",
    department: "経済産業省（中小企業庁）",
    summary:
      "中小企業が大学・公設試験研究機関等と連携して行う研究開発や試作品開発、販路開拓等を一貫して支援します。",
    description:
      "Go-Tech事業（旧サポイン事業＝戦略的基盤技術高度化支援事業を発展的に再編）は、中小企業が大学や公設試等と連携して行う研究開発および事業化に向けた取り組みを最大3年間にわたり支援する制度です。ものづくり基盤技術の高度化やサービスの生産性向上に資する革新的な研究開発プロジェクトが対象です。",
    maxAmount: 9750,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/sapoin/index.html",
    categories: ["KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "IT", "ALL"],
    tags: [
      "Go-Tech",
      "サポイン",
      "研究開発",
      "産学連携",
      "ものづくり",
      "基盤技術",
      "中小企業庁",
      "試作品開発",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "大学、公設試験研究機関等との連携体制を構築していること",
      "ものづくり基盤技術またはサービスの高度化に資する研究開発であること",
      "研究開発計画が技術的に実現可能であり、事業化の見通しがあること",
      "認定経営革新等支援機関の確認書を取得していること",
    ],
    excludedCases: [
      "大企業が主体となる研究開発プロジェクト",
      "既存技術の単純な改良に留まるもの",
      "産学連携の体制が構築されていない場合",
      "同一テーマで他の国庫補助金を受給している場合",
    ],
    requiredDocuments: [
      "研究開発計画書",
      "連携機関との共同研究契約書（案）",
      "認定経営革新等支援機関の確認書",
      "直近2期分の決算書",
      "研究開発体制図・実施スケジュール",
    ],
    applicationSections: [
      {
        key: "tech_background",
        title: "技術的背景と課題",
        description:
          "現在の技術水準、解決すべき技術課題、研究の新規性を記載します。",
        group: "研究開発計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "rd_content",
        title: "研究開発の具体的内容",
        description:
          "研究手法、試作・実験計画、各年度の取組内容を詳細に記載します。",
        group: "研究開発計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "collaboration",
        title: "産学連携体制",
        description:
          "連携機関の役割分担、研究資源の共有方法、成果の帰属を記載します。",
        group: "研究開発計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "commercialization_plan",
        title: "事業化・販路開拓計画",
        description:
          "研究成果の事業化シナリオ、ターゲット市場、販路開拓戦略を記載します。",
        group: "事業化計画書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 6,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 3. NEDO 研究開発型スタートアップ支援事業（NEDO STS）
  // ============================================================
  {
    id: "nedo-sts-001",
    name: "NEDO研究開発型スタートアップ支援事業",
    nameShort: "NEDO STS",
    department: "国立研究開発法人新エネルギー・産業技術総合開発機構（NEDO）",
    summary:
      "ディープテック領域の研究開発型スタートアップに対し、事業化に向けた研究開発費を支援します。",
    description:
      "NEDO研究開発型スタートアップ支援事業は、技術シーズの事業化を目指すディープテック分野のスタートアップを対象に、研究開発費の助成やメンタリング等を提供する支援プログラムです。STS（Seed-stage Technology-based Startups）として、シード期からアーリー期のスタートアップの事業化加速を図ります。NEDOの技術的知見やネットワークを活用した伴走支援が特徴です。",
    maxAmount: 7000,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.nedo.go.jp/activities/ZZJP_100197.html",
    categories: ["KENKYUU_KAIHATSU", "SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "NEDO",
      "スタートアップ",
      "ディープテック",
      "研究開発",
      "事業化",
      "シード期",
      "伴走支援",
    ],
    eligibilityCriteria: [
      "日本国内に法人格を有するスタートアップ企業であること",
      "ディープテック領域の技術シーズを有し、事業化を目指していること",
      "設立後おおむね15年以内の企業であること",
      "研究開発を主たる事業として行っていること",
    ],
    excludedCases: [
      "大企業の子会社・関連会社",
      "研究開発の要素がないビジネスモデル",
      "事業化の見通しが立たないもの",
    ],
    requiredDocuments: [
      "研究開発計画書",
      "事業計画書（事業化ロードマップ含む）",
      "会社概要・チーム構成",
      "技術説明資料",
      "資金計画書",
    ],
    applicationSections: [
      {
        key: "tech_innovation",
        title: "技術的イノベーション",
        description:
          "保有する技術シーズの独自性、新規性、技術的優位性を記載します。",
        group: "研究開発計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "rd_roadmap",
        title: "研究開発ロードマップ",
        description:
          "研究開発のマイルストーン、技術目標、実施体制、スケジュールを記載します。",
        group: "研究開発計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "market_impact",
        title: "市場インパクトと事業化戦略",
        description:
          "ターゲット市場の規模、事業化までのパス、競合優位性を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 6,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 4. ものづくり補助金（グローバル展開型）
  // ============================================================
  {
    id: "mono-global-001",
    name: "ものづくり・商業・サービス生産性向上促進補助金（グローバル展開型）",
    nameShort: "ものづくり補助金（グローバル展開型）",
    department: "経済産業省（中小企業庁）",
    summary:
      "海外市場を見据えた製品開発・設備投資を行う中小企業の研究開発・試作活動を支援します。",
    description:
      "ものづくり補助金のグローバル展開型は、海外事業の拡大・強化を目的とした製品・サービスの開発や生産プロセスの改善に必要な設備投資等を支援する枠です。海外直接投資型、海外市場開拓型、インバウンド市場開拓型、海外事業者との共同事業型の4類型があり、それぞれの海外展開戦略に応じた研究開発を支援します。",
    maxAmount: 3000,
    minAmount: null,
    subsidyRate: "1/2〜2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://portal.monodukuri-hojo.jp/",
    categories: ["KENKYUU_KAIHATSU", "SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "SERVICE", "ALL"],
    tags: [
      "ものづくり",
      "グローバル展開",
      "海外市場",
      "製品開発",
      "設備投資",
      "試作",
      "中小企業庁",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者であること",
      "海外事業の拡大・強化を目的とした取り組みであること",
      "事業計画を策定し、認定経営革新等支援機関の確認を受けていること",
      "付加価値額年率3%以上、給与支給総額年率1.5%以上の増加計画であること",
      "事業場内最低賃金が地域別最低賃金＋30円以上であること",
    ],
    excludedCases: [
      "国内市場のみを対象とした事業",
      "単なる設備の更新で新規性がない場合",
      "大企業に該当する者",
      "過去3年間に同一補助金の交付決定を受けた者（一部例外あり）",
    ],
    requiredDocuments: [
      "事業計画書（グローバル展開計画含む）",
      "認定経営革新等支援機関の確認書",
      "決算書（直近2期分）",
      "海外展開に関する証拠書類",
      "賃金台帳・従業員名簿",
    ],
    applicationSections: [
      {
        key: "global_strategy",
        title: "グローバル展開戦略",
        description:
          "海外ターゲット市場の分析、参入戦略、競合状況を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "product_development",
        title: "製品・サービス開発計画",
        description:
          "開発する製品・サービスの内容、技術的新規性、開発スケジュールを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "revenue_projection",
        title: "事業効果と収益見通し",
        description:
          "海外売上目標、付加価値額の増加計画、投資回収計画を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "MONODZUKURI",
    popularity: 7,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 5. 中小企業等特許出願支援事業
  // ============================================================
  {
    id: "patent-support-001",
    name: "中小企業等特許出願支援事業",
    nameShort: "特許出願支援",
    department: "特許庁（経済産業省）",
    summary:
      "中小企業やスタートアップの国内外への特許出願に要する費用の一部を軽減・助成します。",
    description:
      "中小企業等特許出願支援事業は、中小企業やスタートアップが保有する技術やアイデアの知的財産権の取得を促進するため、特許出願に係る費用を軽減する制度です。審査請求料・特許料の減免、海外出願費用の助成（外国出願補助金）等があります。知財戦略の構築を支援し、中小企業の競争力強化を図ります。",
    maxAmount: 150,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.jpo.go.jp/support/chusho/index.html",
    categories: ["KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "特許",
      "知的財産",
      "出願支援",
      "海外出願",
      "特許庁",
      "知財戦略",
      "費用軽減",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者またはスタートアップであること",
      "特許出願を行う具体的な発明・技術を有すること",
      "外国出願の場合、既に日本国特許庁に出願済みであること",
      "都道府県等中小企業支援センターまたはINPITの支援を受けていること",
    ],
    excludedCases: [
      "大企業に該当する者",
      "出願済みの発明に対する重複支援",
      "PCT出願のみで各国移行を予定しない場合（外国出願補助金）",
    ],
    requiredDocuments: [
      "助成金交付申請書",
      "発明の概要を記載した技術説明資料",
      "出願費用の見積書",
      "先行技術調査の結果",
      "事業計画書（知財活用戦略を含む）",
    ],
    applicationSections: [
      {
        key: "invention_overview",
        title: "発明・技術の概要",
        description:
          "出願する発明の内容、技術的な新規性・進歩性を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
      },
      {
        key: "ip_strategy",
        title: "知財戦略",
        description:
          "特許取得後の活用方針、事業との関連性、競合に対する優位性を記載します。",
        group: "申請書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 6. 事業化支援事業（A-STEP）
  // ============================================================
  {
    id: "a-step-001",
    name: "研究成果最適展開支援プログラム（A-STEP）",
    nameShort: "A-STEP",
    department: "国立研究開発法人科学技術振興機構（JST）",
    summary:
      "大学等の研究成果に基づく技術シーズの実用化を目指す産学共同の研究開発を支援します。",
    description:
      "A-STEP（Adaptable and Seamless Technology Transfer Program through Target-driven R&D）は、JSTが実施する産学連携による研究開発支援プログラムです。大学や研究機関の基礎研究成果を実用化に繋げるため、企業と研究機関が共同で行う研究開発に対して資金を支援します。トライアウト（可能性検証）から本格型（実用化開発）まで段階的な支援があります。",
    maxAmount: 30000,
    minAmount: null,
    subsidyRate: "定額（マッチングファンド型あり）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.jst.go.jp/a-step/",
    categories: ["KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO", "ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "JST",
      "A-STEP",
      "産学連携",
      "技術移転",
      "実用化",
      "研究成果",
      "共同研究",
    ],
    eligibilityCriteria: [
      "大学・研究機関の研究成果に基づく技術シーズを活用すること",
      "企業と研究機関が共同で研究開発を実施する体制があること",
      "実用化・事業化に向けた明確な目標と計画を有すること",
      "研究代表者が大学等の研究者であること（企業は共同研究先）",
    ],
    excludedCases: [
      "大学等の研究成果に基づかない純粋な企業単独研究",
      "基礎研究段階にとどまり実用化の見通しがないもの",
      "他の公的資金で既に支援を受けている同一テーマ",
    ],
    requiredDocuments: [
      "研究開発提案書",
      "共同研究契約書（案）",
      "研究者の業績リスト",
      "企業概要・財務情報",
      "知的財産権の取扱いに関する合意書",
    ],
    applicationSections: [
      {
        key: "tech_seed",
        title: "技術シーズと研究背景",
        description:
          "活用する大学等の研究成果、技術的な独自性、先行研究との比較を記載します。",
        group: "提案書",
        estimatedLength: "600〜800字",
      },
      {
        key: "joint_rd_plan",
        title: "共同研究開発計画",
        description:
          "企業と研究機関の役割分担、研究内容、達成目標、スケジュールを記載します。",
        group: "提案書",
        estimatedLength: "800〜1000字",
      },
      {
        key: "practical_application",
        title: "実用化への展望",
        description:
          "実用化までのロードマップ、想定される製品・サービス、市場規模を記載します。",
        group: "提案書",
        estimatedLength: "400〜600字",
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
  // 7. NEDO ムーンショット型研究開発事業（中小企業参画枠）
  // ============================================================
  {
    id: "nedo-moonshot-001",
    name: "ムーンショット型研究開発事業",
    nameShort: "ムーンショット研究開発",
    department: "内閣府・NEDO・JST・AMED",
    summary:
      "2050年までの超長期的な社会課題解決に向けた野心的な研究開発（ムーンショット目標）に取り組む研究プロジェクトを支援します。",
    description:
      "ムーンショット型研究開発事業は、我が国発の破壊的イノベーションの創出を目指し、従来技術の延長にない、より大胆な発想に基づく挑戦的な研究開発を推進する制度です。9つのムーンショット目標が設定されており、中小企業やスタートアップも研究開発チームの一員として参画できます。NEDO、JST、AMEDが各目標を分担して運営しています。",
    maxAmount: 50000,
    minAmount: null,
    subsidyRate: "定額",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.nedo.go.jp/activities/ZZJP_100166.html",
    categories: ["KENKYUU_KAIHATSU"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "ムーンショット",
      "破壊的イノベーション",
      "長期研究",
      "NEDO",
      "JST",
      "2050年目標",
      "先端技術",
    ],
    eligibilityCriteria: [
      "ムーンショット目標に合致する研究開発テーマであること",
      "プロジェクトマネージャー（PM）の公募に応募し採択されること、または既存PMの研究チームに参画すること",
      "革新的な技術アプローチを有すること",
      "国際的な研究競争力を有すること",
    ],
    excludedCases: [
      "既存技術の改良に留まるもの",
      "ムーンショット目標との関連性が認められないもの",
      "研究成果の社会実装への道筋が示せないもの",
    ],
    requiredDocuments: [
      "研究開発構想書",
      "研究計画書（マイルストーン付き）",
      "研究チーム構成表",
      "過去の研究実績リスト",
      "所属機関の承諾書",
    ],
    applicationSections: [
      {
        key: "moonshot_vision",
        title: "ムーンショットビジョン",
        description:
          "2050年に実現を目指す社会像と、そのために取り組む研究テーマを記載します。",
        group: "構想書",
        estimatedLength: "600〜1000字",
      },
      {
        key: "disruptive_approach",
        title: "破壊的アプローチ",
        description:
          "従来技術とは異なる革新的な技術アプローチと、その実現可能性を記載します。",
        group: "構想書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "milestone_plan",
        title: "研究開発マイルストーン",
        description:
          "短期・中期・長期のマイルストーンと、各段階の達成目標を記載します。",
        group: "研究計画書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 8. 中小企業技術革新（SBIRフェーズ3事業化支援）
  // ============================================================
  {
    id: "sbir-phase3-001",
    name: "SBIR推進プログラム フェーズ3事業化支援",
    nameShort: "SBIRフェーズ3",
    department: "内閣府・経済産業省",
    summary:
      "SBIRフェーズ1・2の成果を事業化するための追加支援（事業化促進補助金・政府調達等）を提供します。",
    description:
      "SBIRフェーズ3事業化支援は、SBIRプログラムのフェーズ1（FS）やフェーズ2（研究開発）で得られた成果を実際の事業に結びつけるための支援策です。指定補助金等による事業化資金の補助に加え、政府調達における随意契約の活用（SBIRイノベーション調達）や、官民ファンドとの連携による資金調達支援等が含まれます。",
    maxAmount: 10000,
    minAmount: null,
    subsidyRate: "1/2〜2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www8.cao.go.jp/cstp/sbir/phase3.html",
    categories: ["KENKYUU_KAIHATSU", "SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "SBIR",
      "事業化",
      "フェーズ3",
      "政府調達",
      "イノベーション",
      "資金調達",
      "スケールアップ",
    ],
    eligibilityCriteria: [
      "SBIRプログラムのフェーズ1またはフェーズ2の支援を受けた実績があること",
      "研究開発成果の事業化に向けた具体的な計画を有すること",
      "事業化に必要な資金計画が明確であること",
      "中小企業基本法に定める中小企業者であること",
    ],
    excludedCases: [
      "SBIRプログラムの支援実績がない企業",
      "研究開発成果と関連しない事業計画",
      "事業化の見通しが立たないもの",
    ],
    requiredDocuments: [
      "事業化計画書",
      "SBIRフェーズ1・2の成果報告書",
      "資金計画・収支見通し",
      "市場調査報告書",
      "事業実施体制図",
    ],
    applicationSections: [
      {
        key: "rd_results",
        title: "研究開発成果の概要",
        description:
          "SBIRフェーズ1・2で得られた研究開発成果と技術的到達点を記載します。",
        group: "事業化計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "commercialization_strategy",
        title: "事業化戦略",
        description:
          "研究成果を製品・サービスとして市場投入するまでの戦略と計画を記載します。",
        group: "事業化計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "funding_plan",
        title: "資金計画と成長見通し",
        description:
          "事業化に必要な資金の調達方法、投資計画、収益見通しを記載します。",
        group: "事業化計画書",
        estimatedLength: "400〜600字",
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
  // 9. 戦略的イノベーション創造プログラム（SIP）
  // ============================================================
  {
    id: "sip-001",
    name: "戦略的イノベーション創造プログラム（SIP）",
    nameShort: "SIP",
    department: "内閣府（総合科学技術・イノベーション会議）",
    summary:
      "府省の枠を超えた横断的な研究開発テーマに対し、基礎研究から社会実装までを見据えたプロジェクトを推進します。",
    description:
      "SIP（Cross-ministerial Strategic Innovation Promotion Program）は、内閣府の総合科学技術・イノベーション会議が司令塔機能を発揮し、府省の枠や旧来の分野の枠を超えたマネジメントにより、科学技術イノベーション実現のために創設した制度です。第3期SIPでは、サイバー空間、AI、バイオ、防災等の社会課題解決型テーマが設定されており、中小企業も研究開発チームとして参画可能です。",
    maxAmount: 50000,
    minAmount: null,
    subsidyRate: "定額",
    deadline: null,
    applicationPeriod: null,
    url: "https://www8.cao.go.jp/cstp/gaiyo/sip/index.html",
    categories: ["KENKYUU_KAIHATSU"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "SIP",
      "府省横断",
      "社会実装",
      "イノベーション",
      "内閣府",
      "大型研究",
      "社会課題解決",
    ],
    eligibilityCriteria: [
      "SIPの研究課題に関連する技術力・研究開発能力を有すること",
      "プログラムディレクターの研究チームへの参画が認められること",
      "研究成果の社会実装に向けた意欲と計画を有すること",
      "国内に研究開発拠点を有すること",
    ],
    excludedCases: [
      "SIPの研究課題との関連性が認められないもの",
      "他の大型国家プロジェクトと重複するもの",
      "研究成果の社会実装の意志がないもの",
    ],
    requiredDocuments: [
      "研究開発提案書",
      "研究実績・技術力の証明資料",
      "研究チーム構成・分担表",
      "知的財産戦略書",
      "社会実装計画書",
    ],
    applicationSections: [
      {
        key: "research_proposal",
        title: "研究開発提案の概要",
        description:
          "提案する研究テーマのSIP課題への貢献、技術的アプローチを記載します。",
        group: "提案書",
        estimatedLength: "800〜1000字",
      },
      {
        key: "implementation_vision",
        title: "社会実装に向けたビジョン",
        description:
          "研究成果の社会実装先、想定されるインパクト、実装までのパスを記載します。",
        group: "提案書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 10. 中小企業イノベーション創出推進事業（SBIR Phase2 補助金）
  // ============================================================
  {
    id: "sbir-innovation-001",
    name: "中小企業イノベーション創出推進事業",
    nameShort: "SBIRイノベーション創出",
    department: "経済産業省（中小企業庁）",
    summary:
      "SBIR制度の下、中小企業・スタートアップの革新的な研究開発と初期市場創出を一体的に支援します。",
    description:
      "中小企業イノベーション創出推進事業は、SBIR制度に基づき、中小企業やスタートアップが行う革新的な研究開発（フェーズ2）を支援する補助金です。技術シーズの実用化に向けた本格的な研究開発に対し、最大数千万円〜数億円規模の支援を行います。また、ビジネスメンタリングやデモデイ等の事業化支援も併せて提供されます。",
    maxAmount: 50000,
    minAmount: 500,
    subsidyRate: "2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/sapoin/sbir.html",
    categories: ["KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "SBIR",
      "イノベーション",
      "研究開発",
      "フェーズ2",
      "スタートアップ",
      "メンタリング",
      "中小企業庁",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者またはスタートアップであること",
      "革新的な技術シーズを有し、その実用化に向けた研究開発を計画していること",
      "指定された研究開発テーマに合致すること",
      "事業化に向けた明確な意欲と体制を有すること",
      "過去の研究開発実績（論文・特許等）を有することが望ましい",
    ],
    excludedCases: [
      "大企業およびみなし大企業",
      "指定テーマとの関連性が認められないもの",
      "研究開発の要素がなく、単なる設備導入に留まるもの",
      "同一テーマで重複して公的支援を受けているもの",
    ],
    requiredDocuments: [
      "研究開発計画書",
      "事業化ビジョン",
      "企業概要・チーム構成",
      "財務諸表（直近2期分）",
      "既存の研究成果・知的財産の情報",
    ],
    applicationSections: [
      {
        key: "innovation_theme",
        title: "イノベーションテーマ",
        description:
          "取り組む革新的な研究テーマ、社会的意義、想定される技術的ブレークスルーを記載します。",
        group: "研究開発計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "rd_methodology",
        title: "研究開発方法論",
        description:
          "研究手法、実験計画、検証方法、想定されるリスクと対策を記載します。",
        group: "研究開発計画書",
        estimatedLength: "800〜1000字",
      },
      {
        key: "business_vision",
        title: "事業化ビジョン",
        description:
          "研究成果の製品・サービス化、ターゲット顧客、市場規模、収益モデルを記載します。",
        group: "事業化計画",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 6,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },
];
