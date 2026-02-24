"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Crown,
  Receipt,
  CreditCard,
  ArrowUpDown,
  Sparkles,
  ArrowUpRight,
  Loader2,
  Shield,
  ExternalLink,
} from "lucide-react";
import { PLAN_LIST, type PlanKey, getAiLimit } from "@/lib/plans";
import { useToast } from "@/components/ui/toast";

interface UserPlanData {
  plan: PlanKey;
  polar_customer_id: string | null;
  ai_generations_used: number;
  ai_generations_reset_at: string;
}

function isPlanKey(v: unknown): v is PlanKey {
  return v === "free" || v === "starter" || v === "pro" || v === "business";
}

export function SettingsBillingClient() {
  const toast = useToast();
  const [userData, setUserData] = useState<UserPlanData | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (data: { userProfile?: Record<string, unknown> } | null) => {
          if (!data?.userProfile) return;
          const p = data.userProfile;
          setUserData({
            plan: isPlanKey(p.plan) ? p.plan : "free",
            polar_customer_id: (p.polar_customer_id as string) || null,
            ai_generations_used: (p.ai_generations_used as number) ?? 0,
            ai_generations_reset_at: (p.ai_generations_reset_at as string) ?? "",
          });
        }
      )
      .catch(() => {
        /* ignore */
      });
  }, []);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "ポータルの表示に失敗しました");
      }
    } catch {
      toast.error("ポータルの表示に失敗しました。しばらくしてからお試しください。");
    } finally {
      setPortalLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const planInfo = PLAN_LIST.find((p) => p.key === userData.plan);
  const isPaid = userData.plan !== "free";
  const hasCustomerId = !!userData.polar_customer_id;
  const aiLimit = getAiLimit(userData.plan);
  const aiRemaining = Math.max(0, aiLimit - userData.ai_generations_used);
  const resetDate = userData.ai_generations_reset_at
    ? new Date(userData.ai_generations_reset_at)
    : null;
  const resetMonth = resetDate ? `${resetDate.getMonth() + 1}月` : "";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">アカウント設定</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          お支払いとサブスクリプションの管理
        </p>
      </div>

      {isPaid && hasCustomerId ? (
        <>
          {/* サブスクリプションステータスカード */}
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold">
                    {planInfo?.name} プラン利用中
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {planInfo?.price.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    円/月（税込）
                  </span>
                </p>
              </div>
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                サブスクリプション管理
              </button>
            </div>

            {/* AI生成クォータ */}
            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  AI生成クォータ（{resetMonth}分）
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold">{aiRemaining}</span>
                <span className="text-sm text-muted-foreground">
                  / {aiLimit}回 残り
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-border">
                <div
                  className={`h-2 rounded-full transition-all ${
                    aiRemaining / aiLimit > 0.5
                      ? "bg-green-500"
                      : aiRemaining / aiLimit > 0.25
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${aiLimit > 0 ? (aiRemaining / aiLimit) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 請求関連アクション */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all text-left disabled:opacity-50"
            >
              <Receipt className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-semibold">請求書・領収書</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ダウンロード
                </p>
              </div>
            </button>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all text-left disabled:opacity-50"
            >
              <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-semibold">お支払い方法</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  変更・更新
                </p>
              </div>
            </button>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all text-left disabled:opacity-50"
            >
              <ArrowUpDown className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-semibold">プラン変更</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  アップグレード・ダウングレード
                </p>
              </div>
            </button>
          </div>

          {/* キャンセル情報 */}
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold">キャンセルについて</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">&#10003;</span>
                いつでもキャンセル可能です
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">&#10003;</span>
                キャンセル後も現在の請求期間終了まで全機能をご利用いただけます
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">&#10003;</span>
                請求期間終了後は Free プランに自動移行されます
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              キャンセルは「サブスクリプション管理」ボタンからお手続きいただけます。
            </p>
          </div>
        </>
      ) : (
        /* Free プラン状態 */
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground px-3 py-1 text-sm font-semibold">
              Free プランをご利用中
            </span>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">
                AI生成クォータ（{resetMonth}分）
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{aiRemaining}</span>
              <span className="text-sm text-muted-foreground">
                / {aiLimit}回 残り
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-border">
              <div
                className={`h-2 rounded-full transition-all ${
                  aiRemaining / aiLimit > 0.5
                    ? "bg-green-500"
                    : aiRemaining / aiLimit > 0.25
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{
                  width: `${aiLimit > 0 ? (aiRemaining / aiLimit) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            プランをアップグレード
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* フッターリンク */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p className="flex flex-wrap gap-3">
          <Link href="/legal/terms" className="underline hover:text-foreground">
            利用規約
          </Link>
          <Link
            href="/legal/privacy"
            className="underline hover:text-foreground"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/legal/tokushoho"
            className="underline hover:text-foreground"
          >
            特定商取引法に基づく表記
          </Link>
        </p>
      </div>
    </div>
  );
}
