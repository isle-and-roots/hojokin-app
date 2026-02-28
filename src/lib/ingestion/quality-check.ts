/**
 * 補助金データ品質チェック
 *
 * 自動取込データの妥当性を検証する。
 */

import type { SubsidyInfo } from "@/types";

export interface QualityCheckResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
}

const VALID_CATEGORIES = [
  "HANBAI_KAIKAKU", "IT_DIGITAL", "SETSUBI_TOUSHI", "KENKYUU_KAIHATSU",
  "JINZAI_IKUSEI", "CHIIKI_KASSEIKA", "SOUZOU_TENKAN", "KANKYOU_ENERGY", "OTHER",
];
const VALID_SCALES = ["KOBOKIGYO", "CHUSHO", "ALL"];
const VALID_INDUSTRIES = ["SEIZOU", "KOURI", "INSHOKU", "SERVICE", "IT", "KENSETSU", "ALL"];
const VALID_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const VALID_PROMPT_SUPPORTS = ["FULL", "GENERIC", "NONE"];

/**
 * 単一の補助金データの品質チェック
 */
export function checkSubsidyQuality(subsidy: SubsidyInfo): QualityCheckResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // 必須フィールド存在チェック
  if (!subsidy.id) errors.push("idが空です");
  if (!subsidy.name) errors.push("nameが空です");
  if (!subsidy.nameShort) errors.push("nameShortが空です");
  if (!subsidy.department) errors.push("departmentが空です");
  if (!subsidy.summary) errors.push("summaryが空です");
  if (!subsidy.description) errors.push("descriptionが空です");
  if (!subsidy.subsidyRate) errors.push("subsidyRateが空です");

  // enum値の妥当性チェック
  for (const cat of subsidy.categories) {
    if (!VALID_CATEGORIES.includes(cat)) {
      errors.push(`不正なカテゴリ: ${cat}`);
    }
  }
  for (const scale of subsidy.targetScale) {
    if (!VALID_SCALES.includes(scale)) {
      errors.push(`不正な規模: ${scale}`);
    }
  }
  for (const ind of subsidy.targetIndustries) {
    if (!VALID_INDUSTRIES.includes(ind)) {
      errors.push(`不正な業種: ${ind}`);
    }
  }
  if (!VALID_DIFFICULTIES.includes(subsidy.difficulty)) {
    errors.push(`不正な難易度: ${subsidy.difficulty}`);
  }
  if (!VALID_PROMPT_SUPPORTS.includes(subsidy.promptSupport)) {
    errors.push(`不正なpromptSupport: ${subsidy.promptSupport}`);
  }

  // 配列が空でないことの確認（警告レベル）
  if (subsidy.categories.length === 0) warnings.push("categoriesが空です");
  if (subsidy.targetScale.length === 0) warnings.push("targetScaleが空です");
  if (subsidy.targetIndustries.length === 0) warnings.push("targetIndustriesが空です");

  // 金額の妥当性チェック
  if (subsidy.maxAmount !== null) {
    if (subsidy.maxAmount < 0) errors.push(`負の上限額: ${subsidy.maxAmount}`);
    if (subsidy.maxAmount > 1000000) warnings.push(`非常に高額: ${subsidy.maxAmount}万円`);
  }
  if (subsidy.minAmount !== null && subsidy.maxAmount !== null) {
    if (subsidy.minAmount > subsidy.maxAmount) {
      errors.push(`最小額が最大額を超過: ${subsidy.minAmount} > ${subsidy.maxAmount}`);
    }
  }

  // 日付チェック
  if (subsidy.deadline) {
    const deadlineDate = new Date(subsidy.deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.push(`不正な締切日: ${subsidy.deadline}`);
    }
  }

  // 人気度範囲チェック
  if (subsidy.popularity < 0 || subsidy.popularity > 10) {
    warnings.push(`人気度が範囲外: ${subsidy.popularity}`);
  }

  return {
    passed: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * 金額の異常変動を検知
 * 前回値との比較で50%以上の変動があれば警告
 */
export function checkAmountAnomaly(
  newAmount: number | null,
  previousAmount: number | null
): { anomaly: boolean; detail?: string } {
  if (newAmount === null || previousAmount === null || previousAmount === 0) {
    return { anomaly: false };
  }

  const changeRatio = Math.abs(newAmount - previousAmount) / previousAmount;
  if (changeRatio >= 0.5) {
    return {
      anomaly: true,
      detail: `金額が${Math.round(changeRatio * 100)}%変動 (${previousAmount}万円→${newAmount}万円)`,
    };
  }

  return { anomaly: false };
}
