/**
 * AI フィールド抽出
 *
 * jGrants APIの非構造化テキストからClaude Haikuで構造化データを抽出。
 * コスト: ~$0.001/件 → 月500件で~$0.50
 */

import Anthropic from "@anthropic-ai/sdk";
import type { SubsidyInfo, SubsidyCategory, TargetScale, TargetIndustry, SubsidySectionDefinition } from "@/types";
import type { JGrantsSubsidyDetail } from "@/lib/external/jgrants";

const AI_EXTRACTION_VERSION = "v1";

/** AI抽出結果の型 */
interface ExtractionResult {
  categories: SubsidyCategory[];
  targetScale: TargetScale[];
  targetIndustries: TargetIndustry[];
  eligibilityCriteria: string[];
  excludedCases: string[];
  tags: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  applicationSections: SubsidySectionDefinition[];
}

const VALID_CATEGORIES: SubsidyCategory[] = [
  "HANBAI_KAIKAKU", "IT_DIGITAL", "SETSUBI_TOUSHI", "KENKYUU_KAIHATSU",
  "JINZAI_IKUSEI", "CHIIKI_KASSEIKA", "SOUZOU_TENKAN", "KANKYOU_ENERGY", "OTHER",
];
const VALID_SCALES: TargetScale[] = ["KOBOKIGYO", "CHUSHO", "ALL"];
const VALID_INDUSTRIES: TargetIndustry[] = [
  "SEIZOU", "KOURI", "INSHOKU", "SERVICE", "IT", "KENSETSU", "ALL",
];

/**
 * jGrants詳細データからAIで構造化フィールドを抽出
 */
export async function extractFieldsWithAI(
  detail: JGrantsSubsidyDetail
): Promise<{ result: ExtractionResult; version: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // APIキー未設定時はデフォルト値を返す
    return {
      result: getDefaultExtractionResult(),
      version: `${AI_EXTRACTION_VERSION}-fallback`,
    };
  }

  const client = new Anthropic({ apiKey });

  const prompt = buildExtractionPrompt(detail);

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = parseExtractionResponse(text);
    return { result: parsed, version: AI_EXTRACTION_VERSION };
  } catch {
    console.warn(`[AI Extractor] パース失敗 (${detail.id}), デフォルト値を使用`);
    return {
      result: getDefaultExtractionResult(),
      version: `${AI_EXTRACTION_VERSION}-parse-error`,
    };
  }
}

function buildExtractionPrompt(detail: JGrantsSubsidyDetail): string {
  return `以下の補助金情報から構造化データを抽出してください。JSONのみを返してください。

## 補助金情報
名称: ${detail.name}
詳細: ${detail.detail || "なし"}
対象: ${detail.target || "なし"}
用途: ${detail.usage || "なし"}
申請方法: ${detail.application_method || "なし"}
補足情報: ${detail.supplementary_information || "なし"}
カテゴリ: ${detail.subsidy_category || "なし"}

## 抽出するフィールド（JSON形式で返答）

{
  "categories": ["カテゴリコード"], // ${VALID_CATEGORIES.join(", ")} から1つ以上
  "targetScale": ["規模コード"], // ${VALID_SCALES.join(", ")} から1つ以上
  "targetIndustries": ["業種コード"], // ${VALID_INDUSTRIES.join(", ")} から1つ以上。特定業種限定でなければ ["ALL"]
  "eligibilityCriteria": ["要件1", "要件2"], // 申請資格要件を箇条書き（最大5件）
  "excludedCases": ["除外1"], // 対象外ケース（最大3件、なければ空配列）
  "tags": ["タグ1", "タグ2"], // 検索用キーワード（最大8件）
  "difficulty": "EASY|MEDIUM|HARD", // 申請の難易度推定
  "applicationSections": [{"key": "section_1", "title": "セクション名", "description": "記載内容の説明"}] // 申請書のセクション構成（最大6件、不明なら空配列）
}`;
}

function parseExtractionResponse(text: string): ExtractionResult {
  // JSON部分を抽出
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("JSON not found in response");
  }

  const raw = JSON.parse(jsonMatch[0]);

  // バリデーション付きで返す
  return {
    categories: validateArray(raw.categories, VALID_CATEGORIES, ["OTHER"]),
    targetScale: validateArray(raw.targetScale, VALID_SCALES, ["ALL"]),
    targetIndustries: validateArray(raw.targetIndustries, VALID_INDUSTRIES, ["ALL"]),
    eligibilityCriteria: ensureStringArray(raw.eligibilityCriteria).slice(0, 5),
    excludedCases: ensureStringArray(raw.excludedCases).slice(0, 3),
    tags: ensureStringArray(raw.tags).slice(0, 8),
    difficulty: validateEnum(raw.difficulty, ["EASY", "MEDIUM", "HARD"], "MEDIUM"),
    applicationSections: parseApplicationSections(raw.applicationSections),
  };
}

function validateArray<T extends string>(
  input: unknown,
  validValues: T[],
  defaultValue: T[]
): T[] {
  if (!Array.isArray(input)) return defaultValue;
  const filtered = input.filter((v): v is T =>
    typeof v === "string" && validValues.includes(v as T)
  );
  return filtered.length > 0 ? filtered : defaultValue;
}

function validateEnum<T extends string>(
  input: unknown,
  validValues: T[],
  defaultValue: T
): T {
  if (typeof input === "string" && validValues.includes(input as T)) {
    return input as T;
  }
  return defaultValue;
}

function ensureStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter((v): v is string => typeof v === "string" && v.length > 0);
}

function parseApplicationSections(input: unknown): SubsidySectionDefinition[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (item): item is Record<string, string> =>
        typeof item === "object" &&
        item !== null &&
        typeof item.key === "string" &&
        typeof item.title === "string"
    )
    .slice(0, 6)
    .map((item) => ({
      key: item.key,
      title: item.title,
      description: item.description || "",
    }));
}

function getDefaultExtractionResult(): ExtractionResult {
  return {
    categories: ["OTHER"],
    targetScale: ["ALL"],
    targetIndustries: ["ALL"],
    eligibilityCriteria: [],
    excludedCases: [],
    tags: [],
    difficulty: "MEDIUM",
    applicationSections: [],
  };
}

/**
 * AI抽出結果をSubsidyInfoにマージ
 */
export function mergeExtractionResult(
  base: SubsidyInfo,
  extraction: ExtractionResult
): SubsidyInfo {
  return {
    ...base,
    categories: extraction.categories,
    targetScale: extraction.targetScale,
    targetIndustries: extraction.targetIndustries,
    eligibilityCriteria: extraction.eligibilityCriteria,
    excludedCases: extraction.excludedCases,
    tags: extraction.tags,
    difficulty: extraction.difficulty,
    applicationSections: extraction.applicationSections.length > 0
      ? extraction.applicationSections
      : base.applicationSections,
  };
}

export { AI_EXTRACTION_VERSION };
