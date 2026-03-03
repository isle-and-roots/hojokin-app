import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest";
import { setupPlanEnvVars, ALL_PLANS } from "@/test-utils/mocks";
import type { PlanKey } from "@/lib/plans";

beforeAll(() => {
  setupPlanEnvVars();
});

// ────────────────────────────────────────────
// 1. getAiLimit — 月間 AI 生成上限
// ────────────────────────────────────────────
describe("getAiLimit", () => {
  it("free プランは月 3 回", async () => {
    const { getAiLimit } = await import("@/lib/plans");
    expect(getAiLimit("free")).toBe(3);
  });

  it("starter プランは月 15 回", async () => {
    const { getAiLimit } = await import("@/lib/plans");
    expect(getAiLimit("starter")).toBe(15);
  });

  it("pro プランは月 100 回", async () => {
    const { getAiLimit } = await import("@/lib/plans");
    expect(getAiLimit("pro")).toBe(100);
  });

  it("business プランは月 500 回", async () => {
    const { getAiLimit } = await import("@/lib/plans");
    expect(getAiLimit("business")).toBe(500);
  });

  it("上位プランほど上限が大きい（単調増加）", async () => {
    const { getAiLimit } = await import("@/lib/plans");
    const ordered: PlanKey[] = ["free", "starter", "pro", "business"];
    for (let i = 1; i < ordered.length; i++) {
      expect(getAiLimit(ordered[i])).toBeGreaterThan(getAiLimit(ordered[i - 1]));
    }
  });

  it("不明なプランキーはフォールバック値（3）を返す", async () => {
    const { getAiLimit } = await import("@/lib/plans");
    // PlanKey 以外の値を渡した場合のフォールバック動作
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getAiLimit("unknown" as any)).toBe(3);
  });
});

// ────────────────────────────────────────────
// 2. getChatDailyLimit — チャット日次上限
// ────────────────────────────────────────────
describe("getChatDailyLimit", () => {
  it("free プランは日 3 回", async () => {
    const { getChatDailyLimit } = await import("@/lib/ai/chat-config");
    expect(getChatDailyLimit("free")).toBe(3);
  });

  it("starter プランは日 10 回", async () => {
    const { getChatDailyLimit } = await import("@/lib/ai/chat-config");
    expect(getChatDailyLimit("starter")).toBe(10);
  });

  it("pro プランは日 20 回", async () => {
    const { getChatDailyLimit } = await import("@/lib/ai/chat-config");
    expect(getChatDailyLimit("pro")).toBe(20);
  });

  it("business プランは日 50 回", async () => {
    const { getChatDailyLimit } = await import("@/lib/ai/chat-config");
    expect(getChatDailyLimit("business")).toBe(50);
  });

  it("上位プランほど日次上限が大きい", async () => {
    const { getChatDailyLimit } = await import("@/lib/ai/chat-config");
    const ordered: PlanKey[] = ["free", "starter", "pro", "business"];
    for (let i = 1; i < ordered.length; i++) {
      expect(getChatDailyLimit(ordered[i])).toBeGreaterThan(
        getChatDailyLimit(ordered[i - 1])
      );
    }
  });

  it("不明なプランキーはフォールバック値（free の 3）を返す", async () => {
    const { getChatDailyLimit } = await import("@/lib/ai/chat-config");
    // PlanKey 以外の値を渡した場合のフォールバック動作
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getChatDailyLimit("unknown" as any)).toBe(3);
  });
});

// ────────────────────────────────────────────
// 3. 境界値テスト（論理的クォータチェック）
//    DB 不要 — getAiLimit の返り値と使用回数を比較するロジック
// ────────────────────────────────────────────
describe("クォータ境界値チェック", () => {
  /**
   * サーバー側の判定ロジックを再現:
   * used < limit → 生成可、used >= limit → 拒否
   */
  function canGenerate(used: number, limit: number): boolean {
    return used < limit;
  }

  it.each(ALL_PLANS)(
    "%s: 上限 -1 回使用済みなら生成可",
    async (plan) => {
      const { getAiLimit } = await import("@/lib/plans");
      const limit = getAiLimit(plan);
      expect(canGenerate(limit - 1, limit)).toBe(true);
    }
  );

  it.each(ALL_PLANS)(
    "%s: 上限ちょうど使用済みなら生成不可",
    async (plan) => {
      const { getAiLimit } = await import("@/lib/plans");
      const limit = getAiLimit(plan);
      expect(canGenerate(limit, limit)).toBe(false);
    }
  );

  it.each(ALL_PLANS)(
    "%s: 上限を超過していても生成不可",
    async (plan) => {
      const { getAiLimit } = await import("@/lib/plans");
      const limit = getAiLimit(plan);
      expect(canGenerate(limit + 1, limit)).toBe(false);
    }
  );

  it("使用 0 回なら全プランで生成可", async () => {
    const { getAiLimit } = await import("@/lib/plans");
    for (const plan of ALL_PLANS) {
      expect(canGenerate(0, getAiLimit(plan))).toBe(true);
    }
  });
});

// ────────────────────────────────────────────
// 4. rateLimit — インメモリ Rate Limiter
// ────────────────────────────────────────────
describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("初回呼び出しは成功し remaining = limit - 1", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const result = rateLimit("test-first-call", 5, 60_000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("limit 回目の呼び出しまでは成功する", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = "test-at-limit";
    const limit = 3;
    const windowMs = 60_000;

    for (let i = 0; i < limit; i++) {
      const result = rateLimit(key, limit, windowMs);
      expect(result.success).toBe(true);
    }
  });

  it("limit + 1 回目は拒否される", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = "test-over-limit";
    const limit = 3;
    const windowMs = 60_000;

    // limit 回まで消費
    for (let i = 0; i < limit; i++) {
      rateLimit(key, limit, windowMs);
    }

    const result = rateLimit(key, limit, windowMs);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("ウィンドウ経過後はリセットされ再び成功する", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = "test-window-reset";
    const limit = 2;
    const windowMs = 10_000;

    // limit 回消費
    for (let i = 0; i < limit; i++) {
      rateLimit(key, limit, windowMs);
    }
    // 超過
    expect(rateLimit(key, limit, windowMs).success).toBe(false);

    // ウィンドウ経過
    vi.advanceTimersByTime(windowMs + 1);

    // リセット後は再び成功
    const result = rateLimit(key, limit, windowMs);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(limit - 1);
  });

  it("異なるキーは独立してカウントされる", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const limit = 1;
    const windowMs = 60_000;

    const r1 = rateLimit("key-a", limit, windowMs);
    const r2 = rateLimit("key-b", limit, windowMs);

    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);

    // key-a は上限到達、key-b はまだ別キーで使えない（上限 1 なので両方到達）
    expect(rateLimit("key-a", limit, windowMs).success).toBe(false);
    expect(rateLimit("key-b", limit, windowMs).success).toBe(false);
  });

  it("remaining は呼び出しごとに減少する", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = "test-remaining-decrement";
    const limit = 4;
    const windowMs = 60_000;

    const r1 = rateLimit(key, limit, windowMs);
    expect(r1.remaining).toBe(3);

    const r2 = rateLimit(key, limit, windowMs);
    expect(r2.remaining).toBe(2);

    const r3 = rateLimit(key, limit, windowMs);
    expect(r3.remaining).toBe(1);

    const r4 = rateLimit(key, limit, windowMs);
    expect(r4.remaining).toBe(0);
  });
});
