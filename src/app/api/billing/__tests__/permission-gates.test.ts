import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// ── 環境変数（PLAN_LIST が読み込み時に参照するため、vi.mock より先に設定） ──
beforeAll(() => {
  process.env.POLAR_STARTER_PRODUCT_ID = "prod_starter_123";
  process.env.POLAR_PRO_PRODUCT_ID = "prod_pro_456";
  process.env.POLAR_BUSINESS_PRODUCT_ID = "prod_business_789";
  process.env.POLAR_STARTER_ANNUAL_PRODUCT_ID = "prod_starter_annual_123";
  process.env.POLAR_PRO_ANNUAL_PRODUCT_ID = "prod_pro_annual_456";
  process.env.POLAR_BUSINESS_ANNUAL_PRODUCT_ID = "prod_business_annual_789";
  process.env.NEXT_PUBLIC_SITE_URL = "https://test.example.com";
});

// ── Supabase mock ──
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: mockGetUser },
  }),
}));

// ── Polar mock ──
const mockCheckoutsCreate = vi.fn().mockResolvedValue({
  url: "https://checkout.polar.sh/test-session",
});

vi.mock("@/lib/polar/config", () => ({
  getPolar: () => ({
    checkouts: {
      create: mockCheckoutsCreate,
    },
  }),
}));

// ── Rate limit mock ──
const mockRateLimit = vi.fn().mockReturnValue({ success: true, remaining: 4 });

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: (...args: unknown[]) => mockRateLimit(...args),
}));

// ── Datadog mock ──
vi.mock("@/lib/datadog", () => ({
  withSpan: vi.fn().mockImplementation(
    (_name: string, _opts: unknown, fn: () => unknown) => fn()
  ),
}));

vi.mock("@/lib/datadog/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ── PostHog mock ──
vi.mock("@/lib/posthog/track", () => ({
  trackServerEvent: vi.fn(),
}));

vi.mock("@/lib/posthog/events", () => ({
  EVENTS: {
    CHECKOUT_INITIATED: "checkout_initiated",
  },
}));

// ── Test helpers ──

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function setupUnauthenticated() {
  mockGetUser.mockResolvedValue({
    data: { user: null },
    error: { message: "Not authenticated" },
  });
}

function setupAuthenticated() {
  mockGetUser.mockResolvedValue({
    data: { user: { id: "user-123", email: "test@example.com" } },
    error: null,
  });
}

// ── Tests ──

describe("Billing Checkout /api/billing/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockReturnValue({ success: true, remaining: 4 });
    mockCheckoutsCreate.mockResolvedValue({
      url: "https://checkout.polar.sh/test-session",
    });
  });

  async function callCheckoutPost(body: unknown) {
    const { POST } = await import("@/app/api/billing/checkout/route");
    const req = makeRequest(body);
    return POST(req);
  }

  it("未認証 → 401", async () => {
    setupUnauthenticated();

    const res = await callCheckoutPost({ plan: "pro" });
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toBe("ログインしてください");
  });

  it("plan='free' → 400 '無効なプラン'", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({ plan: "free" });
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("無効なプランです");
  });

  it("plan='starter' → チェックアウトURL返却", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({ plan: "starter" });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.url).toBe("https://checkout.polar.sh/test-session");

    // Polar に正しい productId が渡されることを確認
    expect(mockCheckoutsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        products: ["prod_starter_123"],
        externalCustomerId: "user-123",
        currency: "jpy",
      })
    );
  });

  it("plan='pro' → チェックアウトURL返却", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({ plan: "pro" });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.url).toBe("https://checkout.polar.sh/test-session");

    expect(mockCheckoutsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        products: ["prod_pro_456"],
      })
    );
  });

  it("plan='business' → チェックアウトURL返却", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({ plan: "business" });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.url).toBe("https://checkout.polar.sh/test-session");

    expect(mockCheckoutsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        products: ["prod_business_789"],
      })
    );
  });

  it("不明な plan 値 → 400", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({ plan: "enterprise" });
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("無効なプランです");
  });

  it("billingInterval='annual' → 年額 productId を使用", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({
      plan: "pro",
      billingInterval: "annual",
    });
    expect(res.status).toBe(200);

    expect(mockCheckoutsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        products: ["prod_pro_annual_456"],
      })
    );
  });

  it("billingInterval='monthly' → 月額 productId を使用", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({
      plan: "starter",
      billingInterval: "monthly",
    });
    expect(res.status).toBe(200);

    expect(mockCheckoutsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        products: ["prod_starter_123"],
      })
    );
  });

  it("billingInterval 不正値 → 400", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({
      plan: "pro",
      billingInterval: "weekly",
    });
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("無効な請求間隔です");
  });

  it("レート制限超過 → 429", async () => {
    setupAuthenticated();
    mockRateLimit.mockReturnValue({ success: false, remaining: 0 });

    const res = await callCheckoutPost({ plan: "pro" });
    expect(res.status).toBe(429);

    const json = await res.json();
    expect(json.error).toContain("リクエストが多すぎます");
  });

  it("レート制限の呼び出しパラメータが正しい", async () => {
    setupAuthenticated();

    await callCheckoutPost({ plan: "pro" });

    expect(mockRateLimit).toHaveBeenCalledWith(
      "checkout:user-123",
      5,          // CHECKOUT_RATE_LIMIT
      3600000     // CHECKOUT_WINDOW_MS (1時間)
    );
  });

  it("billingInterval 省略時は monthly として metadata に記録", async () => {
    setupAuthenticated();

    const res = await callCheckoutPost({ plan: "pro" });
    expect(res.status).toBe(200);

    expect(mockCheckoutsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: { plan: "pro", billingInterval: "monthly" },
      })
    );
  });

  it("successUrl に origin が含まれる", async () => {
    setupAuthenticated();

    await callCheckoutPost({ plan: "starter" });

    expect(mockCheckoutsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        successUrl: expect.stringContaining("/pricing?success=true"),
      })
    );
  });

  it("Polar API エラー → 500", async () => {
    setupAuthenticated();
    mockCheckoutsCreate.mockRejectedValue(new Error("Polar API failure"));

    const res = await callCheckoutPost({ plan: "pro" });
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("チェックアウトの作成に失敗しました");
  });
});
