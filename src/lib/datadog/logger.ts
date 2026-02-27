/**
 * 構造化ログユーティリティ
 * Datadog Log Drain との互換性のため JSON 形式で出力
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogContext = Record<string, string | number | boolean | undefined>

function log(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: process.env.DD_SERVICE || 'hojokin-app',
    env: process.env.DD_ENV || process.env.NODE_ENV,
    ...context,
  }

  if (level === 'error') {
    console.error(JSON.stringify(entry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry))
  } else {
    console.log(JSON.stringify(entry))
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
}
