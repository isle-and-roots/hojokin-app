import type { SubsidyCategory, TargetIndustry, TargetScale, PromptSupport } from "@/types";

export const CATEGORY_LABELS: Record<SubsidyCategory, string> = {
  HANBAI_KAIKAKU: "販路開拓",
  IT_DIGITAL: "IT・デジタル化",
  SETSUBI_TOUSHI: "設備投資",
  KENKYUU_KAIHATSU: "研究開発",
  JINZAI_IKUSEI: "人材育成",
  CHIIKI_KASSEIKA: "地域活性化",
  SOUZOU_TENKAN: "事業再構築・転換",
  KANKYOU_ENERGY: "環境・省エネ",
  OTHER: "その他",
};

export const CATEGORY_COLORS: Record<SubsidyCategory, string> = {
  HANBAI_KAIKAKU: "bg-blue-100 text-blue-700",
  IT_DIGITAL: "bg-purple-100 text-purple-700",
  SETSUBI_TOUSHI: "bg-orange-100 text-orange-700",
  KENKYUU_KAIHATSU: "bg-teal-100 text-teal-700",
  JINZAI_IKUSEI: "bg-green-100 text-green-700",
  CHIIKI_KASSEIKA: "bg-amber-100 text-amber-700",
  SOUZOU_TENKAN: "bg-red-100 text-red-700",
  KANKYOU_ENERGY: "bg-emerald-100 text-emerald-700",
  OTHER: "bg-gray-100 text-gray-700",
};

export const INDUSTRY_LABELS: Record<TargetIndustry, string> = {
  SEIZOU: "製造業",
  KOURI: "小売業",
  INSHOKU: "飲食業",
  SERVICE: "サービス業",
  IT: "IT・情報通信",
  KENSETSU: "建設業",
  ALL: "業種不問",
};

export const SCALE_LABELS: Record<TargetScale, string> = {
  KOBOKIGYO: "小規模企業",
  CHUSHO: "中小企業",
  ALL: "規模不問",
};

export const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  EASY: { label: "比較的容易", color: "bg-green-100 text-green-700" },
  MEDIUM: { label: "標準", color: "bg-yellow-100 text-yellow-700" },
  HARD: { label: "高難度", color: "bg-red-100 text-red-700" },
};

export const PROMPT_SUPPORT_CONFIG: Record<
  PromptSupport,
  { label: string; color: string }
> = {
  FULL: { label: "AI完全対応", color: "bg-blue-100 text-blue-700" },
  GENERIC: { label: "AI対応", color: "bg-indigo-100 text-indigo-700" },
  NONE: { label: "AI未対応", color: "bg-gray-100 text-gray-500" },
};
