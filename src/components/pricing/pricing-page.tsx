"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Loader2, Crown, Sparkles, ChevronDown, ExternalLink, Brain, Database, Zap, ShieldCheck, Star, Building } from "lucide-react";
import { PLAN_LIST, type PlanKey } from "@/lib/plans";
import { useToast } from "@/components/ui/toast";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";
import { trackUpgradeClick, trackCheckoutStarted } from "@/lib/analytics";

const FAQ_ITEMS = [
  {
    q: "無料プランでどこまで使えますか？",
    a: "補助金の検索・閲覧は無制限です。AI申請書生成は月3回まで、申請書の保存は1件までご利用いただけます。まずは無料でお試しください。",
  },
  {
    q: "プランの変更やキャンセルはいつでもできますか？",
    a: "はい、いつでも変更・キャンセルが可能です。アップグレードは即時反映、ダウングレードは次回請求日から適用されます。",
  },
  {
    q: "AI生成の回数は翌月に繰り越せますか？",
    a: "未使用の生成回数は翌月に繰り越されません。毎月1日にリセットされます。",
  },
  {
    q: "Businessプランの「高精度AIモデル」とは何ですか？",
    a: "最新の Claude Opus モデルを使用し、より高品質な申請書を生成します。他のプランでは Claude Sonnet を使用しています。",
  },
  {
    q: "請求書や領収書は発行できますか？",
    a: "顧客ポータルから請求書・領収書をダウンロードできます。アカウント設定ページの「サブスクリプション管理」ボタン、または「請求書・領収書」カードからアクセスしてください。",
  },
  {
    q: "AIが生成する申請書の品質はどの程度ですか？",
    a: "中小企業診断士の知見をベースにしたプロンプトで、審査員に「具体的で実現可能」と評価される品質を目指しています。生成後にお客様自身で内容を確認・修正していただくことを前提としています。",
  },
  {
    q: "コンサルタントに依頼する場合との違いは？",
    a: "コンサルタントへの依頼は一般的に10〜30万円程度かかります。当サービスはAIによる下書き自動生成で、月額¥980〜¥9,800で何度でも利用できます。ただし、最終的な内容確認はお客様ご自身で行っていただく必要があります。",
  },
  {
    q: "返金はできますか？",
    a: "サブスクリプションはいつでもキャンセル可能で、キャンセル後は次回請求日まで引き続きご利用いただけます。日割り返金には対応しておりませんが、1ヶ月単位で気軽にお試しいただけます。",
  },
];

const ENTERPRISE_FEATURES = [
  "AI申請書生成 無制限",
  "Word(DOCX)エクスポート",
  "申請書 無制限",
  "高精度AIモデル",
  "複数事業者プロフィール 無制限",
  "専任サポート担当",
  "カスタムプロンプト対応",
  "SLA保証",
];

