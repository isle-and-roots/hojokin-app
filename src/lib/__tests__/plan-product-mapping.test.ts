import { describe, it, expect, beforeAll } from "vitest";
import type { PlanKey, PlanInfo } from "@/lib/plans";

// ── 環境変数を設定してからモジュールを import ──
let getPlanKeyByProductId: (productId: string) => PlanKey | null;
let canUseFeature: (
  plan: PlanKey,
  feature: "docxExport" | "aiGeneration" | "multipleProfiles" | "chatReview"
) => boolean;
let getAiLimit: (plan: PlanKey) => number;
let PLAN_LIST: PlanInfo[];

beforeAll(async () => {
  process.env.POLAR_STARTER_PRODUCT_ID = "prod_starter_123";
  process.env.POLAR_PRO_PRODUCT_ID = "prod_pro_456";
  process.env.POLAR_BUSINESS_PRODUCT_ID = "prod_business_789";
  process.env.POLAR_STARTER_ANNUAL_PRODUCT_ID = "prod_starter_annual_123";
  process.env.POLAR_PRO_ANNUAL_PRODUCT_ID = "prod_pro_annual_456";
  process.env.POLAR_BUSINESS_ANNUAL_PRODUCT_ID = "prod_business_annual_789";

  const mod = await import("@/lib/plans");
  getPlanKeyByProductId = mod.getPlanKeyByProductId;
  canUseFeature = mod.canUseFeature;
  getAiLimit = mod.getAiLimit;
  PLAN_LIST = mod.PLAN_LIST;
});

describe("Product ID → PlanKey マッピング", () => {
  it("Starter月額 productId → 'starter'", () => {
    expect(getPlanKeyByProductId("prod_starter_123")).toBe("starter");
  });

  it("Pro月額 productId → 'pro'", () => {
    expect(getPlanKeyByProductId("prod_pro_456")).toBe("pro");
  });

  it("Business月額 productId → 'business'", () => {
    expect(getPlanKeyByProductId("prod_business_789")).toBe("business");
  });

  it("Starter年額 → 'starter'", () => {
    expect(getPlanKeyByProductId("prod_starter_annual_123")).toBe("starter");
  });

  it("Pro年額 → 'pro'", () => {
    expect(getPlanKeyByProductId("prod_pro_annual_456")).toBe("pro");
  });

  it("Business年額 → 'business'", () => {
    expect(getPlanKeyByProductId("prod_business_annual_789")).toBe("business");
  });

  it("空文字 → null", () => {
    expect(getPlanKeyByProductId("")).toBeNull();
  });

  it("ランダムUUID → null", () => {
    expect(getPlanKeyByProductId("550e8400-e29b-41d4-a716-446655440000")).toBeNull();
  });

  it("free productId '' → null (free has empty productId)", () => {
    // free プランの productId は空文字列だが、
    // getPlanKeyByProductId は空文字列を検索しても p.productId が falsy なのでスキップされる
    const freePlan = PLAN_LIST.find((p) => p.key === "free");
    expect(freePlan).toBeDefined();
    expect(freePlan!.productId).toBe("");
    expect(getPlanKeyByProductId(freePlan!.productId)).toBeNull();
  });
});

describe("PLAN_LIST と canUseFeature の整合性", () => {
  it("PLAN_LIST.docxExport と canUseFeature('docxExport') が全プランで一致", () => {
    for (const plan of PLAN_LIST) {
      const fromList = plan.docxExport;
      const fromFunction = canUseFeature(plan.key, "docxExport");
      expect(fromFunction).toBe(
        fromList,
        // エラーメッセージに具体的なプラン名を含める
      );
    }
  });

  it("PLAN_LIST.aiLimit と getAiLimit() が全プランで一致", () => {
    for (const plan of PLAN_LIST) {
      const fromList = plan.aiLimit;
      const fromFunction = getAiLimit(plan.key);
      expect(fromFunction).toBe(fromList);
    }
  });
});
