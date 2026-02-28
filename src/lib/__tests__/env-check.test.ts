import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("env-check", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    // Clear all relevant env vars before each test
    const allVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "ANTHROPIC_API_KEY",
      "POLAR_ACCESS_TOKEN",
      "POLAR_WEBHOOK_SECRET",
      "POLAR_MODE",
      "POLAR_STARTER_PRODUCT_ID",
      "POLAR_PRO_PRODUCT_ID",
      "POLAR_BUSINESS_PRODUCT_ID",
      "NEXT_PUBLIC_SITE_URL",
      "RESEND_API_KEY",
      "DD_API_KEY",
      "NEXT_PUBLIC_POSTHOG_KEY",
      "POLAR_STARTER_ANNUAL_PRODUCT_ID",
      "POLAR_PRO_ANNUAL_PRODUCT_ID",
      "POLAR_BUSINESS_ANNUAL_PRODUCT_ID",
    ];
    for (const v of allVars) {
      delete process.env[v];
    }
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("checkEnvironment", () => {
    it("全 required 変数が設定されていれば全て ok を返す", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
      process.env.ANTHROPIC_API_KEY = "sk-ant-xxx";
      process.env.POLAR_ACCESS_TOKEN = "polar-token";
      process.env.POLAR_WEBHOOK_SECRET = "polar-secret";
      process.env.POLAR_MODE = "sandbox";
      process.env.POLAR_STARTER_PRODUCT_ID = "prod_starter";
      process.env.POLAR_PRO_PRODUCT_ID = "prod_pro";
      process.env.POLAR_BUSINESS_PRODUCT_ID = "prod_business";
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

      const { checkEnvironment } = await import("@/lib/env-check");
      const results = checkEnvironment();
      const required = results.filter((r) => r.required);
      expect(required.every((r) => r.status === "ok")).toBe(true);
    });

    it("未設定の required 変数は missing を返す", async () => {
      const { checkEnvironment } = await import("@/lib/env-check");
      const results = checkEnvironment();
      const missing = results.filter((r) => r.required && r.status === "missing");
      expect(missing.length).toBeGreaterThan(0);
    });

    it("optional 変数は未設定でも required=false を返す", async () => {
      const { checkEnvironment } = await import("@/lib/env-check");
      const results = checkEnvironment();
      const optionals = results.filter((r) => !r.required);
      expect(optionals.length).toBeGreaterThan(0);
      for (const opt of optionals) {
        expect(opt.required).toBe(false);
      }
    });

    it("RESEND_API_KEY が設定されていれば optional が ok になる", async () => {
      process.env.RESEND_API_KEY = "re_xxx";
      const { checkEnvironment } = await import("@/lib/env-check");
      const results = checkEnvironment();
      const resend = results.find((r) => r.name === "RESEND_API_KEY");
      expect(resend?.status).toBe("ok");
      expect(resend?.required).toBe(false);
    });

    it("全変数が { name, status, required } を持つ", async () => {
      const { checkEnvironment } = await import("@/lib/env-check");
      const results = checkEnvironment();
      for (const r of results) {
        expect(r).toHaveProperty("name");
        expect(r).toHaveProperty("status");
        expect(r).toHaveProperty("required");
        expect(["ok", "missing", "invalid"]).toContain(r.status);
        expect(typeof r.required).toBe("boolean");
      }
    });
  });

  describe("isProductionReady", () => {
    it("required 変数が全て揃っていれば true を返す", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
      process.env.ANTHROPIC_API_KEY = "sk-ant-xxx";
      process.env.POLAR_ACCESS_TOKEN = "polar-token";
      process.env.POLAR_WEBHOOK_SECRET = "polar-secret";
      process.env.POLAR_MODE = "sandbox";
      process.env.POLAR_STARTER_PRODUCT_ID = "prod_starter";
      process.env.POLAR_PRO_PRODUCT_ID = "prod_pro";
      process.env.POLAR_BUSINESS_PRODUCT_ID = "prod_business";
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

      const { isProductionReady } = await import("@/lib/env-check");
      expect(isProductionReady()).toBe(true);
    });

    it("required 変数が1つでも欠けていれば false を返す", async () => {
      // Set all but one
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
      process.env.ANTHROPIC_API_KEY = "sk-ant-xxx";
      process.env.POLAR_ACCESS_TOKEN = "polar-token";
      process.env.POLAR_WEBHOOK_SECRET = "polar-secret";
      process.env.POLAR_MODE = "sandbox";
      process.env.POLAR_STARTER_PRODUCT_ID = "prod_starter";
      process.env.POLAR_PRO_PRODUCT_ID = "prod_pro";
      process.env.POLAR_BUSINESS_PRODUCT_ID = "prod_business";
      // NEXT_PUBLIC_SITE_URL is missing

      const { isProductionReady } = await import("@/lib/env-check");
      expect(isProductionReady()).toBe(false);
    });

    it("全て未設定であれば false を返す", async () => {
      const { isProductionReady } = await import("@/lib/env-check");
      expect(isProductionReady()).toBe(false);
    });
  });

  describe("REQUIRED_ENVS / OPTIONAL_ENVS", () => {
    it("REQUIRED_ENVS に 11 件含まれる", async () => {
      const { REQUIRED_ENVS } = await import("@/lib/env-check");
      expect(REQUIRED_ENVS.length).toBe(11);
    });

    it("OPTIONAL_ENVS に annual product ID が含まれる", async () => {
      const { OPTIONAL_ENVS } = await import("@/lib/env-check");
      expect(OPTIONAL_ENVS).toContain("POLAR_STARTER_ANNUAL_PRODUCT_ID");
      expect(OPTIONAL_ENVS).toContain("POLAR_PRO_ANNUAL_PRODUCT_ID");
      expect(OPTIONAL_ENVS).toContain("POLAR_BUSINESS_ANNUAL_PRODUCT_ID");
    });
  });
});
