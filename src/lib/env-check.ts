export interface EnvCheckResult {
  name: string;
  status: "ok" | "missing" | "invalid";
  required: boolean;
}

export const REQUIRED_ENVS = [
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
] as const;

export const OPTIONAL_ENVS = [
  "RESEND_API_KEY",
  "DD_API_KEY",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "POLAR_STARTER_ANNUAL_PRODUCT_ID",
  "POLAR_PRO_ANNUAL_PRODUCT_ID",
  "POLAR_BUSINESS_ANNUAL_PRODUCT_ID",
] as const;

export function checkEnvironment(): EnvCheckResult[] {
  const results: EnvCheckResult[] = [];

  for (const name of REQUIRED_ENVS) {
    results.push({
      name,
      status: process.env[name] ? "ok" : "missing",
      required: true,
    });
  }

  for (const name of OPTIONAL_ENVS) {
    results.push({
      name,
      status: process.env[name] ? "ok" : "missing",
      required: false,
    });
  }

  return results;
}

export function isProductionReady(): boolean {
  return REQUIRED_ENVS.every((name) => Boolean(process.env[name]));
}
