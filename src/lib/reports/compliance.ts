import type { DocumentSection, SubsidyType } from "@/types";
import { JIZOKUKA_SECTIONS } from "@/types";

// === コンプライアンスチェック結果 ===
export interface ComplianceIssue {
  severity: "error" | "warning" | "info";
  rule: string;
  message: string;
  sectionKey?: string;
}

export interface SectionComplianceResult {
  sectionKey: string;
  sectionTitle: string;
  passed: boolean;
  issues: ComplianceIssue[];
}

export interface ComplianceReport {
  subsidyType: SubsidyType;
  overallPassed: boolean;
  score: number; // 0-100
  sectionResults: SectionComplianceResult[];
  allIssues: ComplianceIssue[];
}

// === セクション最小文字数マップ（JIZOKUKA）
// 日本語は英語と比べて情報密度が高いため、より少ない文字数でも十分な内容を表現できる
const JIZOKUKA_MIN_CHARS: Record<string, number> = {
  company_overview: 100,
  customer_needs_market: 100,
  strengths: 100,
  management_plan: 100,
  project_name: 10,
  sales_expansion_plan: 100,
  efficiency_plan: 80,
  expected_effects: 80,
};

// === プレースホルダーパターン ===
const PLACEHOLDER_PATTERNS = [
  /\[要入力[：:][^\]]*\]/g,
  /\[TODO[：:][^\]]*\]/g,
  /〇〇/g,
  /□□/g,
  /※※※/g,
];

// === 数値存在チェック（具体的な数字が含まれているか） ===
function hasNumericContent(text: string): boolean {
  return /[0-9０-９]/.test(text);
}

// === プレースホルダー検出 ===
function detectPlaceholders(text: string): string[] {
  const found: string[] = [];
  for (const pattern of PLACEHOLDER_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      found.push(...matches);
    }
  }
  return found;
}

// === キーワードカバレッジチェック ===
const JIZOKUKA_REQUIRED_KEYWORDS: Record<string, string[]> = {
  company_overview: ["事業", "商品", "サービス"],
  customer_needs_market: ["顧客", "市場", "ニーズ"],
  strengths: ["強み", "特徴", "差別化"],
  management_plan: ["目標", "計画", "方針"],
  project_name: [],
  sales_expansion_plan: ["販路", "取り組み", "拡大"],
  efficiency_plan: ["効率", "改善", "生産性"],
  expected_effects: ["効果", "向上", "増加"],
};

function checkKeywordCoverage(
  sectionKey: string,
  text: string,
  subsidyType: SubsidyType
): ComplianceIssue[] {
  if (subsidyType !== "JIZOKUKA") return [];

  const requiredKeywords = JIZOKUKA_REQUIRED_KEYWORDS[sectionKey] ?? [];
  const issues: ComplianceIssue[] = [];

  for (const keyword of requiredKeywords) {
    if (!text.includes(keyword)) {
      issues.push({
        severity: "warning",
        rule: "keyword_coverage",
        message: `推奨キーワード「${keyword}」が含まれていません`,
        sectionKey,
      });
    }
  }

  return issues;
}

// === セクションコンプライアンスチェック ===
function checkSection(
  section: DocumentSection,
  subsidyType: SubsidyType
): SectionComplianceResult {
  const content =
    section.finalContent ?? section.userEditedContent ?? section.aiGeneratedContent;
  const issues: ComplianceIssue[] = [];

  // 1. コンテンツ存在チェック
  if (!content || content.trim().length === 0) {
    issues.push({
      severity: "error",
      rule: "content_required",
      message: "セクションの内容が空です",
      sectionKey: section.sectionKey,
    });
    return {
      sectionKey: section.sectionKey,
      sectionTitle: section.sectionTitle,
      passed: false,
      issues,
    };
  }

  const trimmedContent = content.trim();

  // 2. 文字数チェック
  if (subsidyType === "JIZOKUKA") {
    const minChars = JIZOKUKA_MIN_CHARS[section.sectionKey];
    if (minChars !== undefined && trimmedContent.length < minChars) {
      issues.push({
        severity: "error",
        rule: "char_count",
        message: `文字数が不足しています（現在: ${trimmedContent.length}文字、必要: ${minChars}文字以上）`,
        sectionKey: section.sectionKey,
      });
    }
  }

  // 3. 数値存在チェック（project_name以外）
  if (section.sectionKey !== "project_name") {
    if (!hasNumericContent(trimmedContent)) {
      issues.push({
        severity: "warning",
        rule: "numeric_presence",
        message: "具体的な数値（売上目標、従業員数など）が含まれていません",
        sectionKey: section.sectionKey,
      });
    }
  }

  // 4. プレースホルダー検出
  const placeholders = detectPlaceholders(trimmedContent);
  if (placeholders.length > 0) {
    issues.push({
      severity: "error",
      rule: "placeholder_detection",
      message: `未記入のプレースホルダーが${placeholders.length}件あります: ${placeholders.slice(0, 3).join(", ")}`,
      sectionKey: section.sectionKey,
    });
  }

  // 5. キーワードカバレッジチェック
  const keywordIssues = checkKeywordCoverage(
    section.sectionKey,
    trimmedContent,
    subsidyType
  );
  issues.push(...keywordIssues);

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const passed = errorCount === 0;

  return {
    sectionKey: section.sectionKey,
    sectionTitle: section.sectionTitle,
    passed,
    issues,
  };
}

// === セクション完全性チェック ===
function checkSectionCompleteness(
  sections: DocumentSection[],
  subsidyType: SubsidyType
): ComplianceIssue[] {
  if (subsidyType !== "JIZOKUKA") return [];

  const issues: ComplianceIssue[] = [];
  const presentKeys = new Set(sections.map((s) => s.sectionKey));

  for (const required of JIZOKUKA_SECTIONS) {
    if (!presentKeys.has(required.key)) {
      issues.push({
        severity: "error",
        rule: "section_completeness",
        message: `必須セクション「${required.title}」がありません`,
      });
    }
  }

  return issues;
}

// === メインチェッカー ===
export function checkCompliance(
  sections: DocumentSection[],
  subsidyType: SubsidyType
): ComplianceReport {
  const completenessIssues = checkSectionCompleteness(sections, subsidyType);

  const sectionResults: SectionComplianceResult[] = sections.map((section) =>
    checkSection(section, subsidyType)
  );

  const allIssues: ComplianceIssue[] = [
    ...completenessIssues,
    ...sectionResults.flatMap((r) => r.issues),
  ];

  const errorCount = allIssues.filter((i) => i.severity === "error").length;
  const warningCount = allIssues.filter((i) => i.severity === "warning").length;
  const overallPassed = errorCount === 0;

  // スコア計算: エラーは-10点、警告は-3点
  const baseScore = 100;
  const penalty = errorCount * 10 + warningCount * 3;
  const score = Math.max(0, baseScore - penalty);

  return {
    subsidyType,
    overallPassed,
    score,
    sectionResults,
    allIssues,
  };
}
