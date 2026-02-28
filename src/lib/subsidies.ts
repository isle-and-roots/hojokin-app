import { DUMMY_SUBSIDIES } from "@/lib/data/subsidies";
import { getAllSubsidiesFromDb } from "@/lib/db/subsidies";
import type {
  SubsidyInfo,
  SubsidySearchFilters,
  SubsidySearchResult,
  BusinessProfile,
  MatchReason,
  ScoredSubsidy,
  RecommendationResult,
  TargetIndustry,
  SubsidyCategory,
} from "@/types";

/** DB優先で全補助金を取得（フォールバック: 静的データ） */
async function getAllSubsidies(): Promise<SubsidyInfo[]> {
  try {
    const dbSubsidies = await getAllSubsidiesFromDb();
    if (dbSubsidies && dbSubsidies.length > 0) return dbSubsidies;
  } catch {
    // DB接続失敗時は静的データにフォールバック
  }
  return [...DUMMY_SUBSIDIES];
}

export async function searchSubsidies(
  filters: SubsidySearchFilters
): Promise<SubsidySearchResult> {
  let results = await getAllSubsidies();

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(kw) ||
        s.nameShort.toLowerCase().includes(kw) ||
        s.summary.toLowerCase().includes(kw) ||
        s.tags.some((t) => t.toLowerCase().includes(kw)) ||
        s.department.toLowerCase().includes(kw)
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    results = results.filter((s) =>
      s.categories.some((c) => filters.categories!.includes(c))
    );
  }

  if (filters.maxAmountRange) {
    const { min, max } = filters.maxAmountRange;
    results = results.filter((s) => {
      if (s.maxAmount === null) return false;
      if (min !== undefined && s.maxAmount < min) return false;
      if (max !== undefined && s.maxAmount > max) return false;
      return true;
    });
  }

  if (filters.deadlineWithin) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + filters.deadlineWithin);
    results = results.filter((s) => {
      if (!s.deadline) return false;
      return new Date(s.deadline) <= cutoff;
    });
  }

  if (filters.difficulty && filters.difficulty.length > 0) {
    results = results.filter((s) => filters.difficulty!.includes(s.difficulty));
  }

  if (filters.promptSupport && filters.promptSupport.length > 0) {
    results = results.filter((s) =>
      filters.promptSupport!.includes(s.promptSupport)
    );
  }

  results.sort((a, b) => b.popularity - a.popularity);

  return { items: results, total: results.length };
}

export async function getSubsidyById(
  id: string
): Promise<SubsidyInfo | null> {
  try {
    const { getSubsidyByIdFromDb } = await import("@/lib/db/subsidies");
    const dbResult = await getSubsidyByIdFromDb(id);
    if (dbResult) return dbResult;
  } catch {
    // DB接続失敗時は静的データにフォールバック
  }
  return DUMMY_SUBSIDIES.find((s) => s.id === id) ?? null;
}

