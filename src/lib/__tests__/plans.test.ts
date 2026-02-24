import { describe, it, expect } from "vitest";
import { canUseFeature, getAiLimit, PLAN_LIST } from "@/lib/plans";

describe("canUseFeature", () => {
  it("free plan cannot export DOCX", () => {
    expect(canUseFeature("free", "docxExport")).toBe(false);
  });

  it("pro plan can export DOCX", () => {
    expect(canUseFeature("pro", "docxExport")).toBe(true);
  });

  it("business plan can export DOCX", () => {
    expect(canUseFeature("business", "docxExport")).toBe(true);
  });

  it("all plans can use AI generation", () => {
    expect(canUseFeature("free", "aiGeneration")).toBe(true);
    expect(canUseFeature("pro", "aiGeneration")).toBe(true);
    expect(canUseFeature("business", "aiGeneration")).toBe(true);
  });

  it("only business plan can use multiple profiles", () => {
    expect(canUseFeature("free", "multipleProfiles")).toBe(false);
    expect(canUseFeature("pro", "multipleProfiles")).toBe(false);
    expect(canUseFeature("business", "multipleProfiles")).toBe(true);
  });
});

describe("getAiLimit", () => {
  it("free plan has 3 AI generations", () => {
    expect(getAiLimit("free")).toBe(3);
  });

  it("pro plan has 100 AI generations", () => {
    expect(getAiLimit("pro")).toBe(100);
  });

  it("business plan has 500 AI generations", () => {
    expect(getAiLimit("business")).toBe(500);
  });
});

describe("PLAN_LIST", () => {
  it("has 3 plans", () => {
    expect(PLAN_LIST).toHaveLength(3);
  });

  it("pro plan is highlighted", () => {
    const proPlan = PLAN_LIST.find((p) => p.key === "pro");
    expect(proPlan?.highlighted).toBe(true);
  });

  it("free plan has price 0", () => {
    const freePlan = PLAN_LIST.find((p) => p.key === "free");
    expect(freePlan?.price).toBe(0);
  });

  it("pro plan costs 2980", () => {
    const proPlan = PLAN_LIST.find((p) => p.key === "pro");
    expect(proPlan?.price).toBe(2980);
  });

  it("business plan costs 9800", () => {
    const bizPlan = PLAN_LIST.find((p) => p.key === "business");
    expect(bizPlan?.price).toBe(9800);
  });
});
