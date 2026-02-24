import type { SubsidyInfo } from "@/types";

/**
 * 人材育成カテゴリの補助金データ
 * JINZAI_IKUSEI - 人材育成・雇用・働き方改革
 */
export const jinzaiIkuseiSubsidies: SubsidyInfo[] = [
  // ============================================================
  // キャリアアップ助成金（正社員化コース）
  // ============================================================
  {
    id: "career-up-001",
    name: "キャリアアップ助成金（正社員化コース）",
    nameShort: "キャリアアップ助成金",
    department: "厚生労働省",
    summary:
      "有期雇用労働者等を正規雇用労働者に転換した事業主に対して助成金を支給します。",
    description:
      "キャリアアップ助成金（正社員化コース）は、有期雇用労働者、短時間労働者、派遣労働者等の非正規雇用労働者のキャリアアップを促進するため、正規雇用労働者への転換等を実施した事業主に対して助成金を支給する制度です。1人あたりの定額支給であり、事業計画書の作成は不要で比較的申請しやすい助成金です。",
    maxAmount: 80,
    minAmount: null,
    subsidyRate: "定額",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "正社員化",
      "非正規雇用",
      "キャリアアップ",
      "人材育成",
      "雇用",
      "定額助成",
      "厚生労働省",
    ],
    eligibilityCriteria: [
      "雇用保険適用事業所の事業主であること",
      "キャリアアップ計画を作成し、管轄の労働局長の認定を受けていること",
      "有期雇用労働者等を正規雇用労働者に転換する制度を就業規則等に規定していること",
      "転換後6か月以上継続して雇用し、転換後の賃金が転換前より3%以上増加していること",
      "転換日の前日から起算して6か月前から1年を経過する日までの間に、解雇等をしていないこと",
    ],
    excludedCases: [
      "転換日から過去3年以内に正規雇用であった者の再雇用",
      "転換前の雇用期間が3年を超える有期雇用労働者",
      "事業主の親族の場合",
      "支給申請日に対象労働者が離職している場合",
    ],
    requiredDocuments: [
      "キャリアアップ計画書",
      "支給申請書",
      "転換前後の雇用契約書または労働条件通知書",
      "就業規則（正社員転換制度が規定されているもの）",
      "賃金台帳（転換前6か月分・転換後6か月分）",
      "出勤簿またはタイムカード",
    ],
    applicationSections: [
      {
        key: "career_up_plan",
        title: "キャリアアップ計画",
        description:
          "対象労働者のキャリアアップに向けた取り組み方針、目標を記載します。",
        group: "計画書",
        estimatedLength: "200〜400字",
      },
      {
        key: "conversion_details",
        title: "正社員化の取組内容",
        description:
          "正社員転換の対象者、転換時期、転換後の処遇改善内容を記載します。",
        group: "計画書",
        estimatedLength: "200〜400字",
      },
      {
        key: "follow_up",
        title: "転換後のフォローアップ",
        description:
          "正社員化後の研修計画、キャリア形成支援、定着促進の取り組みを記載します。",
        group: "計画書",
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
  // 業務改善助成金
  // ============================================================
  {
    id: "gyoumu-kaizen-001",
    name: "業務改善助成金",
    nameShort: "業務改善助成金",
    department: "厚生労働省",
    summary:
      "事業場内最低賃金の引上げと設備投資等を行った中小企業・小規模事業者を支援します。",
    description:
      "業務改善助成金は、事業場内で最も低い賃金（事業場内最低賃金）を一定額以上引き上げ、生産性向上に資する設備投資等を行った中小企業・小規模事業者に対し、その設備投資等に要した費用の一部を助成する制度です。賃金引上げ額に応じて助成上限額が変動します。機械設備やPOSシステム等の導入に活用できます。",
    maxAmount: 600,
    minAmount: null,
    subsidyRate: "3/4",
    deadline: "2026-12-31",
    applicationPeriod: { start: "2026-01-04", end: "2026-12-31" },
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/03.html",
    categories: ["SETSUBI_TOUSHI", "JINZAI_IKUSEI"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "最低賃金",
      "賃金引上げ",
      "設備投資",
      "生産性向上",
      "業務改善",
      "厚生労働省",
      "通年募集",
    ],
    eligibilityCriteria: [
      "中小企業・小規模事業者であること",
      "事業場内最低賃金と地域別最低賃金の差額が50円以内であること",
      "事業場内最低賃金を一定額以上引き上げること",
      "引上げ後の賃金額を支払うこと",
      "生産性向上に資する設備投資等を行うこと",
    ],
    excludedCases: [
      "事業場規模100人超の事業者",
      "事業場内最低賃金が地域別最低賃金＋50円を超えている場合",
      "過去に不正受給を行った事業者",
    ],
    requiredDocuments: [
      "交付申請書",
      "事業実施計画書",
      "賃金台帳（引上げ前後）",
      "設備投資等の見積書",
      "労働者名簿",
    ],
    applicationSections: [
      {
        key: "wage_increase_plan",
        title: "賃金引上げ計画",
        description:
          "引上げ対象者、引上げ額、引上げ時期を具体的に記載します。",
        group: "実施計画",
        estimatedLength: "200〜300字",
      },
      {
        key: "investment_content",
        title: "設備投資等の内容",
        description:
          "導入する設備・システムの名称、仕様、数量、導入時期を記載します。",
        group: "実施計画",
        estimatedLength: "300〜500字",
      },
      {
        key: "productivity_effect",
        title: "生産性向上の効果",
        description:
          "設備投資による業務効率化の内容と、期待される生産性向上の効果を記載します。",
        group: "実施計画",
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

  // ============================================================
  // 働き方改革推進支援助成金
  // ============================================================
  {
    id: "hatarakikata-001",
    name: "働き方改革推進支援助成金（労働時間短縮・年休促進支援コース）",
    nameShort: "働き方改革推進支援助成金",
    department: "厚生労働省",
    summary:
      "労働時間の短縮や年次有給休暇の促進に向けた環境整備に取り組む中小企業を支援します。",
    description:
      "働き方改革推進支援助成金は、労働時間の縮減や年次有給休暇の促進に向けた環境整備に取り組む中小企業事業主を支援する制度です。労務管理用ソフトウェアの導入、労務管理用機器の導入、デジタコ・運行記録計の導入、テレワーク用通信機器の導入、労働能率増進のための設備・機器の導入等に活用できます。",
    maxAmount: 200,
    minAmount: null,
    subsidyRate: "3/4",
    deadline: "2026-11-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-11-30" },
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000120692.html",
    categories: ["JINZAI_IKUSEI", "IT_DIGITAL"],
    targetScale: ["CHUSHO"],
    targetIndustries: ["ALL"],
    tags: [
      "働き方改革",
      "労働時間",
      "有給休暇",
      "テレワーク",
      "労務管理",
      "厚生労働省",
    ],
    eligibilityCriteria: [
      "労働者災害補償保険の適用事業主であること",
      "中小企業事業主であること（業種ごとの資本金・従業員数の要件を満たすこと）",
      "年5日の年次有給休暇の取得に向けた取り組みを実施すること",
      "36協定を締結していること",
    ],
    excludedCases: [
      "労働関係法令違反で送検されている事業主",
      "過去に本助成金の不正受給を行った事業主",
      "大企業に該当する事業主",
    ],
    requiredDocuments: [
      "交付申請書",
      "就業規則の写し",
      "36協定届の写し",
      "労働時間等の実績を示す書類",
      "導入する設備・機器の見積書",
    ],
    applicationSections: [
      {
        key: "current_work_status",
        title: "現在の労働時間等の状況",
        description:
          "現在の所定労働時間、時間外労働の状況、有給取得率等を記載します。",
        group: "申請書",
        estimatedLength: "200〜400字",
      },
      {
        key: "improvement_plan",
        title: "改善の取組内容",
        description:
          "導入する設備・システム、規程整備等の具体的な改善施策を記載します。",
        group: "申請書",
        estimatedLength: "300〜500字",
      },
      {
        key: "target_outcomes",
        title: "成果目標",
        description:
          "労働時間短縮、有給取得率向上等の定量的な成果目標を記載します。",
        group: "申請書",
        estimatedLength: "200〜300字",
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
  // 人材開発支援助成金（人材育成支援コース）
  // ============================================================
  {
    id: "jinzai-kaihatsu-001",
    name: "人材開発支援助成金（人材育成支援コース）",
    nameShort: "人材開発支援助成金",
    department: "厚生労働省",
    summary:
      "従業員に対する職業訓練（OFF-JT・OJT）を実施した事業主に対し、訓練経費や訓練期間中の賃金の一部を助成します。",
    description:
      "人材開発支援助成金は、事業主が雇用する労働者に対して職業訓練を実施した場合に、訓練経費や訓練期間中の賃金の一部を助成する制度です。人材育成支援コース、教育訓練休暇等付与コース、人への投資促進コース、事業展開等リスキリング支援コースなど複数のコースがあります。人材育成支援コースはOFF-JT（10時間以上）やOJTを組み合わせた訓練が対象です。",
    maxAmount: 1000,
    minAmount: null,
    subsidyRate: "経費助成45%〜75%＋賃金助成",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "職業訓練",
      "研修",
      "OFF-JT",
      "OJT",
      "リスキリング",
      "人材育成",
      "厚生労働省",
      "賃金助成",
    ],
    eligibilityCriteria: [
      "雇用保険適用事業所の事業主であること",
      "事業内職業能力開発計画を策定し、従業員に周知していること",
      "職業能力開発推進者を選任していること",
      "OFF-JTの訓練時間が10時間以上であること",
      "訓練期間中の賃金を適正に支払っていること",
    ],
    excludedCases: [
      "訓練の実施状況や賃金の支払い状況が確認できない場合",
      "不正受給から5年以内の事業者",
      "労働保険料の滞納がある事業者",
      "訓練の受講者が事業主の親族のみの場合",
    ],
    requiredDocuments: [
      "職業訓練実施計画届",
      "訓練カリキュラム・日程表",
      "支給申請書",
      "賃金台帳・出勤簿",
      "訓練に要した経費の領収書",
    ],
    applicationSections: [
      {
        key: "training_plan",
        title: "訓練計画の概要",
        description:
          "実施する職業訓練の内容、目的、対象者、期間を記載します。",
        group: "計画届",
        estimatedLength: "300〜500字",
      },
      {
        key: "skill_goals",
        title: "習得させる能力・スキル",
        description:
          "訓練を通じて従業員に習得させる具体的な能力・技術を記載します。",
        group: "計画届",
        estimatedLength: "200〜400字",
      },
      {
        key: "business_effect",
        title: "事業への効果",
        description:
          "訓練実施により期待される事業上の効果（生産性向上等）を記載します。",
        group: "計画届",
        estimatedLength: "200〜300字",
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
  // 両立支援等助成金（出生時両立支援コース）
  // ============================================================
  {
    id: "ryouritsu-shien-001",
    name: "両立支援等助成金（出生時両立支援コース）",
    nameShort: "両立支援等助成金",
    department: "厚生労働省",
    summary:
      "男性労働者の育児休業取得を促進するための取り組みを行った事業主に助成金を支給します。",
    description:
      "両立支援等助成金は、仕事と家庭の両立支援に取り組む事業主を支援する制度です。出生時両立支援コース（子育てパパ支援助成金）では、男性労働者が育児休業を取得しやすい職場風土づくりに取り組み、実際に男性労働者に育児休業を取得させた事業主に助成金を支給します。他にも介護離職防止支援コース、育児休業等支援コース等があります。",
    maxAmount: 60,
    minAmount: null,
    subsidyRate: "定額",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kodomo/shokuba_kosodate/ryouritsu01/index.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "育児休業",
      "男性育休",
      "両立支援",
      "ワークライフバランス",
      "子育て",
      "厚生労働省",
      "定額助成",
    ],
    eligibilityCriteria: [
      "雇用保険適用事業所の事業主であること",
      "男性労働者が育児休業を取得しやすい職場風土づくりの取り組みを行っていること",
      "男性労働者に連続5日以上の育児休業を取得させたこと",
      "育児休業取得者の業務を代替する体制を整備していること",
    ],
    excludedCases: [
      "育児休業の取得が確認できない場合",
      "不正受給から5年以内の事業者",
      "育児・介護休業法に違反している事業者",
    ],
    requiredDocuments: [
      "支給申請書",
      "育児休業申出書・取得確認書類",
      "就業規則（育児休業制度が規定されているもの）",
      "出勤簿・賃金台帳",
      "母子健康手帳の写し等（子の出生を確認できる書類）",
    ],
    applicationSections: [
      {
        key: "workplace_culture",
        title: "職場風土づくりの取り組み",
        description:
          "男性の育児休業取得を推進するための社内制度や啓発活動を記載します。",
        group: "申請書",
        estimatedLength: "200〜400字",
      },
      {
        key: "leave_details",
        title: "育児休業取得の詳細",
        description:
          "対象労働者の育児休業の取得期間、業務代替体制を記載します。",
        group: "申請書",
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
  // トライアル雇用助成金
  // ============================================================
  {
    id: "trial-koyou-001",
    name: "トライアル雇用助成金（一般トライアルコース）",
    nameShort: "トライアル雇用助成金",
    department: "厚生労働省",
    summary:
      "職業経験が不足している求職者等を試行的に雇用した事業主に対して助成金を支給します。",
    description:
      "トライアル雇用助成金は、職業経験の不足等から就職が困難な求職者等を、ハローワーク等の紹介により、原則3か月間の試行雇用（トライアル雇用）を行う事業主に対して助成する制度です。トライアル雇用期間中に適性や業務遂行能力を見極めることができ、常用雇用への移行を促進します。1人あたり月額最大4万円（最長3か月）が支給されます。",
    maxAmount: 12,
    minAmount: null,
    subsidyRate: "定額（月額最大4万円×3か月）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/trial_koyou.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "試行雇用",
      "就職困難者",
      "ハローワーク",
      "雇用促進",
      "採用",
      "厚生労働省",
      "定額助成",
    ],
    eligibilityCriteria: [
      "ハローワーク等の紹介により対象者を雇い入れること",
      "トライアル雇用を原則3か月間実施すること",
      "1週間の所定労働時間が30時間以上であること",
      "雇用保険の適用事業主であること",
      "過去に同一労働者をトライアル雇用したことがないこと",
    ],
    excludedCases: [
      "ハローワーク等の紹介以外で雇い入れた場合",
      "既に常用雇用として雇い入れている労働者",
      "事業主の親族を雇い入れる場合",
      "過去に不正受給を行った事業者",
    ],
    requiredDocuments: [
      "トライアル雇用実施計画書",
      "支給申請書",
      "雇用契約書の写し",
      "出勤簿・賃金台帳",
      "ハローワーク紹介状の写し",
    ],
    applicationSections: [
      {
        key: "trial_plan",
        title: "トライアル雇用計画",
        description:
          "対象者に従事させる業務内容、指導体制、常用雇用への移行基準を記載します。",
        group: "計画書",
        estimatedLength: "200〜400字",
      },
      {
        key: "evaluation_criteria",
        title: "評価基準",
        description:
          "トライアル期間中の評価項目、常用雇用移行の判断基準を記載します。",
        group: "計画書",
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
  // 特定求職者雇用開発助成金（特定就職困難者コース）
  // ============================================================
  {
    id: "tokutei-kyuushoku-001",
    name: "特定求職者雇用開発助成金（特定就職困難者コース）",
    nameShort: "特定求職者雇用開発助成金",
    department: "厚生労働省",
    summary:
      "高年齢者、障害者、母子家庭の母等の就職困難者をハローワーク等の紹介により雇い入れた事業主を助成します。",
    description:
      "特定求職者雇用開発助成金（特定就職困難者コース）は、高年齢者（60歳以上65歳未満）、障害者、母子家庭の母、父子家庭の父等の就職が特に困難な者を、ハローワーク等の紹介により継続して雇用する労働者として雇い入れた事業主に対して助成する制度です。対象者の区分と企業規模に応じて助成額が異なります。",
    maxAmount: 240,
    minAmount: 30,
    subsidyRate: "定額（対象者区分により異なる）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/tokutei_konnan.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "就職困難者",
      "高年齢者",
      "障害者雇用",
      "母子家庭",
      "ハローワーク",
      "継続雇用",
      "厚生労働省",
    ],
    eligibilityCriteria: [
      "ハローワーク等の紹介により対象者を雇い入れること",
      "雇用保険の一般被保険者として雇い入れ、継続して雇用することが確実であること",
      "対象者が65歳以上に達するまで継続して雇用し、かつ2年以上雇用することが見込まれること",
      "雇い入れ日前後6か月間に事業主都合の解雇をしていないこと",
    ],
    excludedCases: [
      "ハローワーク等の紹介以外で雇い入れた場合",
      "雇い入れ日の前日から過去3年間に、同一事業主に雇用されていた者",
      "事業主の親族を雇い入れる場合",
      "雇い入れ後すぐに離職させた場合",
    ],
    requiredDocuments: [
      "支給申請書",
      "雇用契約書の写し",
      "ハローワーク紹介状の写し",
      "出勤簿・賃金台帳",
      "対象者であることを証明する書類（障害者手帳の写し等）",
    ],
    applicationSections: [
      {
        key: "employment_plan",
        title: "雇用計画",
        description:
          "対象者を雇い入れる業務内容、配置予定、職場での配慮事項を記載します。",
        group: "申請書",
        estimatedLength: "200〜400字",
      },
      {
        key: "support_system",
        title: "職場定着支援体制",
        description:
          "対象者の職場定着のための支援体制、メンター制度等を記載します。",
        group: "申請書",
        estimatedLength: "200〜300字",
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
  // 65歳超雇用推進助成金
  // ============================================================
  {
    id: "65sai-koyou-001",
    name: "65歳超雇用推進助成金（65歳超継続雇用促進コース）",
    nameShort: "65歳超雇用推進助成金",
    department: "厚生労働省（独立行政法人高齢・障害・求職者雇用支援機構）",
    summary:
      "65歳以上への定年引上げや継続雇用制度の導入等を実施した事業主に対して助成金を支給します。",
    description:
      "65歳超雇用推進助成金は、高年齢者の雇用機会の確保を促進するため、65歳以上への定年引上げ、定年の定めの廃止、希望者全員を対象とする66歳以上の継続雇用制度の導入等の措置を実施した事業主に対して助成する制度です。高年齢者の活躍促進と人手不足解消の両面から活用されています。",
    maxAmount: 160,
    minAmount: 15,
    subsidyRate: "定額（措置内容・引上げ年数により異なる）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000139692.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "高年齢者",
      "定年引上げ",
      "継続雇用",
      "シニア活躍",
      "人手不足",
      "厚生労働省",
      "JEED",
    ],
    eligibilityCriteria: [
      "労働協約または就業規則で65歳以上への定年引上げ等の措置を実施したこと",
      "1年以上継続して雇用される60歳以上の雇用保険被保険者が1人以上いること",
      "高年齢者雇用推進者の選任及び高年齢者雇用管理に関する措置を実施していること",
      "支給申請日の前日において、当該制度を継続して実施していること",
    ],
    excludedCases: [
      "社会保険の適用逃れを目的とした措置",
      "過去に同一措置内容で本助成金を受給した事業者",
      "不正受給から5年以内の事業者",
    ],
    requiredDocuments: [
      "支給申請書",
      "就業規則（定年引上げ等が規定されたもの）の新旧対照表",
      "労働協約の写し（労働組合がある場合）",
      "高年齢者雇用状況報告書",
      "対象労働者の雇用保険被保険者資格取得確認通知書の写し",
    ],
    applicationSections: [
      {
        key: "measures_detail",
        title: "実施した措置の内容",
        description:
          "定年引上げ・継続雇用制度導入等の具体的な措置内容を記載します。",
        group: "申請書",
        estimatedLength: "200〜400字",
      },
      {
        key: "senior_utilization",
        title: "高年齢者の活用方針",
        description:
          "高年齢者の活躍促進に向けた今後の方針と具体的な取り組みを記載します。",
        group: "申請書",
        estimatedLength: "200〜300字",
      },
    ],
    promptSupport: "NONE",
    subsidyType: "OTHER",
    popularity: 5,
    difficulty: "EASY",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 人材確保等支援助成金（雇用管理制度助成コース）
  // ============================================================
  {
    id: "jinzai-kakuho-001",
    name: "人材確保等支援助成金（雇用管理制度助成コース）",
    nameShort: "人材確保等支援助成金",
    department: "厚生労働省",
    summary:
      "雇用管理制度（評価・処遇制度、研修制度等）の導入により従業員の離職率低下を達成した事業主を助成します。",
    description:
      "人材確保等支援助成金（雇用管理制度助成コース）は、事業主が雇用管理制度（諸手当等制度、研修制度、健康づくり制度、メンター制度、短時間正社員制度）を導入し、適切に実施した結果、離職率の低下目標を達成した場合に助成する制度です。人材の確保・定着を図るための職場環境の改善に活用できます。",
    maxAmount: 57,
    minAmount: null,
    subsidyRate: "定額",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000199292.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "離職率低下",
      "雇用管理",
      "メンター制度",
      "研修制度",
      "人材確保",
      "定着支援",
      "厚生労働省",
    ],
    eligibilityCriteria: [
      "雇用保険適用事業所の事業主であること",
      "雇用管理制度整備計画を作成し、管轄の労働局長の認定を受けていること",
      "認定された計画に基づき、雇用管理制度を導入・実施すること",
      "制度導入後の離職率が計画提出前の離職率より一定以上低下していること",
    ],
    excludedCases: [
      "離職率の低下目標を達成できなかった場合",
      "計画期間中に事業主都合の解雇を行った場合",
      "不正受給から5年以内の事業者",
    ],
    requiredDocuments: [
      "雇用管理制度整備計画書",
      "支給申請書",
      "就業規則（制度導入を証明するもの）",
      "離職率の計算に用いる離職者リスト",
      "制度実施を証明する書類（研修記録等）",
    ],
    applicationSections: [
      {
        key: "management_system",
        title: "導入する雇用管理制度",
        description:
          "導入する制度の内容、対象者、実施方法、スケジュールを記載します。",
        group: "計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "retention_target",
        title: "離職率低下の目標",
        description:
          "現在の離職率、目標とする離職率、達成に向けた取り組みを記載します。",
        group: "計画書",
        estimatedLength: "200〜300字",
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
  // 障害者雇用助成金（障害者介助等助成金）
  // ============================================================
  {
    id: "shougaisha-koyou-001",
    name: "障害者雇用助成金（障害者介助等助成金）",
    nameShort: "障害者雇用助成金",
    department: "独立行政法人高齢・障害・求職者雇用支援機構（JEED）",
    summary:
      "障害者を雇用する事業主に対し、職場介助者の配置や職場環境の整備に要する費用を助成します。",
    description:
      "障害者雇用助成金は、障害者の職業の安定を図るため、障害者を雇用する事業主や障害者を雇い入れようとする事業主に対して、障害者の雇用管理に必要な介助者の配置、職場環境の整備、通勤援助等に要する費用の一部を助成する制度です。障害の種類・程度に応じた合理的配慮の提供を支援します。",
    maxAmount: 150,
    minAmount: null,
    subsidyRate: "3/4",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.jeed.go.jp/disability/subsidy/index.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "障害者雇用",
      "合理的配慮",
      "職場介助",
      "バリアフリー",
      "ダイバーシティ",
      "JEED",
      "職場環境整備",
    ],
    eligibilityCriteria: [
      "雇用保険適用事業所の事業主であること",
      "障害者を雇用しているまたは雇い入れる予定であること",
      "助成対象となる措置（介助者配置、設備整備等）を実施すること",
      "障害者雇用促進法に基づく法定雇用率を達成する取り組みを行っていること",
    ],
    excludedCases: [
      "法定雇用率を大幅に下回り、改善の意思がない事業者",
      "障害者の雇用実績がなく、雇い入れの具体的計画もない場合",
      "過去に不正受給を行った事業者",
    ],
    requiredDocuments: [
      "助成金支給申請書",
      "障害者手帳の写し",
      "雇用契約書",
      "介助者の配置計画書または設備整備の見積書",
      "事業所の障害者雇用状況報告書",
    ],
    applicationSections: [
      {
        key: "accommodation_plan",
        title: "合理的配慮の実施計画",
        description:
          "障害者の障害特性に応じた合理的配慮の内容と実施体制を記載します。",
        group: "申請書",
        estimatedLength: "300〜500字",
      },
      {
        key: "workplace_support",
        title: "職場支援体制",
        description:
          "職場介助者の配置、支援機器の導入等の具体的な支援内容を記載します。",
        group: "申請書",
        estimatedLength: "200〜400字",
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
  // 産業雇用安定助成金（産業連携人材確保等支援コース）
  // ============================================================
  {
    id: "sangyou-koyou-001",
    name: "産業雇用安定助成金（産業連携人材確保等支援コース）",
    nameShort: "産業雇用安定助成金",
    department: "厚生労働省",
    summary:
      "景気変動等により事業活動の一時的な縮小を余儀なくされた事業主が、在籍型出向により労働者の雇用維持を図る場合に助成します。",
    description:
      "産業雇用安定助成金は、新型コロナウイルス感染症の影響等により事業活動の一時的な縮小を余儀なくされた事業主が、在籍型出向により労働者の雇用を維持する場合に、出向元と出向先の双方の事業主に対して助成する制度です。また、産業連携人材確保等支援コースでは、成長分野等へのスキル人材の移動・確保を支援します。",
    maxAmount: 500,
    minAmount: null,
    subsidyRate: "出向運営経費の2/3〜9/10",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000082805_00008.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "在籍型出向",
      "雇用維持",
      "雇用安定",
      "産業連携",
      "人材移動",
      "厚生労働省",
      "スキル移転",
    ],
    eligibilityCriteria: [
      "事業活動の一時的な縮小を余儀なくされた事業主であること",
      "在籍型出向により労働者の雇用維持を図ること",
      "出向期間が原則1か月以上1年以内であること",
      "出向元・出向先の双方が雇用保険適用事業所であること",
      "出向契約書を締結していること",
    ],
    excludedCases: [
      "出向元と出向先が親子関係、グループ企業間の場合（一部例外あり）",
      "出向労働者を解雇する目的での出向",
      "出向先での賃金が不当に低い場合",
      "不正受給から5年以内の事業者",
    ],
    requiredDocuments: [
      "出向実施計画書",
      "出向契約書",
      "支給申請書",
      "出向元・出向先の事業活動状況を示す書類",
      "賃金台帳・出勤簿",
    ],
    applicationSections: [
      {
        key: "secondment_plan",
        title: "出向計画の概要",
        description:
          "出向の目的、対象者、出向先、出向期間、業務内容を記載します。",
        group: "計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "employment_maintenance",
        title: "雇用維持の方針",
        description:
          "出向期間中の賃金負担、出向後の復帰計画、雇用維持の見通しを記載します。",
        group: "計画書",
        estimatedLength: "200〜400字",
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
  // 中途採用等支援助成金（中途採用拡大コース）
  // ============================================================
  {
    id: "chuuto-saiyo-001",
    name: "中途採用等支援助成金（中途採用拡大コース）",
    nameShort: "中途採用等支援助成金",
    department: "厚生労働省",
    summary:
      "中途採用者の雇用管理制度を整備し、中途採用の拡大を図った事業主に助成金を支給します。",
    description:
      "中途採用等支援助成金（中途採用拡大コース）は、中途採用者の採用を拡大（中途採用率の向上または45歳以上の初採用）するとともに、中途採用者の雇用管理制度を整備した事業主に対して助成する制度です。即戦力人材の確保やミドル・シニア層の活躍促進に活用できます。",
    maxAmount: 70,
    minAmount: null,
    subsidyRate: "定額",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160737_00001.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "中途採用",
      "採用拡大",
      "ミドル活躍",
      "雇用管理",
      "即戦力",
      "厚生労働省",
      "45歳以上",
    ],
    eligibilityCriteria: [
      "中途採用率を拡大した事業主であること（前年度比で一定以上の向上）",
      "中途採用者の雇用管理制度（教育訓練、賃金体系等）を整備していること",
      "雇用保険適用事業所の事業主であること",
      "中途採用計画を事前に策定し、管轄の労働局に届け出ていること",
    ],
    excludedCases: [
      "中途採用率の拡大が確認できない場合",
      "雇用管理制度の整備が不十分な場合",
      "不正受給から5年以内の事業者",
    ],
    requiredDocuments: [
      "中途採用計画書",
      "支給申請書",
      "中途採用者の雇用契約書",
      "就業規則（雇用管理制度が規定されたもの）",
      "中途採用の実績を示す書類",
    ],
    applicationSections: [
      {
        key: "recruitment_plan",
        title: "中途採用拡大計画",
        description:
          "中途採用の現状、拡大目標、採用する職種・人数を記載します。",
        group: "計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "management_system_plan",
        title: "雇用管理制度の整備計画",
        description:
          "中途採用者向けの教育訓練、評価制度、キャリアパス等の整備内容を記載します。",
        group: "計画書",
        estimatedLength: "200〜400字",
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
  // 雇用調整助成金
  // ============================================================
  {
    id: "koyou-chousei-001",
    name: "雇用調整助成金",
    nameShort: "雇用調整助成金",
    department: "厚生労働省",
    summary:
      "経済上の理由により事業活動の縮小を余儀なくされた事業主が、従業員の雇用を維持するために休業等を実施した場合に助成します。",
    description:
      "雇用調整助成金は、景気の変動、産業構造の変化等の経済上の理由により、事業活動の縮小を余儀なくされた事業主が、一時的な雇用調整（休業、教育訓練、出向）を実施することにより、従業員の雇用を維持した場合に助成する制度です。経済危機時や自然災害時にセーフティネットとして広く活用されます。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "休業手当等の2/3（大企業1/2）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/pageL07.html",
    categories: ["JINZAI_IKUSEI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "雇用調整",
      "休業",
      "雇用維持",
      "セーフティネット",
      "景気変動",
      "厚生労働省",
      "教育訓練",
    ],
    eligibilityCriteria: [
      "経済上の理由により事業活動の縮小を余儀なくされた事業主であること",
      "売上高又は生産量等が直近3か月の月平均で前年同期比10%以上減少していること",
      "雇用保険適用事業所の事業主であること",
      "労使間の協定に基づき休業等を実施していること",
      "休業手当を休業前賃金の60%以上支払っていること",
    ],
    excludedCases: [
      "事業活動の縮小が経済上の理由でない場合（季節的変動等）",
      "不正受給から5年以内の事業者",
      "労働保険料の滞納がある事業者",
      "風俗営業等の一部業種",
    ],
    requiredDocuments: [
      "休業等実施計画届",
      "支給申請書",
      "売上高等の減少を示す書類",
      "労使協定書",
      "休業・教育訓練の実績を示す書類（出勤簿等）",
    ],
    applicationSections: [
      {
        key: "business_situation",
        title: "事業活動の状況",
        description:
          "事業活動の縮小の原因、売上・生産量の推移、影響の程度を記載します。",
        group: "計画届",
        estimatedLength: "300〜500字",
      },
      {
        key: "adjustment_plan",
        title: "雇用調整の実施計画",
        description:
          "休業・教育訓練・出向の内容、対象者数、実施期間を記載します。",
        group: "計画届",
        estimatedLength: "300〜500字",
      },
      {
        key: "recovery_outlook",
        title: "事業回復の見通し",
        description:
          "事業活動の回復見通し、雇用調整終了後の雇用維持方針を記載します。",
        group: "計画届",
        estimatedLength: "200〜300字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 9,
    difficulty: "MEDIUM",
    isActive: true,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // 人への投資促進コース（人材開発支援助成金）
  // ============================================================
  {
    id: "hito-toushi-001",
    name: "人材開発支援助成金（人への投資促進コース）",
    nameShort: "人への投資促進コース",
    department: "厚生労働省",
    summary:
      "デジタル人材の育成やIT分野のリスキリング等、企業の人的資本投資を促進するための訓練を支援します。",
    description:
      "人材開発支援助成金の人への投資促進コースは、デジタル人材・高度人材の育成、労働者の自発的な能力開発の支援、定額制訓練（サブスクリプション型の研修サービス）の活用等を行った事業主に対して、訓練経費や賃金の一部を助成する制度です。DX推進やリスキリングの加速を目的としています。",
    maxAmount: 1500,
    minAmount: null,
    subsidyRate: "経費助成60%〜75%＋賃金助成",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html",
    categories: ["JINZAI_IKUSEI", "IT_DIGITAL"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "リスキリング",
      "DX人材",
      "デジタル",
      "人的資本",
      "サブスク研修",
      "高度人材",
      "厚生労働省",
      "自発的能力開発",
    ],
    eligibilityCriteria: [
      "雇用保険適用事業所の事業主であること",
      "デジタル・IT関連のスキル習得を目的とした訓練であること",
      "訓練時間が所定の基準以上であること",
      "訓練期間中の賃金を適正に支払っていること",
      "事業内職業能力開発計画を策定していること",
    ],
    excludedCases: [
      "訓練内容がデジタル・IT関連に該当しない場合",
      "受講者が事業主の親族のみの場合",
      "不正受給から5年以内の事業者",
      "労働保険料の滞納がある事業者",
    ],
    requiredDocuments: [
      "職業訓練実施計画届",
      "訓練カリキュラム（デジタル・IT関連であることが確認できるもの）",
      "支給申請書",
      "訓練経費の領収書",
      "受講者の出勤簿・賃金台帳",
    ],
    applicationSections: [
      {
        key: "digital_training_plan",
        title: "デジタル人材育成計画",
        description:
          "育成するデジタルスキルの内容、対象者の選定基準、訓練カリキュラムを記載します。",
        group: "計画届",
        estimatedLength: "400〜600字",
      },
      {
        key: "dx_strategy",
        title: "DX推進との連動",
        description:
          "自社のDX推進計画と人材育成の関連性、期待される効果を記載します。",
        group: "計画届",
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
];
