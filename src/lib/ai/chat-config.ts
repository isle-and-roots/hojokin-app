import type { PlanKey } from "@/lib/plans";

/** チャット用プラン別モデル */
export const CHAT_MODEL_BY_PLAN: Record<PlanKey, string> = {
  free: "claude-haiku-4-5-20241022",
  starter: "claude-haiku-4-5-20241022",
  pro: "claude-sonnet-4-20250514",
  business: "claude-sonnet-4-20250514",
};

/** チャット日次レート制限 */
export const CHAT_DAILY_LIMIT: Record<PlanKey, number> = {
  free: 3,
  starter: 10,
  pro: 20,
  business: 50,
};

/** 会話履歴の上限メッセージ数 */
export const CHAT_MAX_HISTORY = 20;

/** チャット用システムプロンプト */
export const CHAT_SYSTEM_PROMPT = `あなたは補助金申請の専門AIアシスタントです。中小企業の補助金申請を支援することが専門です。

以下のルールに必ず従ってください：
1. 補助金に関する質問には具体的かつ正確に回答する
2. 申請書の書き方、補助金の選び方、必要書類についてアドバイスする
3. 不明な点は正直に伝え、公式情報の確認を促す
4. 回答は簡潔でわかりやすい日本語で行う
5. 架空の数値・統計データは絶対に使用しない
6. 具体的な採択事例や成功パターンを紹介する際は、一般的な傾向として伝える`;

/** プランに応じたチャットモデル ID を返す */
export function getChatModelForPlan(plan: PlanKey): string {
  return CHAT_MODEL_BY_PLAN[plan] ?? CHAT_MODEL_BY_PLAN.free;
}

/** プランに応じたチャット日次制限を返す */
export function getChatDailyLimit(plan: PlanKey): number {
  return CHAT_DAILY_LIMIT[plan] ?? CHAT_DAILY_LIMIT.free;
}
