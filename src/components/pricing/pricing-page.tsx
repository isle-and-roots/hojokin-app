"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Crown, Sparkles, ChevronDown } from "lucide-react";
import { PLAN_LIST, type PlanKey } from "@/lib/plans";
import { useToast } from "@/components/ui/toast";

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
    a: "顧客ポータルから請求書・領収書をダウンロードできます。料金ページの「プラン管理」ボタンからアクセスしてください。",
  },
];

export function PricingPageClient() {
  const toast = useToast();
  const [currentPlan, setCurrentPlan] = useState<PlanKey>("free");
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [hasCustomerId, setHasCustomerId] = useState(false);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => {
        if (data.userProfile) {
          setCurrentPlan(data.userProfile.plan || "free");
          setHasCustomerId(!!data.userProfile.polar_customer_id);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubscribe = async (planKey: PlanKey) => {
    if (planKey === "free" || planKey === currentPlan) return;

    setLoading(planKey);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (data.url) {
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

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">料金プラン</h1>
        <p className="text-muted-foreground mt-2">
          ビジネスに合ったプランを選択してください
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLAN_LIST.map((plan) => {
          const isCurrentPlan = currentPlan === plan.key;
          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    <Crown className="h-3 w-3" />
                    おすすめ
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold">{plan.name}</h2>
                <div className="mt-3 flex items-baseline gap-1">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold">無料</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        円/月<span className="text-xs ml-1">(税込)</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground"
                >
                  現在のプラン
                </button>
              ) : plan.key === "free" ? (
                hasCustomerId ? (
                  <button
                    onClick={handleManage}
                    disabled={loading !== null}
                    className="w-full py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    プラン管理
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground"
                  >
                    現在のプラン
                  </button>
                )
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
