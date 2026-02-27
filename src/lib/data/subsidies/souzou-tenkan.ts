import type { SubsidyInfo } from "@/types";

/**
 * 事業再構築・事業転換カテゴリの補助金データ
 * SOUZOU_TENKAN - 事業再構築・事業承継・事業転換
 */
export const souzouTenkanSubsidies: SubsidyInfo[] = [
  // ============================================================
  // 事業再構築補助金
  // ============================================================
  {
    id: "saikouchiku-001",
    name: "事業再構築補助金",
    nameShort: "事業再構築",
    department: "経済産業省・中小企業庁",
    summary:
      "ポストコロナ・ウィズコロナ時代の経済社会の変化に対応するため、事業の再構築に取り組む中小企業等を支援します。",
    description:
      "事業再構築補助金は、新市場進出（新分野展開、業態転換）、事業・業種転換、事業再編またはこれらの取組を通じた規模の拡大等、思い切った事業再構築に意欲を有する中小企業等の挑戦を支援する制度です。認定経営革新等支援機関と事業計画を策定し、一体となって取り組む必要があります。",
    maxAmount: 8000,
    minAmount: 100,
    subsidyRate: "2/3",
    deadline: "2026-07-31",
    applicationPeriod: { start: "2026-05-01", end: "2026-07-31" },
    url: "https://jigyou-saikouchiku.go.jp/",
    categories: ["SOUZOU_TENKAN"],
    targetScale: ["CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "事業転換",
      "新分野展開",
      "業態転換",
      "ポストコロナ",
      "再構築",
      "認定支援機関",
      "大型補助金",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "事業計画を認定経営革新等支援機関と策定すること",
      "補助事業終了後3〜5年で付加価値額の年率平均3.0%以上増加の達成を見込む事業計画を策定すること",
      "事業再構築指針に沿った新分野展開、業態転換、事業・業種転換等を行うこと",
    ],
    excludedCases: [
      "補助対象事業の実施にあたり、他の補助金を受けている場合",
      "事業再構築の類型に合致しない事業計画の場合",
      "暴力団員等の反社会的勢力に該当する者",
      "過去に不正受給を行った事業者",
    ],
    requiredDocuments: [
      "事業計画書（15ページ以内）",
      "認定経営革新等支援機関による確認書",
      "決算書（直近2期分）",
      "従業員数を示す書類",
      "ミラサポplus「ローカルベンチマーク」の事業財務情報",
      "金融機関による確認書（補助金額3,000万円超の場合）",
    ],
    applicationSections: [
      {
        key: "company_profile",
        title: "事業者の概要",
        description:
          "会社の沿革、事業内容、組織体制、主力製品・サービスなどの基本情報を記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1000字",
      },
      {
        key: "current_situation",
        title: "事業の現状と課題",
        description:
          "現在の事業環境、売上・利益の推移、直面している課題を具体的なデータとともに記載します。",
        group: "事業計画書",
        estimatedLength: "1000〜1500字",
      },
      {
        key: "restructuring_plan",
        title: "事業再構築の具体的内容",
        description:
          "新分野展開・業態転換等の具体的な内容、実施体制、スケジュールを詳細に記載します。",
        group: "事業計画書",
        estimatedLength: "2000〜3000字",
      },
      {
        key: "market_analysis",
        title: "市場分析・競合分析",
        description:
          "参入する市場の規模、成長性、競合状況、自社の優位性を分析し記載します。",
        group: "事業計画書",
        estimatedLength: "800〜1200字",
      },
      {
        key: "financial_plan",
        title: "収支計画・資金計画",
        description:
          "補助事業期間中および事業終了後の収支計画、投資回収見込みを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
    ],
    promptSupport: "FULL",
    subsidyType: "JIGYOU_SAIKOUCHIKU",
    popularity: 8,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 事業承継・引継ぎ補助金
  // ============================================================
  {
    id: "jigyo-shoukei-001",
    name: "事業承継・引継ぎ補助金",
    nameShort: "事業承継補助金",
    department: "中小企業庁",
    summary:
      "事業承継やM&Aを契機として新たな取り組みを行う中小企業を支援します。",
    description:
      "事業承継・引継ぎ補助金は、事業承継やM&Aを契機とした経営革新等への挑戦や、M&Aによる経営資源の引継ぎ、廃業・再チャレンジを行う中小企業者等を支援する制度です。経営革新枠、専門家活用枠、廃業・再チャレンジ枠の3つの類型があります。後継者不在による廃業を防ぎ、地域経済の活性化を図ります。",
    maxAmount: 600,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-09-30",
    applicationPeriod: { start: "2026-06-15", end: "2026-09-30" },
    url: "https://jsh.go.jp/",
    categories: ["SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "事業承継",
      "M&A",
      "後継者",
      "経営革新",
      "引継ぎ",
      "廃業",
      "再チャレンジ",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "事業承継（M&A含む）を行った、または行う予定であること",
      "地域経済に貢献する事業を営んでいること",
      "事業承継を契機とした新たな取り組みを実施すること",
    ],
    excludedCases: [
      "事業承継の実態がない形式的な承継の場合",
      "親族内承継で経営革新を伴わない場合",
      "反社会的勢力に該当する者",
    ],
    requiredDocuments: [
      "事業計画書",
      "事業承継の証明書類（登記簿謄本、株式譲渡契約書等）",
      "決算書（直近2期分）",
      "認定経営革新等支援機関の確認書",
      "従業員名簿",
    ],
    applicationSections: [
      {
        key: "succession_overview",
        title: "事業承継の概要",
        description:
          "承継の経緯、承継者と被承継者の関係、承継の形態（親族内・親族外・M&A等）を記載します。",
        group: "事業計画",
        estimatedLength: "400〜600字",
      },
      {
        key: "new_initiatives",
        title: "承継を契機とした新たな取り組み",
        description:
          "事業承継をきっかけに実施する経営革新の具体的内容を記載します。",
        group: "事業計画",
        estimatedLength: "600〜800字",
      },
      {
        key: "expected_results",
        title: "期待される成果と目標",
        description:
          "新たな取り組みにより期待される売上・利益の改善効果を数値で示します。",
        group: "事業計画",
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

  // ============================================================
  // 経営革新計画承認制度
  // ============================================================
  {
    id: "keiei-kakushin-001",
    name: "経営革新計画承認制度",
    nameShort: "経営革新計画",
    department: "中小企業庁・各都道府県",
    summary:
      "中小企業が新事業活動に取り組む計画を都道府県知事等が承認し、各種支援措置を受けられる制度です。",
    description:
      "経営革新計画承認制度は、中小企業等経営強化法に基づき、中小企業が「新事業活動」（新商品の開発・生産、新サービスの開発・提供、商品の新たな生産・販売方式の導入、サービスの新たな提供方式の導入等）に取り組む経営革新計画を作成し、都道府県知事等の承認を受けることで、低利融資、信用保証の特例、投資・補助金の優遇等の支援措置を受けられる制度です。直接的な補助金ではありませんが、承認を受けることで他の補助金申請時の加点要素となることが多いです。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/kakushin/",
    categories: ["SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "経営革新",
      "新事業活動",
      "承認制度",
      "低利融資",
      "信用保証",
      "加点要素",
      "通年申請",
    ],
    eligibilityCriteria: [
      "中小企業等経営強化法に定める中小企業者であること",
      "新事業活動に取り組む経営革新計画を策定すること",
      "計画期間（3〜5年）で経営指標の相当程度の向上を見込むこと",
      "付加価値額が年率平均3%以上、または経常利益が年率平均1%以上向上する計画であること",
    ],
    excludedCases: [
      "既に実施済みの事業に対する計画",
      "新事業活動に該当しない単なる設備更新のみの計画",
      "大企業に該当する者",
    ],
    requiredDocuments: [
      "経営革新計画に係る承認申請書",
      "経営革新計画書（別紙）",
      "直近2期分の決算書",
      "会社概要・パンフレット等",
    ],
    applicationSections: [
      {
        key: "new_business_content",
        title: "新事業活動の内容",
        description:
          "実施する新事業活動の類型と具体的な内容を記載します。",
        group: "経営革新計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "implementation_plan",
        title: "実施計画",
        description:
          "新事業活動の実施体制、スケジュール、必要な経営資源を記載します。",
        group: "経営革新計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "management_targets",
        title: "経営目標",
        description:
          "付加価値額、経常利益等の計画期間における目標値を記載します。",
        group: "経営革新計画書",
        estimatedLength: "300〜400字",
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
  // 新連携支援事業（異分野連携新事業分野開拓計画）
  // ============================================================
  {
    id: "shinrenkei-001",
    name: "新連携支援事業（異分野連携新事業分野開拓計画）",
    nameShort: "新連携支援",
    department: "経済産業省・中小企業庁",
    summary:
      "異分野の中小企業が連携し、それぞれの経営資源を活用して新事業を展開する取り組みを支援します。",
    description:
      "新連携支援事業は、中小企業等経営強化法に基づき、異なる分野の事業を営む2社以上の中小企業が有機的に連携し、各企業の経営資源（技術、ノウハウ等）を有効に組み合わせて新事業活動を行う計画（異分野連携新事業分野開拓計画）を認定し、各種支援を行う制度です。認定を受けると、低利融資、信用保証の特例、投資の特例等の支援措置を利用できます。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/shinpou/shinrenkei.html",
    categories: ["SOUZOU_TENKAN", "KENKYUU_KAIHATSU"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "異分野連携",
      "新事業",
      "経営資源",
      "中小企業連携",
      "認定制度",
      "低利融資",
    ],
    eligibilityCriteria: [
      "異なる分野の事業を営む2社以上の中小企業が連携すること",
      "各企業の経営資源を有効に組み合わせた新事業活動であること",
      "連携体の中核となる中小企業（コア企業）が明確であること",
      "計画期間内に事業化が見込まれること",
    ],
    excludedCases: [
      "単なる取引関係のみで有機的連携の実態がない場合",
      "大企業のみで構成される連携体",
      "既存事業の単なる拡大で新規性がない場合",
    ],
    requiredDocuments: [
      "異分野連携新事業分野開拓計画認定申請書",
      "連携体構成員一覧及び各社の概要",
      "事業計画書",
      "各構成員の決算書（直近2期分）",
    ],
    applicationSections: [
      {
        key: "collaboration_overview",
        title: "連携体の概要",
        description:
          "連携に参加する各企業の強みと役割分担、連携の経緯を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "new_business_plan",
        title: "新事業の内容と計画",
        description:
          "連携によって実現する新事業の内容、市場性、スケジュールを記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "synergy_effects",
        title: "連携によるシナジー効果",
        description:
          "各企業の経営資源の組み合わせによる相乗効果を具体的に記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 3,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 農商工連携支援事業
  // ============================================================
  {
    id: "noushoukou-001",
    name: "農商工等連携事業計画",
    nameShort: "農商工連携",
    department: "農林水産省・経済産業省",
    summary:
      "農林漁業者と中小企業者が連携して行う新商品・新サービスの開発等を支援します。",
    description:
      "農商工等連携事業計画は、農商工等連携促進法に基づき、農林漁業者と中小企業者が有機的に連携し、それぞれの経営資源を有効に活用して行う新商品・新サービスの開発、生産、需要の開拓等の事業計画について国の認定を受けることで、補助金、低利融資、信用保証の特例等の支援措置を利用できる制度です。6次産業化とも連動し、地域の農林水産物を活用した付加価値の高い商品開発を促進します。",
    maxAmount: 500,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/shinpou/noushoukou.html",
    categories: ["SOUZOU_TENKAN", "CHIIKI_KASSEIKA"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "INSHOKU", "KOURI", "ALL"],
    tags: [
      "農商工連携",
      "6次産業化",
      "農林水産",
      "新商品開発",
      "地域資源",
      "連携事業",
    ],
    eligibilityCriteria: [
      "農林漁業者と中小企業者が共同で事業計画を策定すること",
      "それぞれの経営資源を有効に活用した新商品等の開発であること",
      "計画期間（3〜5年）で事業化を目指すこと",
      "地域経済の活性化に資する事業であること",
    ],
    excludedCases: [
      "農林漁業者または中小企業者のどちらか一方のみによる事業",
      "既存商品の単なるパッケージ変更等で新規性がない場合",
      "事業計画の実現可能性が著しく低い場合",
    ],
    requiredDocuments: [
      "農商工等連携事業計画認定申請書",
      "連携する農林漁業者・中小企業者の概要",
      "事業計画書",
      "決算書・確定申告書（直近2期分）",
      "連携協定書等",
    ],
    applicationSections: [
      {
        key: "collaboration_background",
        title: "連携の背景と目的",
        description:
          "農林漁業者と中小企業者の連携に至った経緯と事業の目的を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "product_development",
        title: "新商品・新サービスの内容",
        description:
          "開発する新商品・新サービスの具体的内容、特徴、差別化ポイントを記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "sales_plan",
        title: "販路開拓・販売計画",
        description:
          "開発した商品・サービスの販売先、販売方法、売上目標を記載します。",
        group: "事業計画書",
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
  // 経営改善計画策定支援事業（405事業）
  // ============================================================
  {
    id: "keiei-kaizen-001",
    name: "経営改善計画策定支援事業（405事業）",
    nameShort: "405事業",
    department: "中小企業庁",
    summary:
      "認定支援機関の支援を受けて経営改善計画を策定する際の費用を補助します。",
    description:
      "経営改善計画策定支援事業（通称405事業）は、借入金の返済負担等の財務上の問題を抱え、金融支援が必要な中小企業・小規模事業者が、認定経営革新等支援機関の支援を受けて経営改善計画を策定する場合に、その費用の一部を補助する制度です。経営改善計画策定支援の費用として上限200万円、伴走支援（モニタリング）費用として上限100万円が補助されます。金融機関との関係改善や経営再建に有効です。",
    maxAmount: 300,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/kakushin/kaizen/",
    categories: ["SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "経営改善",
      "405事業",
      "認定支援機関",
      "金融支援",
      "経営再建",
      "資金繰り",
      "通年申請",
    ],
    eligibilityCriteria: [
      "借入金の返済負担等の財務上の問題を抱えていること",
      "自ら経営改善計画等を策定することが難しい中小企業であること",
      "認定経営革新等支援機関の支援を受けて経営改善計画を策定すること",
      "金融機関からの金融支援（条件変更等）が見込まれること",
    ],
    excludedCases: [
      "経営改善の意思がなく、単に返済猶予のみを求める場合",
      "既に法的整理の手続きに入っている場合",
      "認定支援機関の支援を受けない場合",
    ],
    requiredDocuments: [
      "利用申請書",
      "認定経営革新等支援機関による経営改善計画策定の見積書",
      "金融機関との相談経緯を示す書類",
      "直近の決算書・試算表",
    ],
    applicationSections: [
      {
        key: "financial_situation",
        title: "財務状況の現状",
        description:
          "借入金の状況、返済負担、資金繰りの課題を記載します。",
        group: "利用申請書",
        estimatedLength: "300〜500字",
      },
      {
        key: "improvement_direction",
        title: "経営改善の方向性",
        description:
          "経営改善の具体的な方針と目指す財務状態を記載します。",
        group: "利用申請書",
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
  // 中小企業再生支援協議会事業
  // ============================================================
  {
    id: "saisei-shien-001",
    name: "中小企業活性化協議会（旧再生支援協議会）事業",
    nameShort: "活性化協議会",
    department: "中小企業庁・中小企業活性化協議会",
    summary:
      "財務上の問題を抱える中小企業に対し、再生計画の策定支援や事業再生に向けたアドバイスを無料で提供します。",
    description:
      "中小企業活性化協議会事業は、各都道府県に設置された中小企業活性化協議会が、窮境にある中小企業の再生を支援する制度です。常駐する専門家（弁護士、公認会計士、中小企業診断士等）が経営相談に応じるとともに、必要に応じて再生計画の策定支援を行います。第一次対応（窓口相談）は無料で、第二次対応（再生計画策定支援）では外部専門家費用の一部が公的に負担されます。直接的な補助金ではありませんが、事業再生・経営改善を目指す中小企業にとって重要な公的支援制度です。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.chusho.meti.go.jp/keiei/saisei/",
    categories: ["SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "事業再生",
      "経営改善",
      "無料相談",
      "専門家支援",
      "再生計画",
      "活性化協議会",
      "通年対応",
    ],
    eligibilityCriteria: [
      "財務上の問題を抱えている中小企業であること",
      "事業の再生・改善に意欲があること",
      "主たる事業所の所在地の都道府県の協議会に相談すること",
    ],
    excludedCases: [
      "反社会的勢力に該当する者",
      "再生の見込みがなく清算が適切と判断される場合",
      "経営者に再生への意欲がない場合",
    ],
    requiredDocuments: [
      "相談申込書",
      "決算書（直近3期分）",
      "借入金一覧表",
      "資金繰り表",
    ],
    applicationSections: [
      {
        key: "business_situation",
        title: "事業の現状",
        description:
          "事業内容、経営環境、窮境に至った原因を記載します。",
        group: "相談申込書",
        estimatedLength: "400〜600字",
      },
      {
        key: "regeneration_direction",
        title: "再生に向けた方向性",
        description:
          "経営改善・事業再生に向けた基本的な方針を記載します。",
        group: "相談申込書",
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
  // 経営革新等支援機関推進事業（プッシュ型事業承継支援）
  // ============================================================
  {
    id: "push-shoukei-001",
    name: "事業承継・引継ぎ支援センター事業",
    nameShort: "事業承継支援センター",
    department: "中小企業庁",
    summary:
      "後継者不在の中小企業に対し、事業承継やM&Aのマッチング、相談対応を行う公的支援窓口です。",
    description:
      "事業承継・引継ぎ支援センター事業は、各都道府県に設置された事業承継・引継ぎ支援センターが、中小企業の事業承継に関するあらゆる相談に対応する制度です。後継者探し、M&Aのマッチング、事業承継計画の策定支援、事業承継に関するセミナー開催等を行います。相談は無料で、専門家（中小企業診断士、税理士、弁護士等）による個別対応が受けられます。事業承継補助金の申請に先立つ準備段階での利用にも適しています。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—",
    deadline: null,
    applicationPeriod: null,
    url: "https://shoukei.smrj.go.jp/",
    categories: ["SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "事業承継",
      "後継者",
      "M&A",
      "マッチング",
      "無料相談",
      "専門家支援",
      "通年対応",
    ],
    eligibilityCriteria: [
      "事業承継に課題を抱える中小企業・小規模事業者であること",
      "後継者不在または事業の引継ぎを検討していること",
      "事業所が所在する都道府県の支援センターに相談すること",
    ],
    excludedCases: [
      "事業承継の意思がない場合",
      "反社会的勢力に該当する者",
      "大企業に該当する者",
    ],
    requiredDocuments: [
      "相談申込書",
      "会社概要書",
      "決算書（直近2期分）",
    ],
    applicationSections: [
      {
        key: "succession_issue",
        title: "事業承継の課題",
        description:
          "後継者の有無、承継の希望時期、現在の課題を記載します。",
        group: "相談申込書",
        estimatedLength: "300〜500字",
      },
      {
        key: "business_overview_succession",
        title: "事業の概要と強み",
        description:
          "承継対象の事業内容、強み、経営資源を記載します。",
        group: "相談申込書",
        estimatedLength: "300〜500字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 再チャレンジ支援融資（再挑戦支援資金）
  // ============================================================
  {
    id: "re-challenge-001",
    name: "再挑戦支援資金（再チャレンジ支援融資）",
    nameShort: "再チャレンジ融資",
    department: "日本政策金融公庫",
    summary:
      "廃業歴等がある起業家や、事業の再建を目指す方に対して低利融資を行います。",
    description:
      "再挑戦支援資金（再チャレンジ支援融資）は、日本政策金融公庫が実施する融資制度で、一度事業に失敗した起業家が再起を図る際に利用できる低利の融資です。廃業の経験がある方で、新たに事業を開始する方、または廃業後概ね7年以内に開業した方が対象です。融資限度額は7,200万円（うち運転資金4,800万円）で、通常よりも緩やかな審査基準が適用されます。補助金ではなく融資制度ですが、再チャレンジを支援する重要な公的制度です。",
    maxAmount: 7200,
    minAmount: null,
    subsidyRate: "—（融資制度）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.jfc.go.jp/n/finance/search/05_rechallenge_m.html",
    categories: ["SOUZOU_TENKAN"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "再チャレンジ",
      "融資",
      "起業",
      "廃業経験",
      "日本政策金融公庫",
      "低利融資",
      "通年申請",
    ],
    eligibilityCriteria: [
      "廃業歴等がある方で新たに事業を開始する方、または廃業後おおむね7年以内に開業した方",
      "廃業時の負債が新たな事業に影響を与えない程度に整理される見込みがあること",
      "廃業の理由・事情がやむを得ないものであること",
    ],
    excludedCases: [
      "廃業時に詐欺等の違法行為があった場合",
      "廃業時の負債が多額で整理の見込みがない場合",
      "新たな事業計画の実現可能性が著しく低い場合",
    ],
    requiredDocuments: [
      "借入申込書",
      "事業計画書（創業計画書）",
      "廃業に関する経緯書",
      "確定申告書・決算書",
      "担保・保証に関する書類",
    ],
    applicationSections: [
      {
        key: "past_business_experience",
        title: "過去の事業経験と廃業の経緯",
        description:
          "以前の事業内容、廃業に至った理由、そこから得た教訓を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "new_business_plan_rechallenge",
        title: "新たな事業計画",
        description:
          "再チャレンジで取り組む事業の内容、差別化ポイント、収支計画を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
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
  // 中小企業組合等課題対応支援事業
  // ============================================================
  {
    id: "kumiai-kadai-001",
    name: "中小企業組合等課題対応支援事業",
    nameShort: "組合課題対応支援",
    department: "中小企業庁・全国中小企業団体中央会",
    summary:
      "中小企業組合等が共同で行う事業転換や経営革新等の課題解決の取り組みを支援します。",
    description:
      "中小企業組合等課題対応支援事業は、中小企業組合（事業協同組合、企業組合等）や連合会が、構成員の事業転換・事業再構築、DX推進、グリーン化、人材確保等の共通課題に共同で取り組む事業を支援する制度です。全国中小企業団体中央会を通じて補助金が交付され、組合としての共同事業の企画・実施に必要な経費を支援します。単独では困難な課題に組合の共同の力で取り組むことを促進します。",
    maxAmount: 2000,
    minAmount: null,
    subsidyRate: "6/10",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-06-30" },
    url: "https://www.chuokai.or.jp/",
    categories: ["SOUZOU_TENKAN"],
    targetScale: ["CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "中小企業組合",
      "共同事業",
      "事業転換",
      "DX",
      "協同組合",
      "中央会",
    ],
    eligibilityCriteria: [
      "中小企業等協同組合法等に基づく中小企業組合等であること",
      "構成員の共通課題に対する共同事業であること",
      "事業計画が具体的かつ実現可能であること",
      "都道府県中小企業団体中央会の推薦を受けること",
    ],
    excludedCases: [
      "構成員の個別事業に対する支援の場合",
      "共同事業としての実態がない場合",
      "組合の設立が直近で活動実績がない場合",
    ],
    requiredDocuments: [
      "事業計画書",
      "組合の定款・事業報告書",
      "収支予算書",
      "構成員名簿",
      "都道府県中央会の推薦書",
    ],
    applicationSections: [
      {
        key: "common_issues",
        title: "構成員の共通課題",
        description:
          "組合構成員が直面している共通の経営課題を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "joint_project_plan",
        title: "共同事業の内容",
        description:
          "課題解決のために実施する共同事業の具体的内容を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "expected_outcomes",
        title: "期待される成果",
        description:
          "共同事業による構成員への効果と組合全体の成果を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜400字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 3,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },
];
