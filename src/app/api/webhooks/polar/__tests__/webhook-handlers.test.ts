import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Supabase mock ──
const mockUpdate = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockResolvedValue({ error: null });
const mockFrom = vi.fn(() => ({
  update: mockUpdate.mockReturnValue({ eq: mockEq }),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

// ── PostHog mock ──
vi.mock("@/lib/posthog/track", () => ({
  trackServerEvent: vi.fn(),
  identifyUser: vi.fn(),
}));

// ── Polar config mock ──
vi.mock("@/lib/polar/config", () => ({
  getPolarWebhookSecret: () => "test-webhook-secret",
}));

// ── 環境変数 ──
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.POLAR_STARTER_PRODUCT_ID = "prod_starter_123";
process.env.POLAR_PRO_PRODUCT_ID = "prod_pro_456";
process.env.POLAR_BUSINESS_PRODUCT_ID = "prod_business_789";

// ── Webhooks mock: コールバックを捕捉 ──
type WebhookHandlers = Record<string, (payload: unknown) => Promise<void>>;
let capturedHandlers: WebhookHandlers = {};

vi.mock("@polar-sh/nextjs", () => ({
  Webhooks: (config: Record<string, unknown>) => {
    capturedHandlers = {};
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === "function") {
        capturedHandlers[key] = value as (payload: unknown) => Promise<void>;
      }
    }
    return () => new Response("ok");
  },
}));

// route.ts を動的 import してハンドラーを登録
beforeEach(async () => {
  vi.clearAllMocks();
  mockEq.mockResolvedValue({ error: null });

  // 冪等性キャッシュをリセットするために毎回再 import
  vi.resetModules();
  vi.doMock("@supabase/supabase-js", () => ({
    createClient: () => ({
      from: mockFrom,
    }),
  }));
  vi.doMock("@/lib/posthog/track", () => ({
    trackServerEvent: vi.fn(),
    identifyUser: vi.fn(),
  }));
  vi.doMock("@/lib/polar/config", () => ({
    getPolarWebhookSecret: () => "test-webhook-secret",
  }));
  vi.doMock("@polar-sh/nextjs", () => ({
    Webhooks: (config: Record<string, unknown>) => {
      capturedHandlers = {};
      for (const [key, value] of Object.entries(config)) {
        if (typeof value === "function") {
          capturedHandlers[key] = value as (payload: unknown) => Promise<void>;
        }
      }
      return () => new Response("ok");
    },
  }));

  await import("@/app/api/webhooks/polar/route");
});

// ── テストペイロード生成 ──
function makeSubscriptionPayload(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      id: "sub_001",
      productId: "prod_pro_456",
      customerId: "cust_001",
      status: "active",
      modifiedAt: new Date("2025-01-01"),
      customer: {
        externalId: "user_123",
      },
      ...overrides,
    },
  };
}

describe("Webhook handlers", () => {
  describe("onSubscriptionCreated", () => {
    it("新規サブスクリプションで user_profiles.plan を更新", async () => {
      const payload = makeSubscriptionPayload({
        productId: "prod_pro_456",
      });

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockFrom).toHaveBeenCalledWith("user_profiles");
      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "pro",
        polar_customer_id: "cust_001",
        polar_subscription_id: "sub_001",
      });
      expect(mockEq).toHaveBeenCalledWith("id", "user_123");
    });

    it("externalId がない場合は何もしない", async () => {
      const payload = makeSubscriptionPayload();
      payload.data.customer.externalId = "";

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockFrom).not.toHaveBeenCalled();
    });

    it("不明な productId の場合は何もしない", async () => {
      const payload = makeSubscriptionPayload({
        productId: "unknown_product",
      });

      await capturedHandlers.onSubscriptionCreated(payload);

      // getPlanKeyByProductId が null を返すので DB 更新しない
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("Starter プランの productId で starter に設定", async () => {
      const payload = makeSubscriptionPayload({
        productId: "prod_starter_123",
      });

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ plan: "starter" })
      );
    });

    it("Business プランの productId で business に設定", async () => {
      const payload = makeSubscriptionPayload({
        productId: "prod_business_789",
      });

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ plan: "business" })
      );
    });
  });

  describe("onSubscriptionUpdated", () => {
    it("active 状態でプラン変更を DB に反映", async () => {
      const payload = makeSubscriptionPayload({
        status: "active",
        productId: "prod_business_789",
      });

      await capturedHandlers.onSubscriptionUpdated(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "business",
        polar_customer_id: "cust_001",
        polar_subscription_id: "sub_001",
      });
    });

    it("trialing 状態でもプラン変更を反映", async () => {
      const payload = makeSubscriptionPayload({
        status: "trialing",
        productId: "prod_starter_123",
      });

      await capturedHandlers.onSubscriptionUpdated(payload);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ plan: "starter" })
      );
    });

    it("past_due 状態で free に戻す", async () => {
      const payload = makeSubscriptionPayload({
        status: "past_due",
      });

      await capturedHandlers.onSubscriptionUpdated(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "free",
        polar_subscription_id: null,
      });
    });

    it("unpaid 状態で free に戻す", async () => {
      const payload = makeSubscriptionPayload({
        status: "unpaid",
      });

      await capturedHandlers.onSubscriptionUpdated(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "free",
        polar_subscription_id: null,
      });
    });

    it("externalId がない場合は何もしない", async () => {
      const payload = makeSubscriptionPayload({ status: "active" });
      payload.data.customer.externalId = "";

      await capturedHandlers.onSubscriptionUpdated(payload);

      expect(mockFrom).not.toHaveBeenCalled();
    });
  });

  describe("onSubscriptionCanceled", () => {
    it("キャンセル時に free に戻す", async () => {
      const payload = makeSubscriptionPayload();

      await capturedHandlers.onSubscriptionCanceled(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "free",
        polar_subscription_id: null,
      });
      expect(mockEq).toHaveBeenCalledWith("id", "user_123");
    });
  });

  describe("onSubscriptionRevoked", () => {
    it("取り消し時に free に戻す", async () => {
      const payload = makeSubscriptionPayload();

      await capturedHandlers.onSubscriptionRevoked(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "free",
        polar_subscription_id: null,
      });
    });
  });

  describe("onSubscriptionActive", () => {
    it("アクティベーション時にプランを正しく設定", async () => {
      const payload = makeSubscriptionPayload({
        productId: "prod_pro_456",
      });

      await capturedHandlers.onSubscriptionActive(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "pro",
        polar_customer_id: "cust_001",
        polar_subscription_id: "sub_001",
      });
    });
  });

  describe("DB エラー処理", () => {
    it("DB 更新エラー時にコンソールエラーを出力（クラッシュしない）", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockEq.mockResolvedValueOnce({
        error: { message: "DB connection error" },
      });

      const payload = makeSubscriptionPayload();
      await capturedHandlers.onSubscriptionCreated(payload);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
