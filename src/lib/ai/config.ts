import type { PlanKey } from "@/lib/plans";

/** プラン別に使用する Claude モデル */
const MODEL_BY_PLAN: Record<PlanKey, string> = {
  free: "claude-sonnet-4-20250514",
  starter: "claude-sonnet-4-20250514",
  pro: "claude-sonnet-4-20250514",
  business: "claude-opus-4-6",
};

/** AI 生成パラメータ */
export const AI_CONFIG = {
  /** 申請書生成の温度（正確性・一貫性重視で低めに設定） */
  temperature: 0.3,
  /** 最大出力トークン数 */
  maxTokens: 4096,
  /** API タイムアウト（ミリ秒） */
  timeoutMs: 30_000,
  /** リトライ回数上限 */
  maxRetries: 2,
  /** リトライ待機時間ベース（ミリ秒）— 指数バックオフ */
  retryBaseDelayMs: 1_000,
} as const;

/** プランに応じたモデル ID を返す */
export function getModelForPlan(plan: PlanKey): string {
  return MODEL_BY_PLAN[plan] ?? MODEL_BY_PLAN.free;
}

/** エラー種別 */
export type AiErrorKind =
  | "rate_limit"
  | "timeout"
  | "server_error"
  | "invalid_request"
  | "unknown";

/** Anthropic API エラーからエラー種別を判定 */
export function classifyError(error: unknown): AiErrorKind {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("rate") || msg.includes("429")) return "rate_limit";
    if (msg.includes("timeout") || msg.includes("timed out")) return "timeout";
    if (msg.includes("invalid") || msg.includes("400")) return "invalid_request";
    if (msg.includes("500") || msg.includes("502") || msg.includes("503"))
      return "server_error";
  }
  return "unknown";
}

/** エラー種別に応じた日本語メッセージ */
export function getErrorMessage(kind: AiErrorKind): string {
  switch (kind) {
    case "rate_limit":
      return "APIリクエストが制限されています。しばらくしてから再度お試しください。";
    case "timeout":
      return "AI生成がタイムアウトしました。もう一度お試しください。";
    case "server_error":
      return "AIサーバーで一時的な障害が発生しています。しばらくしてから再度お試しください。";
    case "invalid_request":
      return "リクエスト内容にエラーがあります。入力内容を確認してください。";
    case "unknown":
      return "申請書の生成に失敗しました。もう一度お試しください。";
  }
}

/** リトライ可能なエラーかどうか */
export function isRetryable(kind: AiErrorKind): boolean {
  return kind === "rate_limit" || kind === "timeout" || kind === "server_error";
}
