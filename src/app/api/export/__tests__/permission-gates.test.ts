import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Supabase mock ──
const mockGetUser = vi.fn();
const mockSingle = vi.fn();
const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}));

// ── docx mock (dynamic import) ──
vi.mock("docx", () => ({
  Document: vi.fn(),
  Packer: { toBuffer: vi.fn().mockResolvedValue(Buffer.from("fake-docx")) },
  Paragraph: vi.fn(),
  TextRun: vi.fn(),
  HeadingLevel: { TITLE: "TITLE", HEADING_1: "HEADING_1" },
  AlignmentType: { CENTER: "CENTER" },
  BorderStyle: { SINGLE: "SINGLE" },
}));

// ── react-pdf mock (dynamic import) ──
vi.mock("@react-pdf/renderer", () => ({
  renderToBuffer: vi.fn().mockResolvedValue(Buffer.from("fake-pdf")),
  Document: vi.fn(),
  Page: vi.fn(),
  View: vi.fn(),
  Text: vi.fn(),
  StyleSheet: { create: vi.fn().mockReturnValue({}) },
  Font: { register: vi.fn() },
}));

// ── PDF helper mocks (dynamic import) ──
vi.mock("@/lib/pdf/font-config", () => ({
  registerFonts: vi.fn(),
}));

vi.mock("@/lib/pdf/application-pdf", () => ({
  ApplicationPdf: vi.fn().mockReturnValue(null),
}));

// ── PostHog mock ──
vi.mock("@/lib/posthog/track", () => ({
  trackServerEvent: vi.fn(),
}));

vi.mock("@/lib/posthog/events", () => ({
  EVENTS: {
    DOCX_EXPORTED: "docx_exported",
    PDF_EXPORTED: "pdf_exported",
  },
}));

// ── Test helpers ──

const validDocxBody = {
  subsidyName: "テスト補助金",
  sections: [
    {
      sectionKey: "overview",
      sectionTitle: "概要",
      content: "テスト内容です。\nこれは2行目です。",
    },
  ],
};

const validPdfBody = {
  subsidyName: "テスト補助金",
  sections: [
    {
      sectionKey: "overview",
      sectionTitle: "概要",
      content: "テスト内容です。",
    },
  ],
  companyInfo: {
    companyName: "テスト株式会社",
  },
};

function makeRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
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

function setupAuthenticatedWithPlan(plan: string) {
  mockGetUser.mockResolvedValue({
    data: { user: { id: "user-123", email: "test@example.com" } },
    error: null,
  });
  mockSingle.mockResolvedValue({ data: { plan }, error: null });
}

function setupAuthenticatedNullProfile() {
  mockGetUser.mockResolvedValue({
    data: { user: { id: "user-123", email: "test@example.com" } },
    error: null,
  });
  mockSingle.mockResolvedValue({ data: null, error: { message: "Not found" } });
}

// ── Tests ──

describe("DOCX Export /api/export/docx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset chain: from → select → eq → single
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: { plan: "free" }, error: null });
  });

  async function callDocxPost(body: unknown = validDocxBody) {
    const { POST } = await import("@/app/api/export/docx/route");
    const req = makeRequest("http://localhost/api/export/docx", body);
    return POST(req);
  }

  it("未認証 → 401", async () => {
    setupUnauthenticated();

    const res = await callDocxPost();
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toBe("ログインしてください");
  });

  it("free プラン → 403 拒否", async () => {
    setupAuthenticatedWithPlan("free");

    const res = await callDocxPost();
    expect(res.status).toBe(403);

    const json = await res.json();
    expect(json.error).toContain("Starter");
  });

  it("starter プラン → 許可 (ステータス200)", async () => {
    setupAuthenticatedWithPlan("starter");

    const res = await callDocxPost();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  });

  it("pro プラン → 許可", async () => {
    setupAuthenticatedWithPlan("pro");

    const res = await callDocxPost();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Disposition")).toContain("hojokin_application.docx");
  });

  it("business プラン → 許可", async () => {
    setupAuthenticatedWithPlan("business");

    const res = await callDocxPost();
    expect(res.status).toBe(200);
  });

  it("[B2 修正済] 403エラーメッセージが canUseFeature と整合する — Starter 以上で利用可能", async () => {
    setupAuthenticatedWithPlan("free");

    const res = await callDocxPost();
    expect(res.status).toBe(403);

    const json = await res.json();
    // canUseFeature("starter", "docxExport") === true なので
    // エラーメッセージは「Starter プラン以上」とすべき。
    expect(json.error).toMatch(/Starter|スターター/);
  });

  it("userProfile が null → 403 (安全側に倒す: plan が取得できない場合は free 扱い)", async () => {
    setupAuthenticatedNullProfile();

    const res = await callDocxPost();
    // userProfile が null の場合、plan は "free" にフォールバック
    // canUseFeature("free", "docxExport") === false → 403
    expect(res.status).toBe(403);
  });
});

describe("PDF Export /api/export/pdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: { plan: "free" }, error: null });
  });

  async function callPdfPost(body: unknown = validPdfBody) {
    const { POST } = await import("@/app/api/export/pdf/route");
    const req = makeRequest("http://localhost/api/export/pdf", body);
    return POST(req);
  }

  it("未認証 → 401", async () => {
    setupUnauthenticated();

    const res = await callPdfPost();
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toBe("ログインしてください");
  });

  it("free プラン → 403 拒否", async () => {
    setupAuthenticatedWithPlan("free");

    const res = await callPdfPost();
    expect(res.status).toBe(403);

    const json = await res.json();
    expect(json.error).toContain("Starter");
  });

  it("starter プラン → 許可", async () => {
    setupAuthenticatedWithPlan("starter");

    const res = await callPdfPost();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
  });

  it("pro プラン → 許可", async () => {
    setupAuthenticatedWithPlan("pro");

    const res = await callPdfPost();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Disposition")).toContain("hojokin_application.pdf");
  });

  it("business プラン → 許可", async () => {
    setupAuthenticatedWithPlan("business");

    const res = await callPdfPost();
    expect(res.status).toBe(200);
  });

  it("[B2 修正済] 403エラーメッセージが canUseFeature と整合する — Starter 以上で利用可能", async () => {
    setupAuthenticatedWithPlan("free");

    const res = await callPdfPost();
    expect(res.status).toBe(403);

    const json = await res.json();
    // canUseFeature("starter", "docxExport") === true なので
    // PDF も同様に Starter 以上で利用可能とすべき。
    expect(json.error).toMatch(/Starter|スターター/);
  });
});
