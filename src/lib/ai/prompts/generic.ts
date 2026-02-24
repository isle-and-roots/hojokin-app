import type { BusinessProfile, SubsidyInfo, SubsidySectionDefinition } from "@/types";
import { profileContext } from "./shared";

function subsidyContext(subsidy: SubsidyInfo): string {
  const lines = [
    `補助金名: ${subsidy.name}`,
    `管轄: ${subsidy.department}`,
    `概要: ${subsidy.summary}`,
  ];
  if (subsidy.maxAmount !== null) {
    lines.push(`上限額: ${(subsidy.maxAmount / 10000).toLocaleString()}万円`);
  }
  lines.push(`補助率: ${subsidy.subsidyRate}`);
  if (subsidy.eligibilityCriteria.length > 0) {
    lines.push("応募要件:");
    subsidy.eligibilityCriteria.forEach((c) => lines.push(`  - ${c}`));
  }
  return lines.join("\n");
}

export function getGenericPrompt(
  subsidy: SubsidyInfo,
  sectionDef: SubsidySectionDefinition,
  profile: BusinessProfile,
  additionalContext?: string
): string {
  return `あなたは中小企業診断士として、「${subsidy.name}」の申請書類の「${sectionDef.title}」セクションを作成してください。

## 補助金の概要
${subsidyContext(subsidy)}

## 事業者情報
${profileContext(profile)}

## このセクションについて
- セクション名: ${sectionDef.title}
- セクション説明: ${sectionDef.description}
${sectionDef.estimatedLength ? `- 目安文字数: ${sectionDef.estimatedLength}` : "- 目安文字数: 800-1200字程度"}

${additionalContext ? `## 追加情報\n${additionalContext}\n` : ""}
## 作成ルール
1. 審査員が「この事業者は補助金の趣旨を理解し、具体的な計画がある」と感じる記述にする
2. 事業者の情報を最大限活用し、具体的かつ説得力のある内容にする
3. 補助金の要件・趣旨に沿った記述にする
4. 具体的な数字（売上、コスト削減、顧客数等）を可能な限り含める
5. 箇条書きと文章を組み合わせて読みやすくする

## 出力形式
セクション本文をそのまま出力してください（マークダウン書式は使用しない、プレーンテキスト）。
情報が不足している箇所は [要入力: ○○] と明示してください。`;
}
