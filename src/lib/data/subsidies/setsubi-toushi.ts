import type { SubsidyInfo } from "@/types";

/**
 * 設備投資カテゴリの補助金データ
 * SETSUBI_TOUSHI - 設備投資・機械装置・生産性向上
 */
export const setsubiToushiSubsidies: SubsidyInfo[] = [
  // ============================================================
  // ものづくり・商業・サービス生産性向上促進補助金
  // ============================================================
  {
    id: "monodzukuri-001",
    name: "ものづくり・商業・サービス生産性向上促進補助金",
    nameShort: "ものづくり補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "中小企業・小規模事業者が革新的サービスの開発や試作品開発、生産プロセスの改善を行う設備投資等を支援します。",
    description:
      "ものづくり補助金は、中小企業・小規模事業者等が取り組む革新的サービス開発・試作品開発・生産プロセスの改善を行うための設備投資等を支援する制度です。通常枠のほか、デジタル枠、グリーン枠、グローバル市場開拓枠などの特別枠が設けられています。付加価値額年率3%以上、給与支給総額年率1.5%以上の増加が求められます。",
    maxAmount: 1250,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: "2026-08-29",
    applicationPeriod: { start: "2026-06-01", end: "2026-08-29" },
    url: "https://portal.monodukuri-hojo.jp/",
    categories: ["SETSUBI_TOUSHI", "KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "SERVICE", "ALL"],
    tags: [
      "設備投資",
      "試作品開発",
      "生産性向上",
      "革新的サービス",
      "ものづくり",
      "機械装置",
      "DX",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "事業計画期間において、給与支給総額を年率平均1.5%以上増加させること",
      "事業計画期間において、事業場内最低賃金を地域別最低賃金＋30円以上とすること",
      "事業計画期間において、付加価値額を年率平均3%以上増加させること",
    ],
    excludedCases: [
      "みなし大企業に該当する者",
      "過去3年間に類似の補助金の交付を2回以上受けている者",
      "公序良俗に反する事業を行う者",
      "10か月以内に事業を完了できない事業計画",
    ],
    requiredDocuments: [
      "事業計画書（10ページ以内）",
      "賃金引上げ計画の誓約書",
      "決算書（直近2期分）",
      "従業員名簿および賃金台帳",
      "導入設備の見積書（相見積もり含む）",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業の概要",
        description:
          "事業内容、技術力、主要製品・サービス、主要取引先、組織体制等を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "innovation_content",
        title: "革新的な取組の内容",
        description:
          "開発する製品・サービスの革新性、既存技術との違い、技術的な課題と解決方法を記載します。",
        group: "事業計画書",
        estimatedLength: "1000〜1500字",
      },
      {
        key: "implementation_plan",
        title: "実施体制とスケジュール",
        description:
          "事業の実施体制（人員配置、外部連携等）、スケジュール、各工程の詳細を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "productivity_improvement",
        title: "生産性向上の具体的方策",
        description:
          "設備投資による生産性向上の仕組み、数値目標、効果測定方法を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "financial_projection",
        title: "将来の事業計画と数値目標",
        description:
          "付加価値額、給与支給総額等のKPI数値計画を3〜5年分記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "MONODZUKURI",
    popularity: 9,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 東京都 躍進的な事業推進のための設備投資支援事業
  // ============================================================
  {
    id: "tokyo-setsubi-001",
    name: "東京都 躍進的な事業推進のための設備投資支援事業",
    nameShort: "東京都設備投資支援",
    department: "東京都中小企業振興公社",
    summary:
      "都内中小企業者が競争力強化・DX推進・イノベーション創出のために行う設備投資を支援します。",
    description:
      "東京都の躍進的な事業推進のための設備投資支援事業は、都内中小企業者が更なる発展に向けて、競争力強化、DX推進、イノベーション創出等に必要な設備導入を行う際の経費の一部を助成する大型の支援制度です。機械設備やソフトウェアの購入・リース費用が対象となり、最大1億円までの大規模な設備投資をサポートします。",
    maxAmount: 10000,
    minAmount: 300,
    subsidyRate: "1/2",
    deadline: "2026-05-31",
    applicationPeriod: { start: "2026-03-15", end: "2026-05-31" },
    url: "https://www.tokyo-kosha.or.jp/support/josei/setsubitoshi/",
    categories: ["SETSUBI_TOUSHI", "IT_DIGITAL"],
    targetScale: ["CHUSHO"],
    targetIndustries: ["SEIZOU", "SERVICE", "IT", "ALL"],
    tags: [
      "東京都",
      "設備投資",
      "DX",
      "大型助成",
      "機械装置",
      "ソフトウェア",
      "競争力強化",
    ],
    eligibilityCriteria: [
      "東京都内に本店登記がある中小企業者であること",
      "東京都内に主たる事業所を有し、2年以上事業を継続していること",
      "直近決算期の売上高が前期以上、または付加価値額が前期以上であること",
      "令和7年4月1日時点で都税の未納がないこと",
      "過去に本事業の助成を受けた場合、助成事業の完了から1年以上経過していること",
    ],
    excludedCases: [
      "都外に本店登記がある企業",
      "みなし大企業に該当する者",
      "事業開始から2年未満の企業",
      "連続する2期分の決算書を提出できない者",
    ],
    requiredDocuments: [
      "助成事業申請書",
      "事業計画書",
      "決算書（直近2期分）",
      "履歴事項全部証明書",
      "都税の納税証明書",
      "設備の見積書および仕様書",
    ],
    applicationSections: [
      {
        key: "company_strength",
        title: "自社の強みと事業環境",
        description:
          "自社の事業概要、強み、事業環境の変化と課題を分析して記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "investment_plan",
        title: "設備投資の内容と目的",
        description:
          "導入する設備の仕様、選定理由、投資目的（競争力強化・DX推進等）を詳細に記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "implementation_schedule",
        title: "実施スケジュールと体制",
        description:
          "設備導入から稼働までのスケジュール、運用体制、教育訓練計画を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "business_impact",
        title: "投資効果と成長戦略",
        description:
          "設備投資による生産性向上、売上拡大等の定量的効果と中長期的な成長戦略を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 事業再構築補助金
  // ============================================================
  {
    id: "saikouchiku-001",
    name: "事業再構築補助金",
    nameShort: "事業再構築補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "ポストコロナ時代の経済社会の変化に対応するため、新分野展開・業態転換等の事業再構築に必要な設備投資を支援します。",
    description:
      "事業再構築補助金は、新市場進出（新分野展開・業態転換）、事業転換、業種転換、事業再編又はこれらの取組を通じた規模の拡大等の事業再構築に意欲を有する中小企業等の挑戦を支援する制度です。成長枠、グリーン成長枠、産業構造転換枠、サプライチェーン強靱化枠等の類型があり、建物費・機械装置費・システム構築費等が補助対象です。",
    maxAmount: 7000,
    minAmount: 100,
    subsidyRate: "2/3",
    deadline: "2026-07-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-07-31" },
    url: "https://jigyou-saikouchiku.go.jp/",
    categories: ["SETSUBI_TOUSHI", "SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "事業再構築",
      "新分野展開",
      "業態転換",
      "設備投資",
      "建物費",
      "機械装置",
      "大型補助金",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "事業計画を認定経営革新等支援機関と策定すること",
      "補助事業終了後3〜5年で付加価値額の年率平均3.0〜5.0%以上増加する事業計画を策定すること",
      "事業再構築指針に示す「事業再構築」の定義に合致する事業であること",
    ],
    excludedCases: [
      "みなし大企業に該当する者",
      "事業再構築の定義に該当しない既存事業の単なる設備更新",
      "他の国庫補助金との重複受給",
      "GビズIDプライムを取得していない者",
    ],
    requiredDocuments: [
      "事業計画書（15ページ以内）",
      "認定経営革新等支援機関の確認書",
      "決算書（直近2期分）",
      "従業員数を確認できる書類",
      "設備・建物等の見積書",
    ],
    applicationSections: [
      {
        key: "current_situation",
        title: "現在の事業の状況",
        description:
          "現在の事業内容、売上構成、経営課題、事業環境の変化について記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1000字",
      },
      {
        key: "restructuring_plan",
        title: "事業再構築の具体的内容",
        description:
          "新分野展開・業態転換等の内容、市場分析、競合との差別化ポイントを記載します。",
        group: "事業計画書",
        estimatedLength: "1000〜1500字",
      },
      {
        key: "investment_detail",
        title: "投資計画と資金調達",
        description:
          "必要な設備投資の内容、金額、資金調達計画を詳細に記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "revenue_plan",
        title: "収益計画と付加価値向上",
        description:
          "売上・利益計画、付加価値額の推移予測、KPIの設定を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
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
  // 先端設備等導入計画に基づく固定資産税特例措置
  // ============================================================
  {
    id: "sentan-setsubi-001",
    name: "先端設備等導入計画に基づく固定資産税特例措置",
    nameShort: "先端設備等導入計画",
    department: "経済産業省・中小企業庁（市区町村が認定）",
    summary:
      "中小企業が先端設備等導入計画の認定を受けることで、新規取得した設備の固定資産税が最大3年間ゼロになる税制優遇措置です。",
    description:
      "先端設備等導入計画は、中小企業等経営強化法に基づき、市区町村が中小企業の設備投資を支援する制度です。認定を受けた計画に基づき取得した設備について、固定資産税が最大3年間ゼロ（賃上げ方針を計画に位置付けた場合）となります。補助金との併用が可能で、ものづくり補助金等の加点要件にもなるため、設備投資時には必ず検討すべき制度です。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "固定資産税3年間ゼロ",
    deadline: "2026-12-31",
    applicationPeriod: { start: "2026-01-01", end: "2026-12-31" },
    url: "https://www.chusho.meti.go.jp/keiei/seisansei/index.html",
    categories: ["SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "固定資産税",
      "税制優遇",
      "先端設備",
      "設備投資",
      "生産性向上",
      "市区町村認定",
      "賃上げ",
    ],
    eligibilityCriteria: [
      "中小企業等経営強化法に定める中小企業者であること",
      "市区町村が策定した導入促進基本計画に合致する計画であること",
      "設備投資により労働生産性が年率3%以上向上する計画であること",
      "先端設備等の取得前に市区町村の認定を受けること",
      "賃上げ方針を計画に位置付けること（固定資産税ゼロの場合）",
    ],
    excludedCases: [
      "設備取得後に認定申請を行った場合",
      "市区町村が導入促進基本計画を策定していない地域",
      "中古設備の取得",
      "リース契約による設備導入（一部例外あり）",
    ],
    requiredDocuments: [
      "先端設備等導入計画に係る認定申請書",
      "認定経営革新等支援機関の事前確認書",
      "設備の見積書・仕様書",
      "誓約書（賃上げ方針の位置付け）",
    ],
    applicationSections: [
      {
        key: "company_info",
        title: "企業概要と現状の課題",
        description:
          "事業内容、現在の設備状況、生産性に関する課題を記載します。",
        group: "導入計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "equipment_plan",
        title: "導入する先端設備等の内容",
        description:
          "導入する設備の名称・型番・機能、選定理由を記載します。",
        group: "導入計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "productivity_target",
        title: "労働生産性の向上目標",
        description:
          "設備導入前後の労働生産性の数値比較、年率3%以上の向上根拠を記載します。",
        group: "導入計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 8,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 小規模事業者持続化補助金（設備導入関連）
  // ============================================================
  {
    id: "jizokuka-setsubi-001",
    name: "小規模事業者持続化補助金",
    nameShort: "持続化補助金",
    department: "経済産業省・日本商工会議所",
    summary:
      "小規模事業者が販路開拓や業務効率化のために行う機械装置導入等の取り組みを最大250万円まで支援します。",
    description:
      "小規模事業者持続化補助金は、持続的な経営に向けた経営計画に基づく小規模事業者の販路開拓や業務効率化の取り組みを支援する制度です。通常枠（上限50万円）のほか、賃金引上げ枠・卒業枠・後継者支援枠・創業枠（各上限200万円）、インボイス特例（+50万円）があります。機械装置等費、広報費、ウェブサイト関連費等が対象経費です。",
    maxAmount: 250,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-30" },
    url: "https://s23.jizokukahojokin.info/",
    categories: ["SETSUBI_TOUSHI", "HANBAI_KAIKAKU"],
    targetScale: ["KOBOKIGYO"],
    targetIndustries: ["ALL"],
    tags: [
      "小規模事業者",
      "持続化補助金",
      "販路開拓",
      "機械装置",
      "業務効率化",
      "商工会議所",
      "インボイス",
    ],
    eligibilityCriteria: [
      "商業・サービス業は常時使用する従業員5人以下、製造業等は20人以下の小規模事業者であること",
      "商工会議所または商工会の管轄地域で事業を営んでいること",
      "開業届出済みの個人事業主、または法人であること",
      "直近過去3年分の各年の課税所得の年平均額が15億円を超えていないこと",
    ],
    excludedCases: [
      "商工会議所・商工会の会員でなくても申請可能だが、事業支援計画書の発行が必要",
      "フランチャイズチェーン本部から事業活動について指示を受けている者",
      "過去に本補助金の採択を受けた者は受付締切日の前10か月以内に事業が完了していないと不可",
    ],
    requiredDocuments: [
      "経営計画書（様式2）",
      "補助事業計画書（様式3）",
      "事業支援計画書（様式4）※商工会議所発行",
      "直近の確定申告書（個人）または決算書（法人）",
      "見積書（機械装置等を購入する場合）",
    ],
    applicationSections: [
      {
        key: "company_overview",
        title: "企業概要",
        description:
          "事業内容、沿革、主な商品・サービス、組織体制を記載します。",
        group: "経営計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "market_analysis",
        title: "顧客ニーズと市場の動向",
        description:
          "ターゲット顧客、市場環境、競合状況を分析して記載します。",
        group: "経営計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "business_plan",
        title: "経営方針・目標と今後のプラン",
        description:
          "経営方針、目標、具体的なアクションプランを記載します。",
        group: "経営計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "subsidy_project",
        title: "補助事業の内容",
        description:
          "補助事業で実施する具体的な取り組み内容と設備投資計画を記載します。",
        group: "補助事業計画書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "JIZOKUKA",
    popularity: 9,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中小企業経営強化税制（即時償却・税額控除）
  // ============================================================
  {
    id: "keiei-kyouka-zeisei-001",
    name: "中小企業経営強化税制",
    nameShort: "経営強化税制",
    department: "経済産業省・国税庁",
    summary:
      "経営力向上計画の認定を受けた中小企業が、設備投資について即時償却または最大10%の税額控除を受けられる税制優遇です。",
    description:
      "中小企業経営強化税制は、中小企業等経営強化法の認定を受けた「経営力向上計画」に基づく設備投資について、即時償却又は取得価額の10%の税額控除（資本金3,000万円超は7%）が選択適用できる制度です。A類型（生産性向上設備）、B類型（収益力強化設備）、C類型（デジタル化設備）、D類型（経営資源集約化設備）の4類型があります。",
    maxAmount: null,
    minAmount: 160,
    subsidyRate: "即時償却 or 税額控除10%",
    deadline: "2027-03-31",
    applicationPeriod: { start: "2026-01-01", end: "2027-03-31" },
    url: "https://www.chusho.meti.go.jp/keiei/kyoka/",
    categories: ["SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "税制優遇",
      "即時償却",
      "税額控除",
      "経営力向上計画",
      "設備投資",
      "生産性向上",
      "DX設備",
      "節税",
    ],
    eligibilityCriteria: [
      "中小企業等経営強化法に定める中小企業者等であること",
      "経営力向上計画の認定を受けていること",
      "認定計画に基づき対象設備を新規取得すること",
      "設備の取得日から60日以内に経営力向上計画の申請を行うこと（事後申請の場合）",
    ],
    excludedCases: [
      "中古設備の取得",
      "リース取引（所有権移転外ファイナンスリースは税額控除のみ適用可）",
      "資本金1億円超の法人",
      "設備取得後に経営力向上計画が不認定となった場合",
    ],
    requiredDocuments: [
      "経営力向上計画に係る認定申請書",
      "設備投資の内容を記載した別表",
      "工業会等の証明書（A類型の場合）または投資計画（B類型の場合）",
      "設備の見積書・カタログ",
    ],
    applicationSections: [
      {
        key: "business_overview",
        title: "事業の概要と経営課題",
        description:
          "事業内容、経営環境の分析、解決すべき経営課題を記載します。",
        group: "経営力向上計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "strengthening_plan",
        title: "経営力向上の内容",
        description:
          "経営力を向上させるための具体的な取り組みと設備投資の関連を記載します。",
        group: "経営力向上計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "equipment_detail",
        title: "導入設備の詳細",
        description:
          "導入する設備の仕様、類型（A/B/C/D）、投資効果の数値根拠を記載します。",
        group: "経営力向上計画",
        estimatedLength: "400〜600字",
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
  // 省力化投資補助金（カタログ型）
  // ============================================================
  {
    id: "shoryokuka-001",
    name: "中小企業省力化投資補助金",
    nameShort: "省力化投資補助金",
    department: "経済産業省・中小企業庁",
    summary:
      "人手不足に悩む中小企業がカタログに掲載されたIoT・ロボット等の汎用製品を導入する費用を補助します。",
    description:
      "中小企業省力化投資補助金は、人手不足の状態にある中小企業等が、省力化製品のカタログから選択したIoT・ロボット等の汎用製品を導入し、付加価値額や生産性の向上を図ることを目的とした補助金です。カタログ型であるため、事前登録された製品の中から選択して申請する簡便な手続きが特徴です。従業員規模に応じて補助上限額が異なります。",
    maxAmount: 1500,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: "2026-09-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-09-30" },
    url: "https://shoryokuka.smrj.go.jp/",
    categories: ["SETSUBI_TOUSHI", "IT_DIGITAL"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "省力化",
      "人手不足",
      "IoT",
      "ロボット",
      "カタログ型",
      "自動化",
      "設備投資",
      "生産性向上",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "人手不足の状態にあることを示す書類を提出できること",
      "補助事業終了後3年間で付加価値額を年率平均3%以上増加させる事業計画を策定すること",
      "賃金引上げの要件（事業場内最低賃金を地域別最低賃金+30円以上）を満たすこと",
      "カタログに登録された製品から選択して導入すること",
    ],
    excludedCases: [
      "みなし大企業に該当する者",
      "カタログに未掲載の製品の導入",
      "過去3年間に同一製品カテゴリで本補助金を受給した者",
    ],
    requiredDocuments: [
      "交付申請書",
      "人手不足を証明する書類（求人票、離職率データ等）",
      "労働生産性向上の計画書",
      "導入製品の見積書",
      "決算書（直近1期分）",
    ],
    applicationSections: [
      {
        key: "labor_shortage",
        title: "人手不足の現状と課題",
        description:
          "自社の人手不足の具体的状況、業務への影響、これまでの対策を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
      },
      {
        key: "product_selection",
        title: "導入製品の選定理由",
        description:
          "カタログから選定した製品の概要、選定理由、業務改善の見込みを記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
      },
      {
        key: "effect_plan",
        title: "導入効果と生産性向上計画",
        description:
          "省力化による定量的効果、付加価値額の向上見込み、賃上げ計画を記載します。",
        group: "申請書",
        estimatedLength: "400〜600字",
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
  // 業務改善助成金
  // ============================================================
  {
    id: "gyoumu-kaizen-001",
    name: "業務改善助成金",
    nameShort: "業務改善助成金",
    department: "厚生労働省",
    summary:
      "事業場内の最低賃金を引き上げるとともに、生産性向上のための設備投資を行う中小企業に助成金を支給します。",
    description:
      "業務改善助成金は、事業場内最低賃金と地域別最低賃金の差額が50円以内の事業場を対象に、最低賃金の引上げと設備投資（機械設備、コンサルティング等）を同時に行う場合に、その費用の一部を助成する制度です。引き上げる賃金額と引上げ対象労働者数によって助成上限額が異なり、最大600万円が支給されます。賃金引上げが必須要件です。",
    maxAmount: 600,
    minAmount: null,
    subsidyRate: "3/4（事業場内最低賃金900円未満）〜4/5",
    deadline: "2026-12-31",
    applicationPeriod: { start: "2026-01-01", end: "2026-12-31" },
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/03.html",
    categories: ["SETSUBI_TOUSHI", "JINZAI_IKUSEI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "最低賃金",
      "賃上げ",
      "設備投資",
      "業務改善",
      "厚生労働省",
      "生産性向上",
      "助成金",
    ],
    eligibilityCriteria: [
      "中小企業・小規模事業者であること",
      "事業場内最低賃金と地域別最低賃金の差額が50円以内であること",
      "事業場内最低賃金を一定額以上引き上げる計画があること",
      "引き上げ後の賃金を6か月以上継続して支払うこと",
      "解雇、賃金引下げなどの不交付事由がないこと",
    ],
    excludedCases: [
      "事業場内最低賃金と地域別最低賃金の差額が50円を超える事業場",
      "過去に賃金引下げ等の不交付事由に該当した事業者",
      "国または地方公共団体",
    ],
    requiredDocuments: [
      "交付申請書",
      "事業実施計画書",
      "賃金台帳の写し（最低賃金確認用）",
      "設備投資の見積書・カタログ",
      "事業場の概要がわかる書類",
    ],
    applicationSections: [
      {
        key: "wage_situation",
        title: "現在の賃金状況と引上げ計画",
        description:
          "事業場内最低賃金の現状、引上げ額、対象労働者数を記載します。",
        group: "実施計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "improvement_plan",
        title: "業務改善・設備投資計画",
        description:
          "生産性向上のための設備投資内容、業務改善の具体策を記載します。",
        group: "実施計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "expected_effect",
        title: "期待される効果",
        description:
          "賃上げの維持可能性、設備投資による生産性向上の見込みを記載します。",
        group: "実施計画書",
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
  // 中小企業投資促進税制
  // ============================================================
  {
    id: "toushi-sokushin-001",
    name: "中小企業投資促進税制",
    nameShort: "投資促進税制",
    department: "経済産業省・国税庁",
    summary:
      "中小企業が機械装置等の対象設備を取得した場合に、30%の特別償却または7%の税額控除が受けられる税制措置です。",
    description:
      "中小企業投資促進税制は、青色申告を行う中小企業者が機械装置（1台160万円以上）、測定・検査工具（1台120万円以上）、一定のソフトウェア（70万円以上）等の対象設備を取得して事業に使用した場合に、取得価額の30%の特別償却、又は7%の税額控除（資本金3,000万円以下の法人・個人のみ）を選択適用できる制度です。経営力向上計画の認定は不要で、手続きが簡便です。",
    maxAmount: null,
    minAmount: 160,
    subsidyRate: "特別償却30% or 税額控除7%",
    deadline: "2027-03-31",
    applicationPeriod: { start: "2026-01-01", end: "2027-03-31" },
    url: "https://www.chusho.meti.go.jp/zaimu/zeisei/index.html",
    categories: ["SETSUBI_TOUSHI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "KENSETSU", "ALL"],
    tags: [
      "税制優遇",
      "特別償却",
      "税額控除",
      "機械装置",
      "設備投資",
      "節税",
      "青色申告",
    ],
    eligibilityCriteria: [
      "青色申告書を提出する中小企業者であること",
      "資本金1億円以下の法人、または従業員1,000人以下の個人事業主であること",
      "対象設備を新品で取得し、かつ事業の用に供すること",
      "機械装置は1台160万円以上、ソフトウェアは70万円以上等の取得価額要件を満たすこと",
    ],
    excludedCases: [
      "中古設備の取得",
      "資本金1億円超の法人",
      "税額控除は資本金3,000万円超の法人は対象外",
      "所有権移転外リース取引（税額控除の対象外）",
    ],
    requiredDocuments: [
      "確定申告書の別表（特別償却の付表等）",
      "設備の取得価額を証する書類（契約書・請求書等）",
      "設備の仕様書・カタログ",
    ],
    applicationSections: [
      {
        key: "equipment_info",
        title: "取得設備の情報",
        description:
          "取得した設備の名称・型番・取得価額・取得日・事業供用日を記載します。",
        group: "税務申告書類",
        estimatedLength: "300〜400字",
      },
      {
        key: "tax_benefit_selection",
        title: "適用する税制措置の選択",
        description:
          "特別償却と税額控除のどちらを適用するか、選択理由を記載します。",
        group: "税務申告書類",
        estimatedLength: "200〜300字",
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
  // 大阪府 設備投資応援補助金
  // ============================================================
  {
    id: "osaka-setsubi-001",
    name: "大阪府 ものづくりイノベーション推進事業補助金",
    nameShort: "大阪府ものづくり補助金",
    department: "大阪府・大阪産業局",
    summary:
      "大阪府内の中小製造業者が生産性向上・新製品開発のために行う設備投資や技術開発を支援します。",
    description:
      "大阪府ものづくりイノベーション推進事業補助金は、大阪府内のものづくり中小企業が、IoT・AI・ロボット等の先端技術を活用した生産性向上や新製品・新技術の開発に取り組む際の設備投資費用を支援する制度です。製造業の競争力強化と技術革新を目的とし、機械設備費、システム構築費等が対象となります。",
    maxAmount: 1000,
    minAmount: 100,
    subsidyRate: "1/2",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-30" },
    url: "https://www.obda.or.jp/",
    categories: ["SETSUBI_TOUSHI", "KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU"],
    tags: [
      "大阪府",
      "ものづくり",
      "IoT",
      "AI",
      "ロボット",
      "設備投資",
      "製造業",
      "技術革新",
    ],
    eligibilityCriteria: [
      "大阪府内に主たる事業所を有する中小企業者であること",
      "製造業を営んでいること",
      "先端技術を活用した生産性向上または新製品開発の計画があること",
      "府税の滞納がないこと",
    ],
    excludedCases: [
      "府外に主たる事業所がある企業",
      "製造業以外の業種",
      "みなし大企業に該当する者",
      "同一の事業内容で他の公的補助金を受給している者",
    ],
    requiredDocuments: [
      "補助金交付申請書",
      "事業計画書",
      "決算書（直近2期分）",
      "設備の見積書・仕様書",
      "府税の納税証明書",
    ],
    applicationSections: [
      {
        key: "manufacturing_overview",
        title: "ものづくりの現状と課題",
        description:
          "現在の製造プロセス、技術力、直面している課題を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "innovation_plan",
        title: "イノベーションの内容",
        description:
          "先端技術の活用内容、導入する設備・システム、期待される効果を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "schedule_budget",
        title: "実施スケジュールと予算計画",
        description:
          "事業のスケジュール、設備投資の内訳、資金計画を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
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
    id: "aichi-setsubi-001",
    name: "新あいち創造産業立地補助金",
    nameShort: "あいち産業立地補助金",
    department: "愛知県経済産業局",
    summary:
      "愛知県内での工場・研究所等の新増設に伴う設備投資に対して、投資額に応じた補助金を交付します。",
    description:
      "新あいち創造産業立地補助金は、愛知県内における企業の工場、研究所等の新増設を促進するため、一定規模以上の設備投資を行う企業に対して補助金を交付する制度です。製造業のほか、ソフトウェア業、情報処理サービス業等も対象です。投資規模に応じて補助額が決定され、雇用創出や県内調達率等の加点要素もあります。",
    maxAmount: 5000,
    minAmount: 500,
    subsidyRate: "投資額の5〜10%",
    deadline: "2026-08-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-08-31" },
    url: "https://www.pref.aichi.jp/soshiki/ricchi/",
    categories: ["SETSUBI_TOUSHI", "CHIIKI_KASSEIKA"],
    targetScale: ["CHUSHO"],
    targetIndustries: ["SEIZOU", "IT"],
    tags: [
      "愛知県",
      "工場立地",
      "設備投資",
      "工場新増設",
      "研究所",
      "製造業",
      "地域振興",
    ],
    eligibilityCriteria: [
      "愛知県内に工場・研究所等を新設又は増設する計画があること",
      "設備投資額が一定規模以上であること（中小企業は5,000万円以上）",
      "新たな雇用の創出が見込まれること",
      "県税の滞納がないこと",
      "環境関連法令を遵守していること",
    ],
    excludedCases: [
      "県外への移転を伴う場合（県内での移転は対象）",
      "風俗営業等に該当する事業",
      "設備投資額が基準額に満たない場合",
    ],
    requiredDocuments: [
      "補助金交付申請書",
      "事業計画書（工場新増設の内容）",
      "投資計画書・見積書",
      "雇用計画書",
      "決算書（直近2期分）",
    ],
    applicationSections: [
      {
        key: "investment_overview",
        title: "設備投資の概要",
        description:
          "工場・研究所の新増設の内容、投資規模、立地場所の選定理由を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "employment_plan",
        title: "雇用計画",
        description:
          "新規雇用の計画人数、職種、地元採用方針を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "regional_contribution",
        title: "地域経済への貢献",
        description:
          "県内調達計画、地元企業との連携、地域経済への波及効果を記載します。",
        group: "事業計画書",
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
  // 中小企業等事業再構築促進基金 成長枠（設備投資重点）
  // ============================================================
  {
    id: "seisansei-kakumei-001",
    name: "ものづくり補助金 グローバル市場開拓枠",
    nameShort: "ものづくり補助金グローバル枠",
    department: "経済産業省・中小企業庁",
    summary:
      "海外市場への展開を目指す中小企業が、海外向け製品開発・設備導入に必要な経費を最大3,000万円まで支援します。",
    description:
      "ものづくり補助金のグローバル市場開拓枠は、海外事業の拡大・強化を目指す中小企業等が行う、海外市場向けの革新的な製品・サービスの開発や、海外展開に必要な設備投資を支援する特別枠です。海外直接投資類型、海外市場開拓（JAPANブランド）類型、インバウンド対応類型、海外事業者との共同事業類型があり、通常枠よりも高い補助上限が設定されています。",
    maxAmount: 3000,
    minAmount: null,
    subsidyRate: "1/2（小規模事業者は2/3）",
    deadline: "2026-08-29",
    applicationPeriod: { start: "2026-06-01", end: "2026-08-29" },
    url: "https://portal.monodukuri-hojo.jp/",
    categories: ["SETSUBI_TOUSHI", "KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "SERVICE", "ALL"],
    tags: [
      "海外展開",
      "グローバル",
      "JAPANブランド",
      "設備投資",
      "製品開発",
      "ものづくり",
      "インバウンド",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "海外事業の拡大・強化に資する事業計画を策定すること",
      "付加価値額を年率平均3%以上増加させる計画であること",
      "給与支給総額を年率平均1.5%以上増加させること",
      "海外展開に関する具体的な実績または計画があること",
    ],
    excludedCases: [
      "みなし大企業に該当する者",
      "海外展開の具体性が乏しい計画",
      "過去3年間に類似の補助金の交付を2回以上受けている者",
    ],
    requiredDocuments: [
      "事業計画書（10ページ以内）",
      "海外展開の実績・計画を示す書類",
      "賃金引上げ計画の誓約書",
      "決算書（直近2期分）",
      "導入設備の見積書",
    ],
    applicationSections: [
      {
        key: "global_strategy",
        title: "海外展開戦略",
        description:
          "対象とする海外市場、市場分析、自社の強みと差別化戦略を記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1000字",
      },
      {
        key: "product_development",
        title: "革新的製品・サービスの開発内容",
        description:
          "海外市場向けに開発する製品・サービスの内容、技術的特徴を記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "investment_plan",
        title: "設備投資計画",
        description:
          "海外展開に必要な設備投資の内容、導入スケジュールを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "revenue_projection",
        title: "収益計画と海外売上目標",
        description:
          "海外売上目標、国内外の収益計画、付加価値額の推移予測を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "MONODZUKURI",
    popularity: 6,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 中堅・中小企業の賃上げに向けた省力化等の大規模成長投資補助金
  // ============================================================
  {
    id: "daikibo-seichou-001",
    name: "中堅・中小企業の賃上げに向けた省力化等の大規模成長投資補助金",
    nameShort: "大規模成長投資補助金",
    department: "経済産業省",
    summary:
      "10億円以上の大規模な設備投資を行い、持続的な賃上げを実現する中堅・中小企業を支援する大型補助金です。",
    description:
      "大規模成長投資補助金は、地域の雇用を支える中堅・中小企業が、足元の人手不足に対応するため、工場の新設・大規模な設備更新等の省力化のための大規模投資を行い、それにより事業を成長させ、持続的な賃上げを実現することを目的とした補助金です。補助上限50億円と非常に大規模で、投資額10億円以上が対象。工場の新設、生産ライン増設等の設備投資を支援します。",
    maxAmount: 500000,
    minAmount: 100000,
    subsidyRate: "1/3",
    deadline: "2026-07-31",
    applicationPeriod: { start: "2026-04-01", end: "2026-07-31" },
    url: "https://www.meti.go.jp/policy/economy/keiei_innovation/seichoutoushi/",
    categories: ["SETSUBI_TOUSHI"],
    targetScale: ["CHUSHO"],
    targetIndustries: ["SEIZOU", "SERVICE", "ALL"],
    tags: [
      "大規模投資",
      "省力化",
      "賃上げ",
      "工場新設",
      "設備更新",
      "雇用維持",
      "成長投資",
    ],
    eligibilityCriteria: [
      "中堅企業（資本金10億円未満）又は中小企業であること",
      "投資額が10億円以上であること",
      "補助事業の実施により、従業員1人当たりの給与支給総額を年率平均2%以上増加させる計画であること",
      "事業終了後3年間で付加価値額を年率平均3%以上増加させる計画を策定すること",
      "GビズIDプライムのアカウントを取得していること",
    ],
    excludedCases: [
      "投資額が10億円に満たない事業計画",
      "大企業（資本金10億円以上）",
      "賃上げ計画が要件を満たさない場合",
      "土地の取得費のみの投資",
    ],
    requiredDocuments: [
      "事業計画書",
      "投資計画書（設備仕様・工事内容の詳細）",
      "決算書（直近3期分）",
      "賃上げ計画書・誓約書",
      "金融機関の融資確認書又は資金調達計画書",
    ],
    applicationSections: [
      {
        key: "growth_vision",
        title: "成長ビジョンと投資の背景",
        description:
          "企業の成長戦略、大規模投資に至った背景、事業環境の分析を記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "investment_detail",
        title: "設備投資の詳細計画",
        description:
          "工場新設・設備導入の内容、省力化の仕組み、技術的な詳細を記載します。",
        group: "事業計画書",
        estimatedLength: "1000〜1500字",
      },
      {
        key: "wage_increase_plan",
        title: "賃上げ計画と雇用維持",
        description:
          "従業員の賃上げ計画、雇用維持・創出の方針、人材育成計画を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "financial_plan",
        title: "収支計画と資金調達",
        description:
          "投資の収支計画、資金調達方法、付加価値額の向上見込みを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },
];
