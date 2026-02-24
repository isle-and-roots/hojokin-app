import { DUMMY_SUBSIDIES } from "@/lib/data/subsidies";
import type {
  SubsidyInfo,
  SubsidySearchFilters,
  SubsidySearchResult,
  BusinessProfile,
} from "@/types";

export async function searchSubsidies(
  filters: SubsidySearchFilters
): Promise<SubsidySearchResult> {
  let results = [...DUMMY_SUBSIDIES];

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
  return DUMMY_SUBSIDIES.find((s) => s.id === id) ?? null;
}

export async function getRecommendedSubsidies(
  profile: BusinessProfile
): Promise<SubsidyInfo[]> {
  const active = DUMMY_SUBSIDIES.filter((s) => s.isActive);

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
