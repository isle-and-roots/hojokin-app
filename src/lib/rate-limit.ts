/**
 * メモリベースの簡易 Rate Limiter
 * Vercel Serverless 環境対応（同一インスタンス内でのみ有効）
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// 古いエントリを定期的にクリーンアップ（メモリリーク防止）
const CLEANUP_INTERVAL = 60_000; // 1分ごと
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Rate Limit チェック
 * @param key 識別キー（例: `checkout:${userId}`）
 * @param limit 上限回数
 * @param windowMs 時間窓（ミリ秒）
 * @returns success: true なら通過OK、false ならレート制限に引っかかった
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}
