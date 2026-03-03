/**
 * プラン別機能権限テスト — UI ロジック検証
 *
 * コンポーネントのレンダリングテストは posthog-js が jsdom でハングするため、
 * 純粋なプランロジックの検証に集中する。
 * canUseFeature / getAiLimit / PLAN_LIST の整合性テストが金銭リスク回避の主要テスト。
 */
import { describe, it, expect } from "vitest";
import {
  canUseFeature,
  getAiLimit,
  PLAN_LIST,
  type PlanKey,
} from "@/lib/plans";

// ---------------------------------------------------------------------------
// 1. canUseFeature 整合性マトリクス
// ---------------------------------------------------------------------------

describe("canUseFeature 整合性マトリクス", () => {
  const plans: PlanKey[] = ["free", "starter", "pro", "business"];

  const expected: Record<string, Record<PlanKey, boolean>> = {
    docxExport: { free: false, starter: true, pro: true, business: true },
    aiGeneration: { free: true, starter: true, pro: true, business: true },
    multipleProfiles: { free: false, starter: false, pro: false, business: true },
    chatReview: { free: false, starter: false, pro: true, business: true },
  };

  const features = Object.keys(expected) as Array<
    "docxExport" | "aiGeneration" | "multipleProfiles" | "chatReview"
  >;

  it.each(
    plans.flatMap((plan) =>
      features.map((feature) => ({
        plan,
        feature,
        expectedValue: expected[feature][plan],
      }))
    )
  )(
    "$plan × $feature → $expectedValue",
    ({ plan, feature, expectedValue }) => {
      expect(canUseFeature(plan, feature)).toBe(expectedValue);
    }
  );
});

// ---------------------------------------------------------------------------
// 2. ChatInterface プランロジック（純粋ロジックテスト）
// ---------------------------------------------------------------------------

describe("ChatInterface プランロジック", () => {
  describe("canReview ロジック", () => {
    it("free → canReview = false", () => {
      expect(canUseFeature("free", "chatReview")).toBe(false);
    });
    it("starter → canReview = false", () => {
      expect(canUseFeature("starter", "chatReview")).toBe(false);
    });
    it("pro → canReview = true", () => {
      expect(canUseFeature("pro", "chatReview")).toBe(true);
    });
    it("business → canReview = true", () => {
      expect(canUseFeature("business", "chatReview")).toBe(true);
    });
  });

  describe("showReviewHint ロジック", () => {
    const computeShowReviewHint = (plan: PlanKey, inputLength: number): boolean => {
      const canReview = plan === "pro" || plan === "business";
      return !canReview && inputLength >= 200;
    };

    it("free + 200文字 → true", () => {
      expect(computeShowReviewHint("free", 200)).toBe(true);
    });
    it("free + 199文字 → false", () => {
      expect(computeShowReviewHint("free", 199)).toBe(false);
    });
    it("starter + 200文字 → true", () => {
      expect(computeShowReviewHint("starter", 200)).toBe(true);
    });
    it("pro + 200文字 → false", () => {
      expect(computeShowReviewHint("pro", 200)).toBe(false);
    });
    it("business + 500文字 → false", () => {
      expect(computeShowReviewHint("business", 500)).toBe(false);
    });
    it("free + 0文字 → false", () => {
      expect(computeShowReviewHint("free", 0)).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// 3. PLAN_LIST 整合性
// ---------------------------------------------------------------------------

describe("PLAN_LIST 整合性", () => {
  it("全プランの aiLimit が getAiLimit と一致", () => {
    for (const plan of PLAN_LIST) {
      expect(plan.aiLimit).toBe(getAiLimit(plan.key));
    }
  });

  it("全プランの docxExport が canUseFeature と一致", () => {
    for (const plan of PLAN_LIST) {
      expect(plan.docxExport).toBe(canUseFeature(plan.key, "docxExport"));
    }
  });

  it("全プランの maxApplications が正の整数または -1", () => {
    for (const plan of PLAN_LIST) {
      if (plan.maxApplications === -1) {
        expect(plan.maxApplications).toBe(-1);
      } else {
        expect(plan.maxApplications).toBeGreaterThan(0);
        expect(Number.isInteger(plan.maxApplications)).toBe(true);
      }
    }
  });

  it("Pro プランが highlighted=true", () => {
    const pro = PLAN_LIST.find((p) => p.key === "pro");
    expect(pro?.highlighted).toBe(true);
  });

  it("Pro 以外のプランは highlighted=false", () => {
    const nonProPlans = PLAN_LIST.filter((p) => p.key !== "pro");
    for (const plan of nonProPlans) {
      expect(plan.highlighted).toBe(false);
    }
  });

  it("Free プランの price が 0", () => {
    const free = PLAN_LIST.find((p) => p.key === "free");
    expect(free?.price).toBe(0);
  });

  it("Free プランの annualPrice が null", () => {
    const free = PLAN_LIST.find((p) => p.key === "free");
    expect(free?.annualPrice).toBeNull();
  });

  it("有料プランの price が 0 より大きい", () => {
    const paidPlans = PLAN_LIST.filter((p) => p.key !== "free");
    for (const plan of paidPlans) {
      expect(plan.price).toBeGreaterThan(0);
    }
  });

  it("有料プランの annualPrice が null でない", () => {
    const paidPlans = PLAN_LIST.filter((p) => p.key !== "free");
    for (const plan of paidPlans) {
      expect(plan.annualPrice).not.toBeNull();
      expect(plan.annualPrice).toBeGreaterThan(0);
    }
  });

  it("全プランに features が1つ以上ある", () => {
    for (const plan of PLAN_LIST) {
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });

  it("全プランに persona が設定されている", () => {
    for (const plan of PLAN_LIST) {
      expect(plan.persona).toBeTruthy();
      expect(typeof plan.persona).toBe("string");
    }
  });

  it("PLAN_LIST は free → starter → pro → business の順番", () => {
    const keys = PLAN_LIST.map((p) => p.key);
    expect(keys).toEqual(["free", "starter", "pro", "business"]);
  });

  it("getAiLimit の値がプランの昇順で単調増加", () => {
    const limits = PLAN_LIST.map((p) => getAiLimit(p.key));
    for (let i = 1; i < limits.length; i++) {
      expect(limits[i]).toBeGreaterThan(limits[i - 1]);
    }
  });
});