export async function getRecommendedSubsidies(
  profile: BusinessProfile
): Promise<SubsidyInfo[]> {
  const allSubsidies = await getAllSubsidies();
  const active = allSubsidies.filter((s) => s.isActive);

  const scored = active.map((s) => {
    let score = s.popularity;

    // Industry match
    const industry = profile.industry.toLowerCase();
    if (
      s.targetIndustries.includes("ALL") ||
      (industry.includes("製造") && s.targetIndustries.includes("SEIZOU")) ||
      (industry.includes("小売") && s.targetIndustries.includes("KOURI")) ||
      (industry.includes("飲食") && s.targetIndustries.includes("INSHOKU")) ||
      (industry.includes("IT") && s.targetIndustries.includes("IT")) ||
      (industry.includes("サービス") && s.targetIndustries.includes("SERVICE")) ||
      (industry.includes("飲料") && s.targetIndustries.includes("SEIZOU"))
    ) {
      score += 3;
    }

    // Scale match
    if (profile.employeeCount <= 20 && s.targetScale.includes("KOBOKIGYO")) {
      score += 2;
    }
    if (profile.employeeCount <= 300 && s.targetScale.includes("CHUSHO")) {
      score += 1;
    }

    // Challenge keyword match
    const challenges = profile.challenges.toLowerCase();
    if (
      (challenges.includes("販路") || challenges.includes("集客")) &&
      s.categories.includes("HANBAI_KAIKAKU")
    ) {
      score += 2;
    }
    if (
      (challenges.includes("IT") || challenges.includes("デジタル") || challenges.includes("効率")) &&
      s.categories.includes("IT_DIGITAL")
    ) {
      score += 2;
    }
    if (
      (challenges.includes("人材") || challenges.includes("採用")) &&
      s.categories.includes("JINZAI_IKUSEI")
    ) {
      score += 2;
    }

    // Prefer AI-supported
    if (s.promptSupport === "FULL") score += 2;
    if (s.promptSupport === "GENERIC") score += 1;

    return { subsidy: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.subsidy);
}

// === 業種キーワードマップ ===
const INDUSTRY_KEYWORD_MAP: Record<string, TargetIndustry[]> = {
  製造: ["SEIZOU"],
  ものづくり: ["SEIZOU"],
  工場: ["SEIZOU"],
  メーカー: ["SEIZOU"],
  小売: ["KOURI"],
  販売: ["KOURI"],
  店舗: ["KOURI"],
  飲食: ["INSHOKU"],
  レストラン: ["INSHOKU"],
  カフェ: ["INSHOKU"],
  食品: ["INSHOKU"],
  IT: ["IT"],
  ソフトウェア: ["IT"],
  システム: ["IT"],
  Web: ["IT"],
  アプリ: ["IT"],
  DX: ["IT"],
  サービス: ["SERVICE"],
  コンサル: ["SERVICE"],
  建設: ["KENSETSU"],
  建築: ["KENSETSU"],
  工事: ["KENSETSU"],
  不動産: ["KENSETSU"],
};

// === 課題キーワードマップ ===
const CHALLENGE_CATEGORY_MAP: Record<string, SubsidyCategory[]> = {
  販路: ["HANBAI_KAIKAKU"],
  集客: ["HANBAI_KAIKAKU"],
  売上: ["HANBAI_KAIKAKU"],
  マーケティング: ["HANBAI_KAIKAKU"],
  EC: ["HANBAI_KAIKAKU", "IT_DIGITAL"],
  IT: ["IT_DIGITAL"],
  デジタル: ["IT_DIGITAL"],
  効率: ["IT_DIGITAL"],
  DX: ["IT_DIGITAL"],
  システム: ["IT_DIGITAL"],
  設備: ["SETSUBI_TOUSHI"],
  機械: ["SETSUBI_TOUSHI"],
  老朽化: ["SETSUBI_TOUSHI"],
  研究: ["KENKYUU_KAIHATSU"],
  開発: ["KENKYUU_KAIHATSU"],
  技術: ["KENKYUU_KAIHATSU"],
  特許: ["KENKYUU_KAIHATSU"],
  人材: ["JINZAI_IKUSEI"],
  採用: ["JINZAI_IKUSEI"],
  育成: ["JINZAI_IKUSEI"],
  離職: ["JINZAI_IKUSEI"],
  働き方: ["JINZAI_IKUSEI"],
  地域: ["CHIIKI_KASSEIKA"],
  地方: ["CHIIKI_KASSEIKA"],
  創業: ["CHIIKI_KASSEIKA", "SOUZOU_TENKAN"],
  事業転換: ["SOUZOU_TENKAN"],
  再構築: ["SOUZOU_TENKAN"],
  新事業: ["SOUZOU_TENKAN"],
  承継: ["SOUZOU_TENKAN"],
  省エネ: ["KANKYOU_ENERGY"],
  脱炭素: ["KANKYOU_ENERGY"],
  環境: ["KANKYOU_ENERGY"],
  エネルギー: ["KANKYOU_ENERGY"],
  CO2: ["KANKYOU_ENERGY"],
};

// === プロフィール充実度計算 ===
export function calculateProfileCompleteness(profile: BusinessProfile): number {
  const fields: { key: keyof BusinessProfile; weight: number }[] = [
    { key: "companyName", weight: 10 },
    { key: "representative", weight: 5 },
    { key: "address", weight: 5 },
    { key: "phone", weight: 3 },
    { key: "email", weight: 3 },
    { key: "industry", weight: 10 },
    { key: "prefecture", weight: 3 },
    { key: "employeeCount", weight: 8 },
    { key: "annualRevenue", weight: 8 },
    { key: "foundedYear", weight: 5 },
    { key: "businessDescription", weight: 10 },
    { key: "products", weight: 8 },
    { key: "targetCustomers", weight: 5 },
    { key: "salesChannels", weight: 5 },
    { key: "strengths", weight: 5 },
    { key: "challenges", weight: 10 },
  ];

  let totalWeight = 0;
  let filledWeight = 0;

  for (const { key, weight } of fields) {
    totalWeight += weight;
    const val = profile[key];
    if (val !== null && val !== undefined && val !== "" && val !== 0) {
      filledWeight += weight;
    }
  }

  return Math.round((filledWeight / totalWeight) * 100);
}

// === 9次元スコアリング ===
export async function getRecommendedSubsidiesWithReasons(
  profile: BusinessProfile
): Promise<RecommendationResult> {
  const allSubsidies = await getAllSubsidies();
  const active = allSubsidies.filter((s) => s.isActive);
  const profileCompleteness = calculateProfileCompleteness(profile);

  const scored: ScoredSubsidy[] = active.map((s) => {
    const reasons: MatchReason[] = [];

    // 1. 業種マッチ（最大5点）
    const industryLower = profile.industry.toLowerCase();
    let industryScore = 0;
    if (s.targetIndustries.includes("ALL")) {
      industryScore = 2;
    }
    for (const [keyword, industries] of Object.entries(INDUSTRY_KEYWORD_MAP)) {
      if (industryLower.includes(keyword.toLowerCase())) {
        for (const ind of industries) {
          if (s.targetIndustries.includes(ind)) {
            industryScore = 5;
            break;
          }
        }
      }
      if (industryScore === 5) break;
    }
    if (industryScore > 0) {
      reasons.push({
        key: "industry",
        label: "業種マッチ",
        score: industryScore,
        detail: industryScore === 5 ? `${profile.industry}に最適` : undefined,
      });
    }

    // 2. 規模適合（最大4点）
    let scaleScore = 0;
    if (profile.employeeCount <= 20 && s.targetScale.includes("KOBOKIGYO")) {
      scaleScore = 4;
      reasons.push({
        key: "scale",
        label: "規模適合",
        score: scaleScore,
        detail: "小規模事業者向け",
      });
    } else if (profile.employeeCount <= 300 && s.targetScale.includes("CHUSHO")) {
      scaleScore = 3;
      reasons.push({
        key: "scale",
        label: "規模適合",
        score: scaleScore,
        detail: "中小企業向け",
      });
    } else if (s.targetScale.includes("ALL")) {
      scaleScore = 1;
      reasons.push({
        key: "scale",
        label: "規模対象",
        score: scaleScore,
      });
    }

    // 3. 課題合致（最大5点）
    const challengesLower = profile.challenges.toLowerCase();
    let challengeScore = 0;
    const matchedCategories = new Set<SubsidyCategory>();
    for (const [keyword, categories] of Object.entries(CHALLENGE_CATEGORY_MAP)) {
      if (challengesLower.includes(keyword.toLowerCase())) {
        for (const cat of categories) {
          if (s.categories.includes(cat)) {
            matchedCategories.add(cat);
          }
        }
      }
    }
    challengeScore = Math.min(matchedCategories.size * 2, 5);
    if (challengeScore > 0) {
      reasons.push({
        key: "challenge",
        label: "課題合致",
        score: challengeScore,
        detail: "経営課題に対応",
      });
    }

    // 4. 事業内容関連（最大4点）
    let businessScore = 0;
    const businessText = `${profile.products} ${profile.businessDescription}`.toLowerCase();
    for (const tag of s.tags) {
      if (businessText.includes(tag.toLowerCase())) {
        businessScore = Math.min(businessScore + 2, 4);
      }
    }
    for (const criteria of s.eligibilityCriteria) {
      if (businessText.includes(criteria.substring(0, 4).toLowerCase())) {
        businessScore = Math.min(businessScore + 1, 4);
      }
    }
    if (businessScore > 0) {
      reasons.push({
        key: "business",
        label: "事業内容関連",
        score: businessScore,
      });
    }

    // 5. 販売チャネル関連（最大3点）
    let channelScore = 0;
    const channelsLower = profile.salesChannels.toLowerCase();
    for (const tag of s.tags) {
      if (channelsLower.includes(tag.toLowerCase())) {
        channelScore = Math.min(channelScore + 2, 3);
      }
    }
    if (channelScore > 0) {
      reasons.push({
        key: "channel",
        label: "販売チャネル関連",
        score: channelScore,
      });
    }

    // 6. 補助額適切（最大3点）
    let amountScore = 0;
    if (s.maxAmount !== null && profile.annualRevenue !== null && profile.annualRevenue > 0) {
      const ratio = s.maxAmount / profile.annualRevenue;
      if (ratio >= 0.01 && ratio <= 0.5) {
        amountScore = 3;
      } else if (ratio > 0.5 && ratio <= 1) {
        amountScore = 2;
      } else if (ratio > 0 && ratio < 0.01) {
        amountScore = 1;
      }
      if (amountScore > 0) {
        reasons.push({
          key: "amount",
          label: "補助額適切",
          score: amountScore,
        });
      }
    }

    // 7. 企業年齢（最大3点）
    let ageScore = 0;
    if (profile.foundedYear !== null) {
      const companyAge = new Date().getFullYear() - profile.foundedYear;
      const hasStartupTag = s.tags.some(
        (t) => t.includes("創業") || t.includes("スタートアップ") || t.includes("起業")
      );
      if (companyAge <= 5 && hasStartupTag) {
        ageScore = 3;
        reasons.push({
          key: "age",
          label: "創業支援対象",
          score: ageScore,
          detail: `設立${companyAge}年`,
        });
      } else if (companyAge <= 10 && hasStartupTag) {
        ageScore = 1;
        reasons.push({
          key: "age",
          label: "若い企業向け",
          score: ageScore,
        });
      }
    }

    // 8. 締切緊急度（最大3点）
    let deadlineScore = 0;
    if (s.deadline) {
      const deadlineDate = new Date(s.deadline);
      const now = new Date();
      const daysUntil = Math.ceil(
        (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntil > 0 && daysUntil <= 30) {
        deadlineScore = 3;
        reasons.push({
          key: "deadline",
          label: "締切間近",
          score: deadlineScore,
          detail: `残り${daysUntil}日`,
        });
      } else if (daysUntil > 30 && daysUntil <= 90) {
        deadlineScore = 2;
        reasons.push({
          key: "deadline",
          label: "締切近い",
          score: deadlineScore,
          detail: `残り${daysUntil}日`,
        });
      } else if (daysUntil > 90) {
        deadlineScore = 1;
      }
    }

    // 9. AI対応ボーナス（最大2点）
    let aiScore = 0;
    if (s.promptSupport === "FULL") {
      aiScore = 2;
      reasons.push({
        key: "ai",
        label: "AI完全対応",
        score: aiScore,
      });
    } else if (s.promptSupport === "GENERIC") {
      aiScore = 1;
      reasons.push({
        key: "ai",
        label: "AI対応",
        score: aiScore,
      });
    }

    const totalScore =
      industryScore +
      scaleScore +
      challengeScore +
      businessScore +
      channelScore +
      amountScore +
      ageScore +
      deadlineScore +
      aiScore;

    // スコア降順で理由をソート
    reasons.sort((a, b) => b.score - a.score);

    return { subsidy: s, totalScore, reasons };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);

  return {
    items: scored.slice(0, 5),
    profileCompleteness,
  };
}
