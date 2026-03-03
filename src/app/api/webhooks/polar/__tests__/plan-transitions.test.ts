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
process.env.POLAR_STARTER_ANNUAL_PRODUCT_ID = "prod_starter_annual_123";
process.env.POLAR_PRO_ANNUAL_PRODUCT_ID = "prod_pro_annual_456";
process.env.POLAR_BUSINESS_ANNUAL_PRODUCT_ID = "prod_business_annual_789";

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
function makePayload(productId: string, overrides: Record<string, unknown> = {}) {
  return {
    data: {
      id: "sub_test_123",
      productId,
      status: "active",
      customerId: "polar_cus_123",
      recurringInterval: "month",
      modifiedAt: new Date("2025-06-01"),
      product: { id: productId, name: "Test Plan" },
      customer: {
        externalId: "user-test-123",
        email: "test@example.com",
      },
      ...overrides,
    },
  };
}

describe("プラン遷移フロー", () => {
  describe("新規サブスクリプション", () => {
    it("Starter月額 → plan='starter'に更新", async () => {
      const payload = makePayload("prod_starter_123");

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockFrom).toHaveBeenCalledWith("user_profiles");
      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "starter",
        polar_customer_id: "polar_cus_123",
        polar_subscription_id: "sub_test_123",
        subscription_interval: "monthly",
      });
      expect(mockEq).toHaveBeenCalledWith("id", "user-test-123");
    });

    it("Pro年額 → plan='pro'に更新", async () => {
      const payload = makePayload("prod_pro_annual_456", {
        recurringInterval: "year",
      });

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "pro",
        polar_customer_id: "polar_cus_123",
        polar_subscription_id: "sub_test_123",
        subscription_interval: "annual",
      });
    });

    it("Business月額 → plan='business'に更新", async () => {
      const payload = makePayload("prod_business_789");

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "business",
        polar_customer_id: "polar_cus_123",
        polar_subscription_id: "sub_test_123",
        subscription_interval: "monthly",
      });
    });
  });

  describe("アップグレード", () => {
    it("free→starter (Starter product ID)", async () => {
      const payload = makePayload("prod_starter_123", {
        id: "sub_upgrade_001",
      });

      await capturedHandlers.onSubscriptionActive(payload);

      expect(mockFrom).toHaveBeenCalledWith("user_profiles");
      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "starter",
        polar_customer_id: "polar_cus_123",
        polar_subscription_id: "sub_upgrade_001",
        subscription_interval: "monthly",
      });
      expect(mockEq).toHaveBeenCalledWith("id", "user-test-123");
    });

    it("starter→pro (Pro product ID)", async () => {
      const payload = makePayload("prod_pro_456", {
        id: "sub_upgrade_002",
        status: "active",
      });

      await capturedHandlers.onSubscriptionUpdated(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "pro",
        polar_customer_id: "polar_cus_123",
        polar_subscription_id: "sub_upgrade_002",
        subscription_interval: "monthly",
      });
    });

    it("pro→business (Business product ID)", async () => {
      const payload = makePayload("prod_business_789", {
        id: "sub_upgrade_003",
        status: "active",
      });

      await capturedHandlers.onSubscriptionUpdated(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "business",
        polar_customer_id: "polar_cus_123",
        polar_subscription_id: "sub_upgrade_003",
        subscription_interval: "monthly",
      });
    });
  });

  describe("ダウングレード・解約", () => {
    it("onSubscriptionCanceled → plan='free'", async () => {
      const payload = makePayload("prod_pro_456");

      await capturedHandlers.onSubscriptionCanceled(payload);

      expect(mockFrom).toHaveBeenCalledWith("user_profiles");
      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "free",
        polar_subscription_id: null,
      });
      expect(mockEq).toHaveBeenCalledWith("id", "user-test-123");
    });

    it("onSubscriptionRevoked → plan='free'", async () => {
      const payload = makePayload("prod_business_789");

      await capturedHandlers.onSubscriptionRevoked(payload);

      expect(mockFrom).toHaveBeenCalledWith("user_profiles");
      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "free",
        polar_subscription_id: null,
      });
      expect(mockEq).toHaveBeenCalledWith("id", "user-test-123");
    });

    it("解約後もpolar_customer_idは維持される", async () => {
      const payload = makePayload("prod_pro_456", {
        customerId: "polar_cus_keep_me",
      });

      await capturedHandlers.onSubscriptionCanceled(payload);

      // update に polar_customer_id が含まれていない = null にリセットしない
      const updateArg = mockUpdate.mock.calls[0][0] as Record<string, unknown>;
      expect(updateArg).toEqual({
        plan: "free",
        polar_subscription_id: null,
      });
      // polar_customer_id がキーとして存在しないことを明示的に確認
      expect(updateArg).not.toHaveProperty("polar_customer_id");
    });
  });

  describe("年額プラン", () => {
    it("Starter年額 → plan='starter'", async () => {
      const payload = makePayload("prod_starter_annual_123", {
        recurringInterval: "year",
      });

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          plan: "starter",
          subscription_interval: "annual",
        })
      );
    });

    it("Pro年額 → plan='pro'", async () => {
      const payload = makePayload("prod_pro_annual_456", {
        recurringInterval: "year",
      });

      await capturedHandlers.onSubscriptionActive(payload);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          plan: "pro",
          subscription_interval: "annual",
        })
      );
    });

    it("Business年額 → plan='business'", async () => {
      const payload = makePayload("prod_business_annual_789", {
        recurringInterval: "year",
      });

      await capturedHandlers.onSubscriptionActive(payload);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          plan: "business",
          subscription_interval: "annual",
        })
      );
    });
  });

  describe("エッジケース", () => {
    it("不明なproductId → planは変更しない(ハンドラーが早期リターン)", async () => {
      const payload = makePayload("prod_unknown_999");

      await capturedHandlers.onSubscriptionCreated(payload);

      // getPlanKeyByProductId が null を返すため DB 更新されない
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("externalId欠損 → 処理スキップ", async () => {
      const payload = makePayload("prod_pro_456", {
        customer: { externalId: "", email: "test@example.com" },
      });

      await capturedHandlers.onSubscriptionCreated(payload);

      expect(mockFrom).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("DB更新エラー → ログ出力してクラッシュしない", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockEq.mockResolvedValueOnce({
        error: { message: "connection refused", code: "ECONNREFUSED" },
      });

      const payload = makePayload("prod_pro_456");

      // クラッシュしないことを確認（例外が投げられない）
      await expect(
        capturedHandlers.onSubscriptionCreated(payload)
      ).resolves.toBeUndefined();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("DB update error"),
        expect.objectContaining({ message: "connection refused" })
      );

      consoleSpy.mockRestore();
    });

    it("冪等性 — 同一イベント2回処理しても状態が一貫", async () => {
      const payload = makePayload("prod_pro_456", {
        id: "sub_idempotent_001",
      });

      // 1回目: 正常に処理される
      await capturedHandlers.onSubscriptionCreated(payload);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ plan: "pro" })
      );

      // モックをクリア（呼び出し記録のみ）
      mockFrom.mockClear();
      mockUpdate.mockClear();
      mockEq.mockClear();
      // update チェーンを再構成
      mockEq.mockResolvedValue({ error: null });
      mockUpdate.mockReturnValue({ eq: mockEq });
      mockFrom.mockImplementation(() => ({
        update: mockUpdate.mockReturnValue({ eq: mockEq }),
      }));

      // 2回目: 冪等性チェックにより処理がスキップされる
      await capturedHandlers.onSubscriptionCreated(payload);
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("externalId が undefined の場合も処理スキップ", async () => {
      const payload = makePayload("prod_starter_123", {
        customer: { email: "no-id@example.com" },
      });

      await capturedHandlers.onSubscriptionActive(payload);

      expect(mockFrom).not.toHaveBeenCalled();
    });

    it("onSubscriptionUpdated で不明なproductIdかつactive状態 → DB更新されない", async () => {
      const payload = makePayload("prod_nonexistent_000", {
        status: "active",
      });

      await capturedHandlers.onSubscriptionUpdated(payload);

      // getPlanKeyByProductId が null を返すため、active ブランチでも更新しない
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("onSubscriptionUpdated で past_due 状態 → free に戻す", async () => {
      const payload = makePayload("prod_pro_456", {
        status: "past_due",
      });

      await capturedHandlers.onSubscriptionUpdated(payload);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "free",
        polar_subscription_id: null,
      });
    });

    it("onSubscriptionRevoked で externalId 欠損 → 処理スキップ", async () => {
      const payload = makePayload("prod_business_789", {
        customer: { externalId: "", email: "test@example.com" },
      });

      await capturedHandlers.onSubscriptionRevoked(payload);

      expect(mockFrom).not.toHaveBeenCalled();
    });
  });
});
