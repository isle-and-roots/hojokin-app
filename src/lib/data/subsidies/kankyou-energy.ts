import type { SubsidyInfo } from "@/types";

/**
 * 環境・省エネカテゴリの補助金データ
 * KANKYOU_ENERGY - 省エネ・脱炭素・GX・環境対策
 */
export const kankyouEnergySubsidies: SubsidyInfo[] = [
  // ============================================================
  // 省エネルギー投資促進支援事業費補助金
  // ============================================================
  {
    id: "shouene-001",
    name: "省エネルギー投資促進支援事業費補助金",
    nameShort: "省エネ補助金",
    department: "経済産業省・資源エネルギー庁",
    summary:
      "工場・事業場等における省エネルギー設備への更新等を支援し、エネルギー消費効率の改善を促進します。",
    description:
      "省エネルギー投資促進支援事業費補助金は、事業者が行う省エネルギー設備への更新や、省エネ取組の強化に資する設備導入を支援する制度です。先進事業、オーダーメイド型事業、指定設備導入事業、エネルギー需要最適化対策事業の4つの区分があり、高効率空調、LED照明、高効率ボイラー等の導入に活用できます。SII（一般社団法人環境共創イニシアチブ）が執行団体です。",
    maxAmount: 10000,
    minAmount: 100,
    subsidyRate: "1/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-01", end: "2026-06-30" },
    url: "https://sii.or.jp/",
    categories: ["KANKYOU_ENERGY", "SETSUBI_TOUSHI"],
    targetScale: ["ALL"],
    targetIndustries: ["SEIZOU", "KOURI", "SERVICE", "KENSETSU", "ALL"],
    tags: [
      "省エネ",
      "エネルギー",
      "カーボンニュートラル",
      "LED",
      "空調",
      "環境",
      "設備更新",
      "SII",
    ],
    eligibilityCriteria: [
      "日本国内で事業活動を営む法人または個人事業主であること",
      "省エネルギー設備への更新等を行う事業であること",
      "省エネルギー効果が確認できる計画であること",
      "エネルギー管理を適切に行っていること（エネルギー使用量の把握等）",
    ],
    excludedCases: [
      "専ら居住の用に供する設備の更新",
      "中古品の購入",
      "リースまたはレンタルによる設備導入（一部例外あり）",
      "既に発注・契約済みの設備の導入",
    ],
    requiredDocuments: [
      "交付申請書",
      "省エネルギー計算書",
      "設備の仕様書・カタログ",
      "設備の見積書（複数社）",
      "エネルギー使用量の実績データ",
      "建物・工場の図面（設備配置図）",
    ],
    applicationSections: [
      {
        key: "energy_usage",
        title: "エネルギー使用状況",
        description:
          "現在のエネルギー使用量、設備の老朽化状況、エネルギーコストを記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "equipment_plan",
        title: "導入設備の概要と省エネ効果",
        description:
          "更新する設備の仕様、省エネルギー計算の根拠、CO2削減量を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "implementation_detail",
        title: "実施計画と工事スケジュール",
        description:
          "設備導入の工事スケジュール、施工体制、稼働開始時期を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
      },
      {
        key: "monitoring_plan",
        title: "省エネ効果の検証計画",
        description:
          "導入後の省エネ効果の計測方法、モニタリング体制、報告計画を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜400字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "HARD",
    isActive: false,
    lastUpdated: "2026-02-23",
  },

  // ============================================================
  // GXリーグ・GX経営促進支援事業
  // ============================================================
  {
    id: "gx-keiei-001",
    name: "中小企業等のカーボンニュートラル推進支援事業",
    nameShort: "GX推進支援",
    department: "経済産業省・中小企業庁",
    summary:
      "中小企業等がカーボンニュートラルに向けたCO2排出量の把握・削減計画の策定を支援します。",
    description:
      "中小企業等のカーボンニュートラル推進支援事業は、グリーントランスフォーメーション（GX）を推進するため、中小企業等のCO2排出量の算定（見える化）、削減計画の策定、省エネ・再エネ設備の導入等を一体的に支援する事業です。専門家によるCO2排出量の診断（カーボンフットプリント算定支援）や、SBT（Science Based Targets）等の国際認証取得支援も含まれます。サプライチェーン全体の脱炭素化に貢献する中小企業の取り組みを後押しします。",
    maxAmount: 500,
    minAmount: null,
    subsidyRate: "2/3",
    deadline: "2026-09-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-09-30" },
    url: "https://www.chusho.meti.go.jp/koukai/yosan/",
    categories: ["KANKYOU_ENERGY"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "KOURI", "SERVICE", "ALL"],
    tags: [
      "GX",
      "カーボンニュートラル",
      "CO2削減",
      "脱炭素",
      "見える化",
      "サプライチェーン",
      "SBT",
    ],
    eligibilityCriteria: [
      "中小企業基本法に定める中小企業者等であること",
      "CO2排出量の削減に取り組む意欲があること",
      "削減計画を策定し実行する体制を整備すること",
      "取り組み成果を公表・共有することに同意すること",
    ],
    excludedCases: [
      "大企業に該当する者",
      "CO2排出量の算定対象外となる事業のみの場合",
      "既にSBT等の認証を取得済みで追加の取り組みがない場合",
    ],
    requiredDocuments: [
      "交付申請書",
      "CO2排出量の現状データ",
      "削減計画書",
      "見積書（設備導入の場合）",
    ],
    applicationSections: [
      {
        key: "current_emissions",
        title: "現在のCO2排出状況",
        description:
          "事業活動に伴うCO2排出量の現状と排出源の内訳を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "reduction_plan",
        title: "CO2削減計画",
        description:
          "削減目標、具体的な削減施策、導入設備の概要を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "gx_implementation",
        title: "実施体制とスケジュール",
        description:
          "GX推進の体制、スケジュール、モニタリング方法を記載します。",
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
  // 再生可能エネルギー事業者支援事業費補助金
  // ============================================================
  {
    id: "saiene-001",
    name: "再生可能エネルギー事業者支援事業費補助金",
    nameShort: "再エネ事業者支援",
    department: "環境省",
    summary:
      "太陽光・風力・バイオマス等の再生可能エネルギー発電設備の導入を支援します。",
    description:
      "再生可能エネルギー事業者支援事業費補助金は、環境省が実施する再生可能エネルギー設備の導入支援制度です。自家消費型の太陽光発電設備、蓄電池、バイオマス発電設備等の導入に対して補助金が交付されます。特に自家消費型・地域消費型の再エネ設備導入を優遇し、FIT/FIP制度に依存しない自律的な再エネ普及を目指しています。中小企業や自治体等が対象で、PPA（電力購入契約）モデルによる導入も対象となります。",
    maxAmount: 15000,
    minAmount: null,
    subsidyRate: "1/3〜1/2",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-15", end: "2026-06-30" },
    url: "https://www.env.go.jp/earth/earth/ondanka/biz_local.html",
    categories: ["KANKYOU_ENERGY", "SETSUBI_TOUSHI"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "再生可能エネルギー",
      "太陽光発電",
      "蓄電池",
      "自家消費",
      "PPA",
      "脱炭素",
      "環境省",
    ],
    eligibilityCriteria: [
      "日本国内で事業活動を営む法人、地方公共団体等であること",
      "自家消費型または地域消費型の再生可能エネルギー設備を導入すること",
      "CO2排出削減効果が見込まれること",
      "設備の適切な維持管理体制を確保すること",
    ],
    excludedCases: [
      "FIT/FIP認定を受ける設備（全量売電型）",
      "中古設備の導入",
      "既に発注・契約済みの設備",
      "住宅用の小規模太陽光パネル（別制度対象）",
    ],
    requiredDocuments: [
      "交付申請書",
      "設備仕様書・カタログ",
      "設備の見積書（2社以上）",
      "CO2削減効果の算定書",
      "電力使用量の実績データ",
    ],
    applicationSections: [
      {
        key: "current_energy",
        title: "現在のエネルギー使用状況",
        description:
          "電力使用量、電力コスト、CO2排出量の現状を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "renewable_plan",
        title: "再エネ設備導入計画",
        description:
          "導入する再エネ設備の種類・規模、設置場所、発電量見込みを記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "co2_reduction_effect",
        title: "CO2削減効果",
        description:
          "設備導入によるCO2削減量の算定根拠と効果を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜500字",
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
  // 脱炭素化促進支援事業費補助金（地域脱炭素移行・再エネ推進交付金）
  // ============================================================
  {
    id: "datsutanso-001",
    name: "地域脱炭素移行・再エネ推進交付金",
    nameShort: "地域脱炭素交付金",
    department: "環境省",
    summary:
      "地方公共団体と連携して脱炭素に取り組む中小企業等に対し、設備導入費用等を支援します。",
    description:
      "地域脱炭素移行・再エネ推進交付金は、2050年カーボンニュートラルに向けて、地域の脱炭素を推進するための交付金制度です。脱炭素先行地域に選定された地方公共団体と連携する形で、地域の中小企業も設備導入等の支援を受けることができます。重点対策加速化事業として、自家消費型太陽光発電、建築物のZEB化、省エネ設備の導入等が対象です。地方自治体を通じた間接補助の形式が一般的です。",
    maxAmount: 20000,
    minAmount: null,
    subsidyRate: "1/2〜2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-01-15", end: "2026-06-30" },
    url: "https://policies.env.go.jp/policy/roadmap/grants/",
    categories: ["KANKYOU_ENERGY", "CHIIKI_KASSEIKA"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "脱炭素",
      "地域脱炭素",
      "再エネ",
      "ZEB",
      "交付金",
      "カーボンニュートラル",
      "環境省",
    ],
    eligibilityCriteria: [
      "脱炭素先行地域に選定された地方公共団体と連携すること（重点対策は全自治体対象）",
      "脱炭素に資する設備導入等を行う事業であること",
      "地域の脱炭素化に貢献する取り組みであること",
      "事業計画の効果測定・報告を行うこと",
    ],
    excludedCases: [
      "脱炭素に関連しない設備投資",
      "地方公共団体との連携がない民間単独事業（脱炭素先行地域の場合）",
      "全量売電型の再エネ設備",
    ],
    requiredDocuments: [
      "交付申請書",
      "事業計画書",
      "CO2削減効果の算定書",
      "地方公共団体との連携を示す書類",
      "設備の見積書",
    ],
    applicationSections: [
      {
        key: "regional_context",
        title: "地域の脱炭素に向けた課題",
        description:
          "地域における脱炭素の現状と課題を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "decarbonization_plan",
        title: "脱炭素化の取り組み内容",
        description:
          "導入設備の内容、CO2削減計画、地域への波及効果を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
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
  // EV充電設備導入補助金（クリーンエネルギー自動車導入促進補助金）
  // ============================================================
  {
    id: "ev-juuden-001",
    name: "クリーンエネルギー自動車の普及促進に向けた充電・充てんインフラ等導入促進補助金",
    nameShort: "EV充電設備補助金",
    department: "経済産業省",
    summary:
      "電気自動車（EV）等の充電設備・水素充てん設備の導入費用を補助します。",
    description:
      "クリーンエネルギー自動車の普及促進に向けた充電・充てんインフラ等導入促進補助金は、電気自動車（EV）・プラグインハイブリッド車（PHEV）用の充電設備や、燃料電池自動車（FCV）用の水素充てん設備の導入を支援する制度です。事業所・商業施設・宿泊施設・マンション等への充電設備設置が対象で、設備費と工事費の一部が補助されます。次世代自動車振興センターが執行団体です。",
    maxAmount: 3000,
    minAmount: null,
    subsidyRate: "1/2",
    deadline: "2026-09-30",
    applicationPeriod: { start: "2026-04-01", end: "2026-09-30" },
    url: "https://www.cev-pc.or.jp/",
    categories: ["KANKYOU_ENERGY", "SETSUBI_TOUSHI"],
    targetScale: ["ALL"],
    targetIndustries: ["KOURI", "SERVICE", "ALL"],
    tags: [
      "EV",
      "電気自動車",
      "充電設備",
      "水素",
      "クリーンエネルギー",
      "脱炭素",
      "インフラ",
    ],
    eligibilityCriteria: [
      "法人、地方公共団体、個人事業主等であること",
      "充電設備・充てん設備を公共性のある場所に設置すること",
      "設備の適切な維持管理を行う体制があること",
      "一定期間（原則5年間）設備を継続使用すること",
    ],
    excludedCases: [
      "個人の自宅の専用駐車場への設置（一般開放しない場合）",
      "中古の充電設備の導入",
      "既に発注・設置済みの設備",
    ],
    requiredDocuments: [
      "交付申請書",
      "充電設備の仕様書・カタログ",
      "設置工事の見積書",
      "設置場所の図面・写真",
      "土地・建物の所有権または使用権を示す書類",
    ],
    applicationSections: [
      {
        key: "installation_plan",
        title: "設置計画の概要",
        description:
          "設置場所、設置基数、設備の種類・仕様を記載します。",
        group: "申請書",
        estimatedLength: "300〜500字",
      },
      {
        key: "usage_projection",
        title: "利用見込み",
        description:
          "充電設備の利用者数見込み、稼働率の予測を記載します。",
        group: "申請書",
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
  // ZEB/ZEH化支援事業
  // ============================================================
  {
    id: "zeb-zeh-001",
    name: "建築物等の脱炭素化・レジリエンス強化促進事業（ZEB実現に向けた先進的省エネルギー建築物実証事業）",
    nameShort: "ZEB補助金",
    department: "環境省・経済産業省",
    summary:
      "新築・既存建築物のZEB（ネット・ゼロ・エネルギー・ビル）化を支援します。",
    description:
      "ZEB実現に向けた先進的省エネルギー建築物実証事業は、中小企業等が所有・使用する建築物のZEB化（高断熱化、高効率設備導入、再エネ活用等による年間エネルギー消費量の大幅削減）を支援する制度です。新築だけでなく、既存建築物の改修によるZEB化も対象です。ZEB Ready（50%以上省エネ）、Nearly ZEB（75%以上省エネ）、ZEB（100%以上省エネ）の段階に応じて補助率が異なります。",
    maxAmount: 50000,
    minAmount: null,
    subsidyRate: "1/3〜2/3",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-01", end: "2026-06-30" },
    url: "https://www.env.go.jp/earth/zeb.html",
    categories: ["KANKYOU_ENERGY", "SETSUBI_TOUSHI"],
    targetScale: ["ALL"],
    targetIndustries: ["KENSETSU", "SERVICE", "KOURI", "ALL"],
    tags: [
      "ZEB",
      "省エネ建築",
      "脱炭素",
      "高断熱",
      "再エネ",
      "建物改修",
      "環境省",
    ],
    eligibilityCriteria: [
      "日本国内の建築物を対象とした事業であること",
      "ZEB Ready以上の省エネ性能を達成する計画であること",
      "エネルギー計算書等でZEB達成見込みを示せること",
      "事業完了後のエネルギーモニタリングを行うこと",
    ],
    excludedCases: [
      "住宅（ZEHは別制度の対象）",
      "ZEB Readyの基準を満たさない改修",
      "既に着工済みの建築物",
      "エネルギー計算の根拠が不明確な場合",
    ],
    requiredDocuments: [
      "交付申請書",
      "建築物のエネルギー計算書（WEBPRO等）",
      "設計図書（平面図、断面図、設備図）",
      "工事見積書（複数社）",
      "省エネ性能の第三者評価書（BELSなど）",
    ],
    applicationSections: [
      {
        key: "building_overview",
        title: "建築物の概要",
        description:
          "対象建築物の用途、規模、現在のエネルギー消費状況を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "zeb_measures",
        title: "ZEB化の具体的手法",
        description:
          "断熱強化、高効率設備、再エネ導入等の具体的な省エネ手法を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "energy_calculation",
        title: "エネルギー計算結果",
        description:
          "省エネ計算の結果、ZEB達成見込み、CO2削減量を記載します。",
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
  // グリーンリカバリー・脱炭素化等支援事業（グリーン成長戦略関連）
  // ============================================================
  {
    id: "green-growth-001",
    name: "中小企業等エネルギー利用最適化推進事業費補助金",
    nameShort: "エネルギー最適化補助金",
    department: "経済産業省・資源エネルギー庁",
    summary:
      "中小企業のエネルギー管理体制の構築とエネルギー利用の最適化を支援します。",
    description:
      "中小企業等エネルギー利用最適化推進事業費補助金は、中小企業等がエネルギー管理支援サービス（エネマネ）を活用してエネルギー利用の最適化を図る取り組みを支援する制度です。エネルギー管理システム（EMS・BEMS・FEMS等）の導入と、それに伴う省エネ設備の更新を一体的に支援します。エネルギー利用状況の見える化から始まり、最適制御によるエネルギー使用量の削減を目指します。",
    maxAmount: 5000,
    minAmount: 100,
    subsidyRate: "1/3〜1/2",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-01", end: "2026-06-30" },
    url: "https://sii.or.jp/",
    categories: ["KANKYOU_ENERGY"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "KOURI", "SERVICE", "ALL"],
    tags: [
      "エネルギー管理",
      "EMS",
      "BEMS",
      "見える化",
      "最適制御",
      "省エネ",
      "SII",
    ],
    eligibilityCriteria: [
      "中小企業者等であること",
      "エネルギー管理支援サービスを活用した事業であること",
      "EMS等の導入と省エネ設備の更新を一体的に行うこと",
      "導入後のエネルギー削減効果を報告すること",
    ],
    excludedCases: [
      "EMS導入のみで省エネ設備の更新を伴わない場合",
      "大企業に該当する者",
      "既に導入済みのシステムの更新のみ",
    ],
    requiredDocuments: [
      "交付申請書",
      "エネルギー使用量の実績データ",
      "EMS・省エネ設備の仕様書",
      "見積書（複数社）",
      "省エネ効果の計算書",
    ],
    applicationSections: [
      {
        key: "energy_management_current",
        title: "現在のエネルギー管理状況",
        description:
          "現在のエネルギー管理体制、使用量、コストの状況を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜500字",
      },
      {
        key: "ems_introduction_plan",
        title: "EMS導入計画",
        description:
          "導入するEMSの概要、連携する省エネ設備、最適制御の内容を記載します。",
        group: "事業計画書",
        estimatedLength: "500〜700字",
      },
      {
        key: "optimization_effect",
        title: "エネルギー最適化の効果",
        description:
          "導入後のエネルギー削減量・削減率の見込みを記載します。",
        group: "事業計画書",
        estimatedLength: "300〜400字",
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
  // クリーンエネルギー自動車導入促進補助金（CEV補助金）
  // ============================================================
  {
    id: "cev-001",
    name: "クリーンエネルギー自動車導入促進補助金",
    nameShort: "CEV補助金",
    department: "経済産業省",
    summary:
      "電気自動車（EV）・プラグインハイブリッド車（PHEV）・燃料電池車（FCV）等の購入費用を補助します。",
    description:
      "クリーンエネルギー自動車導入促進補助金（CEV補助金）は、電気自動車（EV）、プラグインハイブリッド車（PHEV）、燃料電池車（FCV）、超小型モビリティの購入に対して補助金を交付する制度です。個人・法人問わず利用可能で、中小企業の社用車のEV化にも活用できます。補助額は車種により異なり、EVで最大85万円、軽EVで最大55万円が補助されます。次世代自動車振興センターが執行団体です。",
    maxAmount: 85,
    minAmount: null,
    subsidyRate: "定額（車種別）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.cev-pc.or.jp/",
    categories: ["KANKYOU_ENERGY"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [
      "EV",
      "電気自動車",
      "PHEV",
      "FCV",
      "脱炭素",
      "車両購入",
      "通年申請",
    ],
    eligibilityCriteria: [
      "対象車両を新車で購入する個人・法人であること",
      "自家用として使用すること（レンタカー・リースは別要件）",
      "一定期間（原則4年間）保有すること",
      "初度登録から1か月以内に申請すること",
    ],
    excludedCases: [
      "中古車の購入",
      "対象車種リストに掲載されていない車両",
      "転売目的での購入",
      "補助金交付前に処分する場合",
    ],
    requiredDocuments: [
      "補助金交付申請書",
      "車検証の写し",
      "注文書または売買契約書",
      "領収書の写し",
    ],
    applicationSections: [
      {
        key: "vehicle_info",
        title: "導入車両の情報",
        description:
          "購入する車両の車種、型式、購入先、購入金額を記載します。",
        group: "交付申請書",
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
  // 中小企業等に向けた省エネルギー診断
  // ============================================================
  {
    id: "shouene-shindan-001",
    name: "中小企業等に向けた省エネルギー診断事業",
    nameShort: "省エネ診断",
    department: "経済産業省・省エネルギーセンター",
    summary:
      "中小企業等の工場・ビルに専門家を派遣し、無料で省エネルギー診断を実施します。",
    description:
      "中小企業等に向けた省エネルギー診断事業は、一般財団法人省エネルギーセンターが実施する無料の省エネ診断サービスです。エネルギー管理の専門家が中小企業の工場やオフィスビルを訪問し、エネルギー使用状況の調査・分析を行い、具体的な省エネ改善提案を報告書として取りまとめます。省エネ補助金の申請に先立つ現状把握として活用されることが多く、省エネ投資の費用対効果の検討に有効です。",
    maxAmount: null,
    minAmount: null,
    subsidyRate: "—（無料）",
    deadline: null,
    applicationPeriod: null,
    url: "https://www.eccj.or.jp/shindan/",
    categories: ["KANKYOU_ENERGY"],
    targetScale: ["KOBOKIGYO", "CHUSHO"],
    targetIndustries: ["SEIZOU", "KOURI", "SERVICE", "KENSETSU", "ALL"],
    tags: [
      "省エネ診断",
      "無料",
      "専門家派遣",
      "エネルギー管理",
      "省エネセンター",
      "通年対応",
    ],
    eligibilityCriteria: [
      "中小企業者等であること",
      "工場・事業所・ビル等でエネルギーを使用していること",
      "省エネルギーに取り組む意欲があること",
    ],
    excludedCases: [
      "大企業に該当する者",
      "住宅のみの省エネ診断",
      "エネルギーをほとんど使用しない事業所",
    ],
    requiredDocuments: [
      "省エネ診断申込書",
      "エネルギー使用量の概要データ",
      "事業所の概要（図面等）",
    ],
    applicationSections: [
      {
        key: "facility_overview",
        title: "事業所の概要",
        description:
          "事業所の業種、規模、主要設備の概要を記載します。",
        group: "診断申込書",
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
  // 工場・事業場における先導的な脱炭素化取組推進事業（SHIFT事業）
  // ============================================================
  {
    id: "shift-001",
    name: "工場・事業場における先導的な脱炭素化取組推進事業（SHIFT事業）",
    nameShort: "SHIFT事業",
    department: "環境省",
    summary:
      "工場・事業場のCO2排出量削減のための設備更新・運用改善を支援します。",
    description:
      "SHIFT事業（Support for High-efficiency Improvement of Factory's Transition）は、環境省が実施する工場・事業場の脱炭素化を支援する事業です。CO2排出量の算定（SHIFTプラン策定支援）から、削減設備の導入（設備更新補助）まで一貫して支援します。年間CO2排出量50トン以上の工場・事業場が対象で、CO2排出量を30%以上削減する「先導的」な取り組みに対して高い補助率が適用されます。",
    maxAmount: 10000,
    minAmount: null,
    subsidyRate: "1/3〜1/2",
    deadline: "2026-06-30",
    applicationPeriod: { start: "2026-03-01", end: "2026-06-30" },
    url: "https://www.env.go.jp/earth/earth/ondanka/shift/",
    categories: ["KANKYOU_ENERGY", "SETSUBI_TOUSHI"],
    targetScale: ["ALL"],
    targetIndustries: ["SEIZOU", "KENSETSU", "ALL"],
    tags: [
      "SHIFT",
      "脱炭素",
      "CO2削減",
      "工場",
      "設備更新",
      "環境省",
      "先導的",
    ],
    eligibilityCriteria: [
      "年間CO2排出量が50トン以上の工場・事業場を保有すること",
      "CO2排出量の削減計画を策定すること",
      "削減設備の導入により30%以上のCO2削減を目指すこと（先導的事業の場合）",
      "事業完了後のモニタリングを行うこと",
    ],
    excludedCases: [
      "年間CO2排出量が50トン未満の事業場",
      "CO2削減効果が見込まれない設備更新",
      "既に発注・契約済みの設備",
      "住宅や個人所有の建物",
    ],
    requiredDocuments: [
      "交付申請書",
      "CO2排出量の算定書",
      "脱炭素化計画書",
      "設備の仕様書・見積書",
      "工場・事業場のエネルギー使用実績",
    ],
    applicationSections: [
      {
        key: "factory_emissions",
        title: "工場・事業場のCO2排出状況",
        description:
          "対象事業場のCO2排出量、主要排出源、エネルギー使用内訳を記載します。",
        group: "事業計画書",
        estimatedLength: "400〜600字",
      },
      {
        key: "decarbonization_measures",
        title: "脱炭素化の具体的措置",
        description:
          "導入設備、運用改善の内容、CO2削減量の算定を記載します。",
        group: "事業計画書",
        estimatedLength: "600〜800字",
      },
      {
        key: "monitoring_reporting",
        title: "モニタリング・報告計画",
        description:
          "導入後のCO2排出量の計測方法と報告体制を記載します。",
        group: "事業計画書",
        estimatedLength: "300〜400字",
      },
    ],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 4,
    difficulty: "HARD",
    isActive: true,
    lastUpdated: "2026-02-23",
  },
];
