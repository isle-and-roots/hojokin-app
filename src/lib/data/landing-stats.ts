import { ALL_SUBSIDIES } from "@/lib/data/subsidies";
import { getAllSubsidiesFromDb } from "@/lib/db/subsidies";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  PROMPT_SUPPORT_CONFIG,
} from "@/lib/data/subsidy-categories";
import type { SubsidyCategory, SubsidyInfo, PromptSupport } from "@/types";

export interface CategoryStat {
  key: SubsidyCategory;
  label: string;
  count: number;
  aiCount: number;
  fullCount: number;
  topSubsidies: {
    name: string;
    nameShort: string;
    promptSupport: PromptSupport;
    maxAmount: number | null;
    subsidyRate: string;
  }[];
  colorClass: string;
}

const CATEGORY_ORDER: SubsidyCategory[] = [
  "HANBAI_KAIKAKU",
  "IT_DIGITAL",
  "SETSUBI_TOUSHI",
  "CHIIKI_KASSEIKA",
  "JINZAI_IKUSEI",
  "SOUZOU_TENKAN",
  "KANKYOU_ENERGY",
  "KENKYUU_KAIHATSU",
  "OTHER",
];

/** DB優先で全補助金を取得（フォールバック: 静的データ） */
async function resolveSubsidies(): Promise<SubsidyInfo[]> {
  try {
    const dbSubsidies = await getAllSubsidiesFromDb();
    if (dbSubsidies && dbSubsidies.length > 0) return dbSubsidies;
  } catch {
    // DB接続失敗時は静的データにフォールバック
  }
  return ALL_SUBSIDIES;
}

export async function getLandingStats() {
  const subsidies = await resolveSubsidies();
  const total = subsidies.length;
  const aiSupported = subsidies.filter(
    (s) => s.promptSupport !== "NONE"
  ).length;
  const fullSupport = subsidies.filter(
    (s) => s.promptSupport === "FULL"
  ).length;
  const categoryCount = CATEGORY_ORDER.length;

  const categories: CategoryStat[] = CATEGORY_ORDER.map((cat) => {
    const catSubsidies = subsidies.filter((s) => s.categories.includes(cat));
    const sorted = [...catSubsidies].sort((a, b) => b.popularity - a.popularity);
    return {
      key: cat,
      label: CATEGORY_LABELS[cat],
      count: catSubsidies.length,
      aiCount: catSubsidies.filter((s) => s.promptSupport !== "NONE").length,
      fullCount: catSubsidies.filter((s) => s.promptSupport === "FULL").length,
      topSubsidies: sorted.slice(0, 4).map((s) => ({
        name: s.name,
        nameShort: s.nameShort,
        promptSupport: s.promptSupport,
        maxAmount: s.maxAmount,
        subsidyRate: s.subsidyRate,
      })),
      colorClass: CATEGORY_COLORS[cat],
    };
  });

  const topSubsidies = [...subsidies]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  return {
    total,
    aiSupported,
    fullSupport,
    categoryCount,
    categories,
    topSubsidies,
    promptSupportConfig: PROMPT_SUPPORT_CONFIG,
    categoryLabels: CATEGORY_LABELS,
    categoryColors: CATEGORY_COLORS,
  };
}
