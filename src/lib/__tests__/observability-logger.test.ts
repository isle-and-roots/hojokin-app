import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the admin client before importing
vi.mock("@/lib/observability/admin-client", () => ({
  getObservabilityClient: vi.fn(),
}));

describe("observability logger", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  describe("logEvent", () => {
    it("Supabase クライアント不在時に例外を投げない", async () => {
      const { getObservabilityClient } = await import("@/lib/observability/admin-client");
      vi.mocked(getObservabilityClient).mockReturnValue(null);

      const { logEvent } = await import("@/lib/observability/logger");

      expect(() => {
        logEvent({
          eventType: "error",
          severity: "critical",
          source: "test",
          message: "test error",
        });
      }).not.toThrow();
    });

    it("正しいパラメータで insert を呼ぶ", async () => {
      const mockInsert = vi.fn().mockReturnValue({
        then: (cb: (result: { error: null }) => void) => {
          cb({ error: null });
          return { catch: vi.fn() };
        },
      });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      const { getObservabilityClient } = await import("@/lib/observability/admin-client");
      vi.mocked(getObservabilityClient).mockReturnValue({ from: mockFrom } as unknown as ReturnType<typeof getObservabilityClient>);

      const { logEvent } = await import("@/lib/observability/logger");

      logEvent({
        userId: "user-123",
        eventType: "ai_request",
        severity: "info",
        source: "test-source",
        message: "test message",
        metadata: { key: "value" },
      });

      expect(mockFrom).toHaveBeenCalledWith("system_events");
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: "user-123",
        event_type: "ai_request",
        severity: "info",
        source: "test-source",
        message: "test message",
        metadata: { key: "value" },
      });
    });
  });

  describe("logError", () => {
    it("Error オブジェクトからスタックトレースを抽出する", async () => {
      const mockInsert = vi.fn().mockReturnValue({
        then: (cb: (result: { error: null }) => void) => {
          cb({ error: null });
          return { catch: vi.fn() };
        },
      });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      const { getObservabilityClient } = await import("@/lib/observability/admin-client");
      vi.mocked(getObservabilityClient).mockReturnValue({ from: mockFrom } as unknown as ReturnType<typeof getObservabilityClient>);

      const { logError } = await import("@/lib/observability/structured-logger");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const testError = new Error("test failure");
      logError("test-source", "テストエラー", testError);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: "error",
          severity: "critical",
          source: "test-source",
          message: "テストエラー",
          metadata: expect.objectContaining({
            errorMessage: "test failure",
            stack: expect.stringContaining("Error: test failure"),
          }),
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe("logInfo", () => {
    it("デフォルトで system_check イベントタイプを使用する", async () => {
      const mockInsert = vi.fn().mockReturnValue({
        then: (cb: (result: { error: null }) => void) => {
          cb({ error: null });
          return { catch: vi.fn() };
        },
      });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      const { getObservabilityClient } = await import("@/lib/observability/admin-client");
      vi.mocked(getObservabilityClient).mockReturnValue({ from: mockFrom } as unknown as ReturnType<typeof getObservabilityClient>);

      const { logInfo } = await import("@/lib/observability/structured-logger");

      logInfo("test-source", "情報メッセージ");

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: "system_check",
          severity: "info",
        })
      );
    });

    it("カスタムイベントタイプを指定できる", async () => {
      const mockInsert = vi.fn().mockReturnValue({
        then: (cb: (result: { error: null }) => void) => {
          cb({ error: null });
          return { catch: vi.fn() };
        },
      });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      const { getObservabilityClient } = await import("@/lib/observability/admin-client");
      vi.mocked(getObservabilityClient).mockReturnValue({ from: mockFrom } as unknown as ReturnType<typeof getObservabilityClient>);

      const { logInfo } = await import("@/lib/observability/structured-logger");

      logInfo("test-source", "AI リクエスト", "ai_request");

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: "ai_request",
        })
      );
    });
  });

  describe("logAiUsage", () => {
    it("コスト計算を含めて insert を呼ぶ", async () => {
      const mockInsert = vi.fn().mockReturnValue({
        then: (cb: (result: { error: null }) => void) => {
          cb({ error: null });
          return { catch: vi.fn() };
        },
      });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      const { getObservabilityClient } = await import("@/lib/observability/admin-client");
      vi.mocked(getObservabilityClient).mockReturnValue({ from: mockFrom } as unknown as ReturnType<typeof getObservabilityClient>);

      const { logAiUsage } = await import("@/lib/observability/ai-usage");

      logAiUsage({
        userId: "user-123",
        toolName: "generate-section",
        modelId: "claude-sonnet-4-20250514",
        inputTokens: 1000,
        outputTokens: 500,
        cacheCreationTokens: 200,
        cacheReadTokens: 100,
        plan: "pro",
      });

      expect(mockFrom).toHaveBeenCalledWith("ai_usage_logs");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-123",
          tool_name: "generate-section",
          model_id: "claude-sonnet-4-20250514",
          input_tokens: 1000,
          output_tokens: 500,
          plan: "pro",
        })
      );

      // Verify estimated_cost_usd is calculated (not zero)
      const insertArg = mockInsert.mock.calls[0][0] as { estimated_cost_usd: number };
      expect(insertArg.estimated_cost_usd).toBeGreaterThan(0);
    });

    it("Supabase クライアント不在時に例外を投げない", async () => {
      const { getObservabilityClient } = await import("@/lib/observability/admin-client");
      vi.mocked(getObservabilityClient).mockReturnValue(null);

      const { logAiUsage } = await import("@/lib/observability/ai-usage");

      expect(() => {
        logAiUsage({
          toolName: "chat",
          modelId: "claude-sonnet-4-20250514",
          inputTokens: 100,
          outputTokens: 50,
        });
      }).not.toThrow();
    });
  });
});