export function PricingPageClient() {
  const toast = useToast();
  const [currentPlan, setCurrentPlan] = useState<PlanKey>("free");
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [hasCustomerId, setHasCustomerId] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    posthog.capture(EVENTS.PRICING_PAGE_VIEWED);

    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => {
        if (data.userProfile) {
          setCurrentPlan(data.userProfile.plan || "free");
          setHasCustomerId(!!data.userProfile.polar_customer_id);
        }
      })
      .catch(() => {
        // plan API 失敗時は free プランのデフォルト表示のまま
      });
  }, []);

  const handleSubscribe = async (planKey: PlanKey) => {
    if (planKey === "free" || planKey === currentPlan) return;

    posthog.capture(EVENTS.UPGRADE_BUTTON_CLICKED, {
      target_plan: planKey,
      current_plan: currentPlan,
      billing_interval: isAnnual ? "annual" : "monthly",
    });
    trackUpgradeClick("pricing_page", planKey);
    setLoading(planKey);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (data.url) {
        trackCheckoutStarted(planKey);
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "チェックアウトの作成に失敗しました");
      }
    } catch {
      toast.error("チェックアウトの作成に失敗しました。しばらくしてから再度お試しください。");
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async () => {
    posthog.capture(EVENTS.MANAGE_SUBSCRIPTION_CLICKED, {
      current_plan: currentPlan,
    });
    setLoading("pro");
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("ポータルの表示に失敗しました");
    } finally {
      setLoading(null);
    }
  };

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    posthog.capture(annual ? EVENTS.PRICING_TOGGLE_ANNUAL : EVENTS.PRICING_TOGGLE_MONTHLY);
  };

  const getDisplayPrice = (plan: (typeof PLAN_LIST)[number]) => {
    if (plan.price === 0) return 0;
    if (isAnnual && plan.annualPrice) {
      return Math.round(plan.annualPrice / 12);
    }
    return plan.price;
  };

  const getSavingsPercent = (plan: (typeof PLAN_LIST)[number]) => {
    if (!plan.annualPrice || plan.price === 0) return 0;
    const monthlyTotal = plan.price * 12;
    return Math.round((1 - plan.annualPrice / monthlyTotal) * 100);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">料金プラン</h1>
        <p className="text-muted-foreground mt-2">
          ビジネスに合ったプランを選択してください
        </p>
      </div>

      {/* 年間/月間トグル */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
          月額
        </span>
        <button
          onClick={() => handleToggle(!isAnnual)}
          className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors bg-primary/20"
          role="switch"
          aria-checked={isAnnual}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-primary transition-transform ${
              isAnnual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
          年額
        </span>
        {isAnnual && (
          <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 text-xs font-medium">
            最大25%OFF
          </span>
        )}
      </div>

      {/* CurrentPlanBanner（有料ユーザー向け） */}
      {currentPlan !== "free" && hasCustomerId && (
        <div className="border-l-4 border-primary rounded-xl bg-card p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-5 w-5 text-primary" />
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold">
                {PLAN_LIST.find((p) => p.key === currentPlan)?.name} プラン利用中
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              プランの変更・解約・請求書のダウンロードは顧客ポータルから行えます
            </p>
          </div>
          <button
            onClick={handleManage}
            disabled={loading !== null}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading === "pro" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            サブスクリプション管理
          </button>
        </div>
      )}

      {/* プランカード（4プラン + Enterprise） */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {PLAN_LIST.map((plan) => {
          const isCurrentPlan = currentPlan === plan.key;
          const displayPrice = getDisplayPrice(plan);
          const savings = getSavingsPercent(plan);
          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10 lg:scale-105"
                  : isCurrentPlan
                    ? "border-primary/50 ring-1 ring-primary/20"
                    : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    <Star className="h-3 w-3" />
                    人気No.1
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h2 className="text-lg font-bold">{plan.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {plan.persona}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold">無料</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">
                        {displayPrice.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        円/月<span className="text-xs ml-1">(税込)</span>
                      </span>
                    </>
                  )}
                </div>
                {isAnnual && savings > 0 && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground line-through">
                      {plan.price.toLocaleString()}円/月
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
                      {savings}%OFF
                    </span>
                  </div>
                )}
                {isAnnual && plan.annualPrice && (
                  <p className="text-xs text-muted-foreground mt-1">
                    年額 {plan.annualPrice.toLocaleString()}円
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan && hasCustomerId ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-2.5 rounded-lg border border-primary/30 bg-primary/5 text-sm font-medium text-primary"
                  >
                    現在のプラン
                  </button>
                  <Link
                    href="/settings"
                    className="block w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    プラン管理 →
                  </Link>
                </div>
              ) : isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground"
                >
                  現在のプラン
                </button>
              ) : plan.key === "free" && hasCustomerId ? (
                <p className="w-full py-2.5 text-center text-xs text-muted-foreground">
                  ダウングレードはプラン管理から
                </p>
              ) : plan.key === "free" ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground"
                >
                  現在のプラン
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={loading !== null}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-primary text-primary hover:bg-primary/5"
                  } disabled:opacity-50`}
                >
                  {loading === plan.key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {loading === plan.key ? "処理中..." : "アップグレード"}
                </button>
              )}
            </div>
          );
        })}

        {/* Enterprise アンカープラン */}
        <div className="relative rounded-2xl border border-border p-6 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Enterprise</h2>
            <p className="text-xs text-muted-foreground mt-1">
              大規模な申請支援を行う法人の方
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold">29,800</span>
              <span className="text-muted-foreground text-sm">
                円/月〜<span className="text-xs ml-1">(税込)</span>
              </span>
            </div>
          </div>

          <ul className="space-y-2.5 mb-6">
            {ENTERPRISE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href="mailto:support@isle-and-roots.com?subject=Enterprise%E3%83%97%E3%83%A9%E3%83%B3%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            <Building className="h-4 w-4" />
            お問い合わせ
          </a>
        </div>
      </div>

      {/* 選ばれる理由 */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-8">
          補助金サポートが選ばれる理由
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: "AI専門知識",
              description:
                "中小企業診断士の知見をベースにしたAIが、審査に通りやすい申請書を生成",
            },
            {
              icon: Database,
              title: "豊富な補助金データ",
              description:
                "持続化補助金・IT導入補助金など主要補助金を網羅。最新情報を随時更新",
            },
            {
              icon: Zap,
              title: "最短3分で生成",
              description:
                "プロフィール登録後、ワンクリックでAIが申請書の下書きを自動作成",
            },
            {
              icon: ShieldCheck,
              title: "いつでもキャンセル可能",
              description:
                "月額制で契約の縛りなし。必要な時だけ利用して、いつでも解約できます",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="text-center p-4"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-6">
          よくある質問
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground space-y-2">
        <p>すべてのプランは月額制（税込）です。いつでもキャンセルできます。</p>
        <p>
          お支払いは Polar の安全な決済システムで処理されます。
        </p>
        <p className="flex flex-wrap justify-center gap-3 pt-2">
          <a href="/legal/tokushoho" className="underline hover:text-foreground">
            特定商取引法に基づく表記
          </a>
          <a href="/legal/terms" className="underline hover:text-foreground">
            利用規約
          </a>
          <a href="/legal/privacy" className="underline hover:text-foreground">
            プライバシーポリシー
          </a>
        </p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left hover:bg-accent/50 transition-colors"
      >
        {question}
        <ChevronDown
          className={`h-4 w-4 shrink-0 ml-2 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-3 text-sm text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}
