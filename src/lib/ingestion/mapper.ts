/**
 * jGrants APIレスポンス → SubsidyInfo 直接マッピング
 *
 * AIを使わずに機械的にマッピングできるフィールドを処理する。
 * AI抽出が必要なフィールドは ai-extractor.ts で補完する。
 */

import type { JGrantsSubsidyDetail } from "@/lib/external/jgrants";
import type { SubsidyInfo } from "@/types";

/** jGrants IDから内部IDを生成 */
export function toInternalId(jgrantsId: string): string {
  return `jg-${jgrantsId.replace(/[^a-zA-Z0-9-]/g, "")}`;
}

/** 金額をパース（万円単位で返却） */
function parseAmount(amount: number | string | null): number | null {
  if (amount === null || amount === undefined) return null;

  // 数値型の場合: 円単位 → 万円に変換
  if (typeof amount === "number") {
    if (amount <= 0) return null;
    return Math.round(amount / 10000);
  }

  // 文字列型の場合: 「1,000万円」「100万円」「5億円」などをパース
  const cleaned = amount.replace(/[,、\s]/g, "");

  // 億円
  const okuMatch = cleaned.match(/(\d+(?:\.\d+)?)億円/);
  if (okuMatch) return Math.round(parseFloat(okuMatch[1]) * 10000);

  // 万円
  const manMatch = cleaned.match(/(\d+(?:\.\d+)?)万円/);
  if (manMatch) return Math.round(parseFloat(manMatch[1]));

  // 円（万円に変換）
  const enMatch = cleaned.match(/(\d+)円/);
  if (enMatch) {
    const yen = parseInt(enMatch[1], 10);
    if (yen >= 10000) return Math.round(yen / 10000);
  }

  // 数値のみ（円とみなす）
  const numOnly = parseInt(cleaned, 10);
  if (!isNaN(numOnly) && numOnly > 0) {
    return numOnly >= 10000 ? Math.round(numOnly / 10000) : numOnly;
  }

  return null;
}

/** 日付文字列をISO形式に変換 */
function parseDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split("T")[0];
  } catch {
    return null;
  }
}

/** nameShortを生成（40文字以内に切り詰め） */
function generateShortName(name: string): string {
  // よくある接頭辞を除去して短縮
  const cleaned = name
    .replace(/令和\d+年度\s*/, "")
    .replace(/（第\d+次.*?）/, "")
    .replace(/補正予算\s*/, "");

  if (cleaned.length <= 40) return cleaned;
  return cleaned.substring(0, 37) + "...";
}

/**
 * jGrants詳細レスポンスからSubsidyInfoの基本フィールドを生成
 *
 * AI抽出が必要なフィールドはデフォルト値を設定。
 * 後続の ai-extractor で上書きされる。
 */
export function mapJGrantsToPartialSubsidy(
  detail: JGrantsSubsidyDetail
): SubsidyInfo {
  const id = toInternalId(detail.id);
  const deadline = parseDate(detail.acceptance_end_datetime);

  return {
    id,
    name: detail.title || detail.name || "名称不明",
    nameShort: generateShortName(detail.title || detail.name || "名称不明"),
    department: detail.competent_authority || "不明",
    summary: truncate(detail.detail || detail.title || "", 200),
    description: detail.detail || "",
    maxAmount: parseAmount(detail.subsidy_max_limit),
    minAmount: null,
    subsidyRate: detail.subsidy_rate || "要確認",
    deadline,
    applicationPeriod: detail.acceptance_start_datetime
      ? {
          start: parseDate(detail.acceptance_start_datetime) || "",
          end: deadline,
        }
      : null,
    url: detail.url || null,
    // AI抽出で上書きされるフィールド（デフォルト値）
    categories: ["OTHER"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    tags: [],
    eligibilityCriteria: [],
    excludedCases: [],
    requiredDocuments: [],
    applicationSections: [],
    promptSupport: "GENERIC",
    subsidyType: "OTHER",
    popularity: 1,
    difficulty: "MEDIUM",
    isActive: deadline ? new Date(deadline) > new Date() : true,
    lastUpdated: new Date().toISOString().split("T")[0],
  };
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1) + "…";
}
