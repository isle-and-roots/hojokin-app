// === 企業プロフィール ===
export interface BusinessProfile {
  id: string;
  companyName: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
  industry: string;
  prefecture: string;
  employeeCount: number;
  annualRevenue: number | null;
  foundedYear: number | null;
  businessDescription: string;
  products: string;
  targetCustomers: string;
  salesChannels: string;
  strengths: string;
  challenges: string;
  recentRevenue: { year: number; amount: number }[] | null;
  recentProfit: { year: number; amount: number }[] | null;
  createdAt: string;
  updatedAt: string;
}

// === 補助金カテゴリ ===
export type SubsidyCategory =
  | "HANBAI_KAIKAKU"
  | "IT_DIGITAL"
  | "SETSUBI_TOUSHI"
  | "KENKYUU_KAIHATSU"
  | "JINZAI_IKUSEI"
  | "CHIIKI_KASSEIKA"
  | "SOUZOU_TENKAN"
  | "KANKYOU_ENERGY"
  | "OTHER";

export type TargetScale = "KOBOKIGYO" | "CHUSHO" | "ALL";

export type TargetIndustry =
  | "SEIZOU"
  | "KOURI"
  | "INSHOKU"
  | "SERVICE"
  | "IT"
  | "KENSETSU"
  | "ALL";

export type PromptSupport = "FULL" | "GENERIC" | "NONE";

// === 補助金申請セクション定義（汎用） ===
export interface SubsidySectionDefinition {
  key: string;
  title: string;
  description: string;
  group?: string;
  estimatedLength?: string;
}

// === 補助金情報 ===
export interface SubsidyInfo {
  id: string;
  name: string;
  nameShort: string;
  department: string;
  summary: string;
  description: string;
  maxAmount: number | null;
  minAmount: number | null;
  subsidyRate: string;
  deadline: string | null;
  applicationPeriod: { start: string; end: string | null } | null;
  url: string | null;
  categories: SubsidyCategory[];
  targetScale: TargetScale[];
  targetIndustries: TargetIndustry[];
  tags: string[];
  eligibilityCriteria: string[];
  excludedCases: string[];
  requiredDocuments: string[];
  applicationSections: SubsidySectionDefinition[];
  promptSupport: PromptSupport;
  subsidyType: SubsidyType;
  popularity: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isActive: boolean;
  lastUpdated: string;
}

// === 補助金検索 ===
export interface SubsidySearchFilters {
  keyword?: string;
  categories?: SubsidyCategory[];
  maxAmountRange?: { min?: number; max?: number };
  deadlineWithin?: number;
  difficulty?: ("EASY" | "MEDIUM" | "HARD")[];
  promptSupport?: PromptSupport[];
}

export interface SubsidySearchResult {
  items: SubsidyInfo[];
  total: number;
}

// === 補助金申請 ===
export type SubsidyType =
  | "JIZOKUKA"
  | "IT_DONYU"
  | "JIGYOU_SAIKOUCHIKU"
  | "MONODZUKURI"
  | "SHOURYOKUKA"
  | "SHINJIGYO_SHINSHUTSU"
  | "SEICHOU_KASOKUKA"
  | "OTHER";

export type ApplicationStatus =
  | "DRAFT"
  | "GENERATING"
  | "REVIEW"
  | "READY"
  | "SUBMITTED"
  | "ADOPTED"
  | "REJECTED"
  | "REPORTING"
  | "COMPLETED";

export interface SubsidyApplication {
  id: string;
  profileId: string;
  subsidyId?: string;
  subsidyType: SubsidyType;
  subsidyName: string;
  status: ApplicationStatus;
  applicationCategory: string | null;
  requestedAmount: number | null;
  deadline: string | null;
  submittedAt: string | null;
  result: "ADOPTED" | "REJECTED" | "PENDING" | null;
  sections: DocumentSection[];
  createdAt: string;
  updatedAt: string;
}

// === 文書セクション ===
export interface DocumentSection {
  id: string;
  applicationId: string;
  sectionKey: string;
  sectionTitle: string;
  orderIndex: number;
  aiGeneratedContent: string;
  userEditedContent: string | null;
  finalContent: string | null;
  modelUsed: string | null;
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// === 持続化補助金セクション定義 ===
export const JIZOKUKA_SECTIONS = [
  {
    key: "company_overview",
    title: "1. 企業概要",
    form: "yoshiki2",
    description: "事業者の基本情報、沿革、主な商品・サービス、組織体制",
  },
  {
    key: "customer_needs_market",
    title: "2. 顧客ニーズと市場の動向",
    form: "yoshiki2",
    description: "顧客ニーズ分析、市場トレンド、競合状況",
  },
  {
    key: "strengths",
    title: "3. 自社や自社の提供する商品・サービスの強み",
    form: "yoshiki2",
    description: "自社の強み、差別化要素、競争優位性",
  },
  {
    key: "management_plan",
    title: "4. 経営方針・目標と今後のプラン",
    form: "yoshiki2",
    description: "経営方針、数値目標、アクションプラン",
  },
  {
    key: "project_name",
    title: "1. 補助事業で行う事業名",
    form: "yoshiki3",
    description: "補助事業の名称（30文字以内で簡潔に）",
  },
  {
    key: "sales_expansion_plan",
    title: "2. 販路開拓等の取組内容",
    form: "yoshiki3",
    description: "販路拡大のための具体的な取り組み内容",
  },
  {
    key: "efficiency_plan",
    title: "3. 業務効率化（生産性向上）の取組内容",
    form: "yoshiki3",
    description: "業務効率化のための具体的な施策",
  },
  {
    key: "expected_effects",
    title: "4. 補助事業の効果",
    form: "yoshiki3",
    description: "期待される定量的・定性的な効果",
  },
] as const;

export type JizokukaSectionKey = (typeof JIZOKUKA_SECTIONS)[number]["key"];

// === 補助金レコメンド ===
export interface MatchReason {
  key: string;
  label: string;
  score: number;
  detail?: string;
}

export interface ScoredSubsidy {
  subsidy: SubsidyInfo;
  totalScore: number;
  reasons: MatchReason[];
}

export interface RecommendationResult {
  items: ScoredSubsidy[];
  profileCompleteness: number;
}

// === AI生成リクエスト ===
export interface GenerateSectionRequest {
  profileId: string;
  applicationId: string;
  sectionKey: string;
  subsidyId?: string;
  additionalContext?: string;
}

export interface GenerateSectionResponse {
  content: string;
  modelUsed: string;
}
