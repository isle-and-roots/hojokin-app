/**
 * 共有テストユーティリティ — プラン権限テスト用モックファクトリー
 */
import { vi } from "vitest";
import type { PlanKey } from "@/lib/plans";

// ── 定数 ──
export const ALL_PLANS: PlanKey[] = ["free", "starter", "pro", "business"];
export const PAID_PLANS: PlanKey[] = ["starter", "pro", "business"];

// ── 環境変数セットアップ ──
export function setupPlanEnvVars() {
  process.env.POLAR_STARTER_PRODUCT_ID = "prod_starter_123";
  process.env.POLAR_PRO_PRODUCT_ID = "prod_pro_456";
  process.env.POLAR_BUSINESS_PRODUCT_ID = "prod_business_789";
  process.env.POLAR_STARTER_ANNUAL_PRODUCT_ID = "prod_starter_annual_123";
  process.env.POLAR_PRO_ANNUAL_PRODUCT_ID = "prod_pro_annual_456";
  process.env.POLAR_BUSINESS_ANNUAL_PRODUCT_ID = "prod_business_annual_789";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  process.env.NEXT_PUBLIC_SITE_URL = "https://test.example.com";
}

// ── ユーザープロフィール行ファクトリー ──
export function makeUserProfile(
  plan: PlanKey,
  overrides: Record<string, unknown> = {}
) {
  return {
    plan,
    ai_generations_used: 0,
    ai_generations_reset_at: new Date().toISOString(),
    polar_customer_id: plan === "free" ? null : `cus_${plan}_123`,
    polar_subscription_id: plan === "free" ? null : `sub_${plan}_123`,
    ...overrides,
  };
}

// ── モックユーザー ──
export const MOCK_USER = {
  id: "user-test-123",
  email: "test@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
};

// ── Supabase モック構築 ──
export interface MockSupabaseConfig {
  /** null ならユーザー未認証 */
  user: typeof MOCK_USER | null;
  /** user_profiles テーブルの返却値 */
  userProfile: ReturnType<typeof makeUserProfile> | null;
  /** chat_messages の count 値 */
  chatMessageCount?: number | null;
  /** chat_messages count クエリのエラー */
  chatCountError?: { message: string } | null;
  /** セッション作成 */
  sessionInsert?: { id: string } | null;
  /** セッション所有権確認 */
  sessionSelect?: { id: string } | null;
  /** 履歴行 */
  historyRows?: Array<{ role: string; content: string }>;
}

export function createMockSupabaseClient(config: Partial<MockSupabaseConfig> = {}) {
  const {
    user = MOCK_USER,
    userProfile = makeUserProfile("free"),
    chatMessageCount = 0,
    chatCountError = null,
    sessionInsert = { id: "session-test-123" },
    sessionSelect = { id: "session-test-123" },
    historyRows = [],
  } = config;

  // chainable mock builder
  const buildChain = (resolvedValue: unknown) => {
    const chain: Record<string, ReturnType<typeof vi.fn>> = {};
    chain.select = vi.fn().mockReturnValue(chain);
    chain.insert = vi.fn().mockReturnValue(chain);
    chain.update = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.gte = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockReturnValue(chain);
    chain.single = vi.fn().mockResolvedValue(resolvedValue);
    return chain;
  };

  const fromMap: Record<string, ReturnType<typeof buildChain>> = {
    user_profiles: buildChain({ data: userProfile, error: null }),
    chat_messages: (() => {
      const chain = buildChain({ data: historyRows, error: null });
      // count query: select("id", { count: "exact", head: true })
      const originalSelect = chain.select;
      chain.select = vi.fn().mockImplementation(
        (_cols: string, opts?: { count?: string; head?: boolean }) => {
          if (opts?.count === "exact") {
            // Override the chain terminal for count queries
            chain.gte = vi.fn().mockResolvedValue({
              count: chatMessageCount,
              error: chatCountError,
            });
          }
          return chain;
        }
      );
      // For non-count selects, keep original
      if (!originalSelect) {/* noop */}
      // insert returns chain for .select().single()
      chain.insert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: sessionInsert,
            error: sessionInsert ? null : { message: "insert failed" },
          }),
        }),
      });
      return chain;
    })(),
    chat_sessions: (() => {
      const chain = buildChain({ data: sessionSelect, error: null });
      chain.insert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: sessionInsert,
            error: sessionInsert ? null : { message: "insert failed" },
          }),
        }),
      });
      return chain;
    })(),
  };

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: null,
      }),
    },
    from: vi.fn().mockImplementation((table: string) => {
      if (fromMap[table]) return fromMap[table];
      return buildChain({ data: null, error: null });
    }),
  };
}

// ── Webhook ペイロードファクトリー ──
export function makeSubscriptionPayload(overrides: Record<string, unknown> = {}) {
  return {
    type: "subscription.active",
    data: {
      id: "sub_test_123",
      status: "active",
      customerId: "polar_cus_123",
      product: {
        id: process.env.POLAR_PRO_PRODUCT_ID ?? "prod_pro_456",
        name: "Pro Plan",
      },
      customer: {
        externalId: "user-test-123",
        email: "test@example.com",
      },
      recurring_interval: "month",
      ...overrides,
    },
  };
}
