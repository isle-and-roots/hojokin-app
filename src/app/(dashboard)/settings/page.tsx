import type { Metadata } from "next";
import { SettingsBillingClient } from "@/components/settings/billing-page";

export const metadata: Metadata = {
  title: "アカウント設定 | 補助金サポート",
  description: "サブスクリプション管理、お支払い方法の変更、請求書のダウンロードができます。",
};

export default function SettingsPage() {
  return <SettingsBillingClient />;
}
