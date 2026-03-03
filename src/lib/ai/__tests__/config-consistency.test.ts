import { describe, it, expect, beforeAll } from "vitest";
import { setupPlanEnvVars, ALL_PLANS } from "@/test-utils/mocks";
import type { PlanKey } from "@/lib/plans";

beforeAll(() => {
  setupPlanEnvVars();
});

// ────────────────────────────────────────────
// 1. getModelForPlan — 申請書生成用モデル
// ────────────────────────────────────────────
describe("getModelForPlan", () => {
  it("free → claude-sonnet", async () => {
    const { getModelForPlan } = await import("@/lib/ai/config");
    expect(getModelForPlan("free")).toBe("claude-sonnet-4-20250514");
  });

  it("starter → claude-sonnet", async () => {
    const { getModelForPlan } = await import("@/lib/ai/config");
    expect(getModelForPlan("starter")).toBe("claude-sonnet-4-20250514");
  });

  it("pro → claude-sonnet", async () => {
    const { getModelForPlan } = await import("@/lib/ai/config");
    expect(getModelForPlan("pro")).toBe("claude-sonnet-4-20250514");
  });

  it("business → claude-opus（高精度モデル）", async () => {
    const { getModelForPlan } = await import("@/lib/ai/config");
    expect(getModelForPlan("business")).toBe("claude-opus-4-6");
  });
});

// ────────────────────────────────────────────
// 2. getChatModelForPlan — チャット用モデル
// ────────────────────────────────────────────
describe("getChatModelForPlan", () => {
  it("free → claude-haiku（軽量モデル）", async () => {
    const { getChatModelForPlan } = await import("@/lib/ai/chat-config");
    expect(getChatModelForPlan("free")).toMatch(/^claude-haiku/);
  });

  it("starter → claude-haiku（軽量モデル）", async () => {
    const { getChatModelForPlan } = await import("@/lib/ai/chat-config");
    expect(getChatModelForPlan("starter")).toMatch(/^claude-haiku/);
  });

  it("pro → claude-sonnet", async () => {
    const { getChatModelForPlan } = await import("@/lib/ai/chat-config");
    expect(getChatModelForPlan("pro")).toBe("claude-sonnet-4-20250514");
  });

  it("business → claude-sonnet", async () => {
    const { getChatModelForPlan } = await import("@/lib/ai/chat-config");
    expect(getChatModelForPlan("business")).toBe("claude-sonnet-4-20250514");
  });
});

// ────────────────────────────────────────────
// 3. モデル ID 形式バリデーション
// ────────────────────────────────────────────
describe("モデル ID 形式バリデーション", () => {
  it("全プランの申請書生成モデルが claude-(haiku|sonnet|opus) で始まる", async () => {
    const { getModelForPlan } = await import("@/lib/ai/config");
    for (const plan of ALL_PLANS) {
      expect(getModelForPlan(plan)).toMatch(/^claude-(haiku|sonnet|opus)-/);
    }
  });

  it("全プランのチャットモデルが claude-(haiku|sonnet|opus) で始まる", async () => {
    const { getChatModelForPlan } = await import("@/lib/ai/chat-config");
    for (const plan of ALL_PLANS) {
      expect(getChatModelForPlan(plan)).toMatch(/^claude-(haiku|sonnet|opus)-/);
    }
  });

  // B1: CHAT_MODEL_BY_PLAN.free が正しいモデル ID を使っているか検証
  // 正しい値は "claude-haiku-4-5-20251001"。修正前は "claude-haiku-4-5-20241022" になっておりFAILする
  it("CHAT_MODEL_BY_PLAN.free は claude-haiku-4-5-20251001 であるべき", async () => {
    // B1: この値が正しい。修正前はFAILする
    const { CHAT_MODEL_BY_PLAN } = await import("@/lib/ai/chat-config");
    expect(CHAT_MODEL_BY_PLAN.free).toBe("claude-haiku-4-5-20251001");
  });

  // B1: CHAT_MODEL_BY_PLAN.starter も同様
  it("CHAT_MODEL_BY_PLAN.starter は claude-haiku-4-5-20251001 であるべき", async () => {
    // B1: この値が正しい。修正前はFAILする
    const { CHAT_MODEL_BY_PLAN } = await import("@/lib/ai/chat-config");
    expect(CHAT_MODEL_BY_PLAN.starter).toBe("claude-haiku-4-5-20251001");
  });

  it("全モデル ID に有効な日付文字列が含まれている（20241022 は無効）", async () => {
    const { getModelForPlan } = await import("@/lib/ai/config");
    const { getChatModelForPlan } = await import("@/lib/ai/chat-config");

    const validDatePattern = /20(2[5-9])\d{4}/; // 2025xxxx 以降
    const invalidDate = "20241022";

    for (const plan of ALL_PLANS) {
      const genModel = getModelForPlan(plan);
      const chatModel = getChatModelForPlan(plan);

      // opus モデルはバージョン番号のみ（日付なし）なのでスキップ
      if (!genModel.includes("opus")) {
        expect(genModel).toMatch(validDatePattern);
      }
      if (!chatModel.includes("opus")) {
        // B1: chatModel の free/starter が 20241022 を含んでいるため、修正前はFAILする
        expect(chatModel).not.toContain(invalidDate);
      }
    }
  });
});

