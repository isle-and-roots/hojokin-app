#!/usr/bin/env tsx
/**
 * Smoke test script — クリティカルエンドポイントの疎通確認
 *
 * Usage:
 *   BASE_URL=https://example.com npx tsx scripts/smoke-test.ts
 *   npx tsx scripts/smoke-test.ts https://example.com
 */

interface TestCase {
  name: string;
  path: string;
  expectedStatus: number | number[];
}

interface TestResult {
  name: string;
  path: string;
  expectedStatus: number | number[];
  actualStatus: number | null;
  passed: boolean;
  durationMs: number;
  error?: string;
}

const TEST_CASES: TestCase[] = [
  { name: "Health check",   path: "/api/health",    expectedStatus: 200 },
  { name: "Homepage",       path: "/",              expectedStatus: 200 },
  { name: "Login page",     path: "/login",         expectedStatus: 200 },
  { name: "Pricing page",   path: "/pricing",       expectedStatus: 200 },
  { name: "Blog index",     path: "/blog",          expectedStatus: 200 },
  { name: "Subsidies API",  path: "/api/subsidies", expectedStatus: [200, 401] },
];

function statusMatches(actual: number, expected: number | number[]): boolean {
  return Array.isArray(expected) ? expected.includes(actual) : actual === expected;
}

function formatExpected(expected: number | number[]): string {
  return Array.isArray(expected) ? expected.join("/") : String(expected);
}

async function runTest(baseUrl: string, tc: TestCase): Promise<TestResult> {
  const url = `${baseUrl}${tc.path}`;
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "hojokin-smoke-test/1.0" },
    });
    const durationMs = Date.now() - t0;
    return {
      name: tc.name,
      path: tc.path,
      expectedStatus: tc.expectedStatus,
      actualStatus: res.status,
      passed: statusMatches(res.status, tc.expectedStatus),
      durationMs,
    };
  } catch (err) {
    const durationMs = Date.now() - t0;
    const message = err instanceof Error ? err.message : String(err);
    return {
      name: tc.name,
      path: tc.path,
      expectedStatus: tc.expectedStatus,
      actualStatus: null,
      passed: false,
      durationMs,
      error: message,
    };
  }
}

function printTable(results: TestResult[]): void {
  const col = {
    name: Math.max(12, ...results.map((r) => r.name.length)),
    path: Math.max(6, ...results.map((r) => r.path.length)),
    expect: Math.max(8, ...results.map((r) => formatExpected(r.expectedStatus).length)),
    actual: 6,
    duration: 10,
    result: 6,
  };

  const header = [
    "Name".padEnd(col.name),
    "Path".padEnd(col.path),
    "Expect".padStart(col.expect),
    "Actual".padStart(col.actual),
    "ms".padStart(col.duration),
    "Pass?".padStart(col.result),
  ].join("  ");

  const sep = "-".repeat(header.length);
  console.log(sep);
  console.log(header);
  console.log(sep);

  for (const r of results) {
    const row = [
      r.name.padEnd(col.name),
      r.path.padEnd(col.path),
      formatExpected(r.expectedStatus).padStart(col.expect),
      (r.actualStatus !== null ? String(r.actualStatus) : "ERR").padStart(col.actual),
      `${r.durationMs}ms`.padStart(col.duration),
      (r.passed ? "OK" : "FAIL").padStart(col.result),
    ].join("  ");
    console.log(row);
    if (r.error) {
      console.log(`  Error: ${r.error}`);
    }
  }

  console.log(sep);
}

async function main(): Promise<void> {
  const baseUrl =
    process.argv[2] ??
    process.env.SMOKE_TEST_URL ??
    process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    console.error(
      "Error: BASE_URL not provided.\n" +
        "Usage: SMOKE_TEST_URL=https://example.com npx tsx scripts/smoke-test.ts\n" +
        "    or: npx tsx scripts/smoke-test.ts https://example.com"
    );
    process.exit(1);
  }

  const normalizedUrl = baseUrl.replace(/\/$/, "");
  console.log(`\nSmoke test: ${normalizedUrl}\n`);

  const results = await Promise.all(
    TEST_CASES.map((tc) => runTest(normalizedUrl, tc))
  );

  printTable(results);

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
