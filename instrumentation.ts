export async function register() {
  // ビルドフェーズ中は初期化しない（Vercel build sandbox クラッシュ防止）
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    const tracer = await import('dd-trace')
    tracer.default.init({
      service: process.env.DD_SERVICE || 'hojokin-app',
      env: process.env.DD_ENV || 'production',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      logInjection: true,
      runtimeMetrics: true,
      profiling: false, // Vercel Serverless では無効
      plugins: true, // 自動計装を有効化 (Anthropic含む)
    })
  }
}
