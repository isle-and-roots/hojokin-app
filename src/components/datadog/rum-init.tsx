'use client'

import { useEffect } from 'react'
import { datadogRum } from '@datadog/browser-rum'

export function DatadogRumInit() {
  useEffect(() => {
    const clientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN
    const applicationId = process.env.NEXT_PUBLIC_DD_APPLICATION_ID

    // 環境変数が設定されていない場合はスキップ（開発環境・未設定時のフォールバック）
    if (!clientToken || !applicationId) {
      return
    }

    datadogRum.init({
      applicationId,
      clientToken,
      site: process.env.NEXT_PUBLIC_DD_SITE || 'datadoghq.com',
      service: 'hojokin-app',
      env: process.env.NODE_ENV,
      version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input', // フォーム入力を自動マスク（プライバシー保護）
    })
  }, [])

  return null
}
