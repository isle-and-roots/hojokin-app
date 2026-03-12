import { getObservabilityClient } from "./admin-client";

/** Anthropic pricing per token (USD) as of 2025 */
const PRICING: Record<string, { input: number; output: number; cacheWrite: number; cacheRead: number }> = {
  "claude-sonnet-4-20250514": { input: 3 / 1e6, output: 15 / 1e6, cacheWrite: 3.75 / 1e6, cacheRead: 0.3 / 1e6 },
  "claude-opus-4-6": { input: 15 / 1e6, output: 75 / 1e6, cacheWrite: 18.75 / 1e6, cacheRead: 1.5 / 1e6 },
};

const DEFAULT_PRICING = { input: 3 / 1e6, output: 15 / 1e6, cacheWrite: 3.75 / 1e6, cacheRead: 0.3 / 1e6 };

type LogAiUsageParams = {
  userId?: string;
  toolName: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens?: number;
  cacheReadTokens?: number;
  subsidyId?: string;
  sectionKey?: string;
  plan?: string;
  durationMs?: number;
  errorKind?: string;
};

export function logAiUsage(params: LogAiUsageParams): void {
  const client = getObservabilityClient();
  if (!client) return;

  const pricing = PRICING[params.modelId] ?? DEFAULT_PRICING;
  const estimatedCost =
    params.inputTokens * pricing.input +
    params.outputTokens * pricing.output +
    (params.cacheCreationTokens ?? 0) * pricing.cacheWrite +
    (params.cacheReadTokens ?? 0) * pricing.cacheRead;

  Promise.resolve(
    client
      .from("ai_usage_logs")
      .insert({
        user_id: params.userId ?? null,
        tool_name: params.toolName,
        model_id: params.modelId,
        input_tokens: params.inputTokens,
        output_tokens: params.outputTokens,
        cache_creation_tokens: params.cacheCreationTokens ?? 0,
        cache_read_tokens: params.cacheReadTokens ?? 0,
        estimated_cost_usd: estimatedCost,
        subsidy_id: params.subsidyId ?? null,
        section_key: params.sectionKey ?? null,
        plan: params.plan ?? null,
        duration_ms: params.durationMs ?? null,
        error_kind: params.errorKind ?? null,
      })
  )
    .then(({ error }) => {
      if (error) {
        console.error("[observability] Failed to log AI usage:", error.message);
      }
    })
    .catch((err: unknown) => {
      console.error("[observability] Failed to log AI usage:", err);
    });
}