// ────────────────────────────────────────────
// 4. クロスモジュール整合性
// ────────────────────────────────────────────
describe("クロスモジュール整合性", () => {
  it("getAiLimit の値が全プランで PLAN_LIST.aiLimit と一致する", async () => {
    const { getAiLimit, PLAN_LIST } = await import("@/lib/plans");
    for (const planInfo of PLAN_LIST) {
      expect(getAiLimit(planInfo.key)).toBe(planInfo.aiLimit);
    }
  });

  // B3: generate-section/route.ts の PLAN_LIMITS が getAiLimit() と重複している
  // 直接 import できないため（Anthropic SDK の副作用あり）、ソースを読み取って値を検証
  it("generate-section の PLAN_LIMITS が getAiLimit と一致する（B3: 重複検出）", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const { getAiLimit } = await import("@/lib/plans");

    const routePath = path.resolve(
      process.cwd(),
      "src/app/api/ai/generate-section/route.ts"
    );
    const source = fs.readFileSync(routePath, "utf-8");

    // PLAN_LIMITS オブジェクトから各プランの値を抽出
    const planLimitsMatch = source.match(
      /const PLAN_LIMITS[^{]*\{([^}]+)\}/
    );
    expect(planLimitsMatch).not.toBeNull();

    const limitsBlock = planLimitsMatch![1];
    const entries = [...limitsBlock.matchAll(/(\w+):\s*(\d+)/g)];

    expect(entries.length).toBeGreaterThanOrEqual(4);

    for (const [, plan, value] of entries) {
      const expected = getAiLimit(plan as PlanKey);
      expect(
        Number(value),
        `B3: PLAN_LIMITS.${plan} (${value}) が getAiLimit("${plan}") (${expected}) と不一致。重複定義を getAiLimit() に統一すべき`
      ).toBe(expected);
    }
  });

  it("AI_CONFIG の各パラメータが妥当な範囲内", async () => {
    const { AI_CONFIG } = await import("@/lib/ai/config");

    expect(AI_CONFIG.temperature).toBeGreaterThanOrEqual(0);
    expect(AI_CONFIG.temperature).toBeLessThanOrEqual(1);
    expect(AI_CONFIG.maxTokens).toBeGreaterThan(0);
    expect(AI_CONFIG.timeoutMs).toBeGreaterThan(0);
    expect(AI_CONFIG.maxRetries).toBeGreaterThanOrEqual(0);
    expect(AI_CONFIG.retryBaseDelayMs).toBeGreaterThan(0);
  });
});
