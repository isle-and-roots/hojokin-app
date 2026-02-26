import { describe, it, expect, beforeAll } from "vitest";

// 環境変数をモジュール読み込み前に設定
beforeAll(() => {
  process.env.POLAR_STARTER_PRODUCT_ID = "prod_starter_123";
  process.env.POLAR_PRO_PRODUCT_ID = "prod_pro_456";
  process.env.POLAR_BUSINESS_PRODUCT_ID = "prod_business_789";
});

describe("plans", () => {
  describe("getPlanKeyByProductId", () => {
    it("Starter Product ID → starter を返す", async () => {
      const { getPlanKeyByProductId } = await import("@/lib/plans");
      expect(getPlanKeyByProductId("prod_starter_123")).toBe("starter");
    });

    it("Pro Product ID → pro を返す", async () => {
      const { getPlanKeyByProductId } = await import("@/lib/plans");
      expect(getPlanKeyByProductId("prod_pro_456")).toBe("pro");
    });

    it("Business Product ID → business を返す", async () => {
      const { getPlanKeyByProductId } = await import("@/lib/plans");
      expect(getPlanKeyByProductId("prod_business_789")).toBe("business");
    });

    it("不明な Product ID → null を返す", async () => {
      const { getPlanKeyByProductId } = await import("@/lib/plans");
      expect(getPlanKeyByProductId("unknown_id")).toBeNull();
    });

    it("空文字列 → null を返す（free の productId は空）", async () => {
      const { getPlanKeyByProductId } = await import("@/lib/plans");
      expect(getPlanKeyByProductId("")).toBeNull();
    });
  });

  describe("canUseFeature", () => {
    it("free プランは DOCX エクスポート不可", async () => {
      const { canUseFeature } = await import("@/lib/plans");
      expect(canUseFeature("free", "docxExport")).toBe(false);
    });

    it("starter プランは DOCX エクスポート可", async () => {
      const { canUseFeature } = await import("@/lib/plans");
      expect(canUseFeature("starter", "docxExport")).toBe(true);
    });

    it("pro プランは DOCX エクスポート可", async () => {
      const { canUseFeature } = await import("@/lib/plans");
      expect(canUseFeature("pro", "docxExport")).toBe(true);
    });

    it("business プランは DOCX エクスポート可", async () => {
      const { canUseFeature } = await import("@/lib/plans");
      expect(canUseFeature("business", "docxExport")).toBe(true);
    });

    it("全プランで AI 生成可（回数制限あり）", async () => {
      const { canUseFeature } = await import("@/lib/plans");
      expect(canUseFeature("free", "aiGeneration")).toBe(true);
      expect(canUseFeature("starter", "aiGeneration")).toBe(true);
      expect(canUseFeature("pro", "aiGeneration")).toBe(true);
      expect(canUseFeature("business", "aiGeneration")).toBe(true);
    });

    it("business のみ複数プロフィール可", async () => {
      const { canUseFeature } = await import("@/lib/plans");
      expect(canUseFeature("free", "multipleProfiles")).toBe(false);
      expect(canUseFeature("starter", "multipleProfiles")).toBe(false);
      expect(canUseFeature("pro", "multipleProfiles")).toBe(false);
      expect(canUseFeature("business", "multipleProfiles")).toBe(true);
    });
  });

  describe("getAiLimit", () => {
    it("各プランの AI 生成上限が正しい", async () => {
      const { getAiLimit } = await import("@/lib/plans");
      expect(getAiLimit("free")).toBe(3);
      expect(getAiLimit("starter")).toBe(15);
      expect(getAiLimit("pro")).toBe(100);
      expect(getAiLimit("business")).toBe(500);
    });
  });
});
