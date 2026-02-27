/**
 * Datadog カスタムスパン・メトリクス helper
 * dd-trace の型安全なラッパー
 */

type SpanOptions = {
  resource?: string
  tags?: Record<string, string | number | boolean>
}

/**
 * カスタムスパンでコールバックをラップする
 * Next.js Serverless 環境では dd-trace が未ロードの場合のフォールバックあり
 */
export async function withSpan<T>(
  operationName: string,
  options: SpanOptions,
  fn: () => Promise<T>
): Promise<T> {
  if (process.env.NODE_ENV === 'test') {
    return fn()
  }

  try {
    const tracer = (await import('dd-trace')).default
    const span = tracer.startSpan(operationName, {
      childOf: tracer.scope().active() ?? undefined,
      tags: {
        'service': process.env.DD_SERVICE || 'hojokin-app',
        ...(options.resource ? { 'resource.name': options.resource } : {}),
        ...options.tags,
      },
    })

    try {
      const result = await tracer.scope().activate(span, fn)
      span.finish()
      return result
    } catch (err) {
      span.setTag('error', err)
      span.finish()
      throw err
    }
  } catch {
    // dd-trace が利用できない環境 (Edge Runtime等) ではフォールバック
    return fn()
  }
}

/**
 * LLM呼び出し用タグ定数
 */
export const LLM_TAGS = {
  SUBSIDY_TYPES: {
    JIZOKUKA: 'jizokuka',
    IT_DONYU: 'it_donyu',
    MONODUKURI: 'monodukuri',
    SHOENE: 'shoene',
    JIGYOU_SAIKOUCHIKU: 'jigyou_saikouchiku',
  } as const,
  PLANS: {
    FREE: 'free',
    STARTER: 'starter',
    PRO: 'pro',
    BUSINESS: 'business',
  } as const,
} as const
