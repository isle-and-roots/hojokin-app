/**
 * 構造化ログユーティリティ
 * - console に JSON 出力（Vercel ログで確認可能）
 * - DD_API_KEY が設定されていれば Datadog HTTP intake に直接送信
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogContext = Record<string, string | number | boolean | undefined>

/** Datadog HTTP Log Intake に非同期送信（fire-and-forget） */
function shipToDatadog(entry: Record<string, unknown>): void {
  const apiKey = process.env.DD_API_KEY
  const site = process.env.DD_SITE || 'datadoghq.com'
  if (!apiKey) return

  const url = `https://http-intake.logs.${site}/api/v2/logs`
  fetch(url, {
    method: 'POST',
    headers: {
      'DD-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([entry]),
  }).catch(() => {
    // ログ送信エラーはサイレント無視（無限ループ防止）
  })
}

function log(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: process.env.DD_SERVICE || 'hojokin-app',
    env: process.env.DD_ENV || process.env.NODE_ENV,
    ddsource: 'nodejs',
    ...context,
  }

  // コンソール出力（Vercel 関数ログ）
  if (level === 'error') {
    console.error(JSON.stringify(entry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry))
  } else {
    console.log(JSON.stringify(entry))
  }

  // Datadog HTTP intake に直接送信（Log Drain 代替）
  if (level !== 'debug') {
    shipToDatadog(entry)
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
}
