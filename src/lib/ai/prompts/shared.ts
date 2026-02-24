import type { BusinessProfile } from "@/types";

export function profileContext(profile: BusinessProfile): string {
  const lines = [
    `事業者名: ${profile.companyName}`,
    `業種: ${profile.industry}`,
    `従業員数: ${profile.employeeCount}名`,
    `事業内容: ${profile.businessDescription}`,
    `主な商品・サービス: ${profile.products}`,
    `主な顧客層: ${profile.targetCustomers}`,
    `販売チャネル: ${profile.salesChannels}`,
    `自社の強み: ${profile.strengths}`,
    `経営上の課題: ${profile.challenges}`,
  ];
  if (profile.annualRevenue) {
    lines.push(`年間売上: ${profile.annualRevenue}万円`);
  }
  if (profile.foundedYear) {
    lines.push(`設立年: ${profile.foundedYear}年`);
  }
  return lines.join("\n");
}
