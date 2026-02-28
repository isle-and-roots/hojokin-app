import type { DocumentSection, SubsidyType } from "@/types";
import { checkCompliance } from "@/lib/reports/compliance";

// === 品質グレード ===
export type QualityGrade = "A" | "B" | "C" | "D" | "F";

// === スコア内訳 ===
export interface QualityScoreBreakdown {
  completeness: number; // 0-100: セクションの充実度 (30%)
  specificity: number; // 0-100: 具体性（数値・固有名詞の使用） (25%)
  consistency: number; // 0-100: 内容の一貫性 (15%)
  compliance: number; // 0-100: ルール適合度 (20%)
  readability: number; // 0-100: 読みやすさ (10%)
}

// === 品質スコア結果 ===
export interface QualityScoreResult {
  totalScore: number; // 0-100
  grade: QualityGrade;
  breakdown: QualityScoreBreakdown;
  sectionScores: { sectionKey: string; sectionTitle: string; score: number }[];
}

// === グレード判定 ===
export function getGrade(score: number): QualityGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// === 充実度スコア（コンテンツ量） ===
function calcCompletenessScore(sections: DocumentSection[]): number {
  if (sections.length === 0) return 0;

  const scores = sections.map((section) => {
    const content =
      section.finalContent ?? section.userEditedContent ?? section.aiGeneratedContent;
    if (!content || content.trim().length === 0) return 0;

    const len = content.trim().length;
    // 300文字以上で満点、それ以下は比例
    return Math.min(100, Math.round((len / 300) * 100));
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// === 具体性スコア（数値・固有名詞の密度） ===
const NUMERIC_PATTERN = /[0-9０-９]+[%％万円件名人回年]/g;
const SPECIFIC_KEYWORDS = [
  "万円", "億円", "件", "名", "人", "%", "％", "年間", "月間",
  "前年比", "目標", "実績",
];

function calcSpecificityScore(sections: DocumentSection[]): number {
  if (sections.length === 0) return 0;

  const scores = sections.map((section) => {
    const content =
      section.finalContent ?? section.userEditedContent ?? section.aiGeneratedContent;
    if (!content || content.trim().length === 0) return 0;

    const text = content.trim();
    const numericMatches = text.match(NUMERIC_PATTERN) ?? [];
    const keywordCount = SPECIFIC_KEYWORDS.filter((kw) => text.includes(kw)).length;
    const charCount = text.length;

    // 数値密度: 1000文字あたりの数値表現数
    const density = ((numericMatches.length + keywordCount) / charCount) * 1000;
    return Math.min(100, Math.round(density * 15));
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// === 一貫性スコア（キーワードの繰り返し使用） ===
function extractKeyTerms(text: string): string[] {
  // 3文字以上の名詞的なフレーズを抽出
  const patterns = text.match(/[\u4e00-\u9fa5\u30A0-\u30FFa-zA-Z0-9]{3,10}/g) ?? [];
  const freq = new Map<string, number>();
  for (const term of patterns) {
    freq.set(term, (freq.get(term) ?? 0) + 1);
  }
  return [...freq.entries()]
    .filter(([, count]) => count >= 2)
    .map(([term]) => term);
}

function calcConsistencyScore(sections: DocumentSection[]): number {
  if (sections.length < 2) return 70; // セクションが少ない場合は基準値

  const allTexts = sections
    .map((s) => s.finalContent ?? s.userEditedContent ?? s.aiGeneratedContent)
    .filter(Boolean) as string[];

  if (allTexts.length < 2) return 50;

  const combinedText = allTexts.join(" ");
  const keyTerms = extractKeyTerms(combinedText);

  // キータームが複数セクションにまたがって使われているか確認
  let crossSectionTerms = 0;
  for (const term of keyTerms) {
    const sectionsWithTerm = allTexts.filter((text) => text.includes(term));
    if (sectionsWithTerm.length >= 2) {
      crossSectionTerms++;
    }
  }

  // 3つ以上のクロスセクションタームで満点
  return Math.min(100, Math.round((crossSectionTerms / 3) * 100));
}

// === コンプライアンス適合度スコア ===
function calcComplianceScore(
  sections: DocumentSection[],
  subsidyType: SubsidyType
): number {
  const report = checkCompliance(sections, subsidyType);
  return report.score;
}

// === 読みやすさスコア（文の長さ・段落構成） ===
function calcReadabilityScore(sections: DocumentSection[]): number {
  if (sections.length === 0) return 0;

  const scores = sections.map((section) => {
    const content =
      section.finalContent ?? section.userEditedContent ?? section.aiGeneratedContent;
    if (!content || content.trim().length === 0) return 0;

    const text = content.trim();

    // 文章を分割（句点で区切る）
    const sentences = text
      .split(/[。！？]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sentences.length === 0) return 50;

    const avgSentenceLen =
      sentences.reduce((a, s) => a + s.length, 0) / sentences.length;

    // 適切な文の長さは20〜60文字
    let readabilityScore = 100;
    if (avgSentenceLen < 10) readabilityScore -= 30; // 短すぎる
    if (avgSentenceLen > 80) readabilityScore -= 20; // 長すぎる
    if (avgSentenceLen > 100) readabilityScore -= 20; // さらにペナルティ

    // 段落区切りの存在（改行）
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);
    if (paragraphs.length >= 2) readabilityScore += 10;

    return Math.max(0, Math.min(100, readabilityScore));
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// === セクション個別スコア ===
function calcSectionScore(section: DocumentSection): number {
  const content =
    section.finalContent ?? section.userEditedContent ?? section.aiGeneratedContent;
  if (!content || content.trim().length === 0) return 0;

  const text = content.trim();
  let score = 0;

  // 文字数（40点）
  const charScore = Math.min(40, Math.round((text.length / 300) * 40));
  score += charScore;

  // 数値の存在（30点）
  const hasNumeric = /[0-9０-９]/.test(text);
  if (hasNumeric) score += 30;

  // プレースホルダーなし（20点）
  const hasPlaceholder = /\[要入力[：:][^\]]*\]/.test(text);
  if (!hasPlaceholder) score += 20;

  // 読みやすさ（10点）
  const sentences = text.split(/[。！？]/).filter((s) => s.trim().length > 0);
  if (sentences.length >= 2) score += 10;

  return Math.min(100, score);
}

// === メイン品質スコア計算 ===
export function calculateQualityScore(
  sections: DocumentSection[],
  subsidyType: SubsidyType
): QualityScoreResult {
  const breakdown: QualityScoreBreakdown = {
    completeness: calcCompletenessScore(sections),
    specificity: calcSpecificityScore(sections),
    consistency: calcConsistencyScore(sections),
    compliance: calcComplianceScore(sections, subsidyType),
    readability: calcReadabilityScore(sections),
  };

  // 加重平均
  const totalScore = Math.round(
    breakdown.completeness * 0.3 +
      breakdown.specificity * 0.25 +
      breakdown.consistency * 0.15 +
      breakdown.compliance * 0.2 +
      breakdown.readability * 0.1
  );

  const grade = getGrade(totalScore);

  const sectionScores = sections.map((s) => ({
    sectionKey: s.sectionKey,
    sectionTitle: s.sectionTitle,
    score: calcSectionScore(s),
  }));

  return {
    totalScore,
    grade,
    breakdown,
    sectionScores,
  };
}
