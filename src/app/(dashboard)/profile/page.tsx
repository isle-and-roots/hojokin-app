"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BusinessProfile } from "@/types";
import { Loader2, Save, CheckCircle, Zap, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { trackProfileCompleted } from "@/lib/analytics";
import { posthog } from "@/lib/posthog/client";
import { EVENTS } from "@/lib/posthog/events";
import { calculateProfileCompleteness } from "@/lib/subsidies";
import { Confetti } from "@/components/ui/confetti";
import { HelpTooltip } from "@/components/ui/tooltip";
import {
  INDUSTRY_OPTIONS, EMPLOYEE_RANGES, REVENUE_RANGES,
  PREFECTURES, SALES_CHANNEL_OPTIONS, CHALLENGE_OPTIONS,
} from "@/lib/data/profile-options";

const INITIAL_PROFILE: Omit<BusinessProfile, "id" | "createdAt" | "updatedAt"> = {
  companyName: "",
  representative: "",
  address: "",
  phone: "",
  email: "",
  industry: "",
  prefecture: "",
  employeeCount: 0,
  annualRevenue: null,
  foundedYear: null,
  businessDescription: "",
  products: "",
  targetCustomers: "",
  salesChannels: "",
  strengths: "",
  challenges: "",
  recentRevenue: null,
  recentProfit: null,
};

type Step = "basic" | "business" | "financial" | "confirm";

const STEPS: { key: Step; label: string }[] = [
  { key: "basic", label: "基本情報" },
  { key: "business", label: "事業内容" },
  { key: "financial", label: "財務情報" },
  { key: "confirm", label: "確認" },
];

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toastNotify = useToast();
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("basic");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCompleteBadge, setShowCompleteBadge] = useState(false);
  const [showCompleteConfetti, setShowCompleteConfetti] = useState(false);
  const completeBadgeFiredRef = useRef(false);
  const isQuickMode = searchParams.get("quick") === "true";

  // Supabase からプロフィールを読み込み
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfileId(data.profile.id);
          const { id, createdAt, updatedAt, ...rest } = data.profile;
          setProfile(rest);
          setIsNewProfile(false);
        } else {
          // プロフィールが未存在 → 新規ユーザー
          setIsNewProfile(true);
        }
      })
      .catch(() => {
        setError("プロフィールの読み込みに失敗しました");
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (
    field: keyof typeof profile,
    value: string | number | null
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const wasNewProfile = isNewProfile;
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, profileId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.profile?.id) setProfileId(data.profile.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      // 100%完了バッジ表示
      const completeness = calculateProfileCompleteness(
        profile as BusinessProfile
      );
      if (completeness === 100 && !completeBadgeFiredRef.current) {
        completeBadgeFiredRef.current = true;
        setShowCompleteBadge(true);
        setShowCompleteConfetti(true);
        posthog.capture(EVENTS.PROFILE_100_PERCENT);
        setTimeout(() => setShowCompleteBadge(false), 4000);
      }

      if (wasNewProfile) {
        trackProfileCompleted();
        posthog.capture(EVENTS.PROFILE_CREATED);
        toastNotify.success("プロフィールを保存しました！次は補助金を選びましょう");
        setIsNewProfile(false);
        setTimeout(() => {
          router.push("/subsidies?from=onboarding");
        }, 1200);
      } else {
        toastNotify.success("プロフィールを更新しました");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const canQuickSave =
    profile.companyName.trim() !== "" &&
    profile.industry !== "" &&
    profile.employeeCount > 0;

  const handleQuickSave = async () => {
    if (!canQuickSave) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, profileId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.profile?.id) setProfileId(data.profile.id);
      posthog.capture(EVENTS.QUICK_PROFILE_SAVED);
      posthog.capture(EVENTS.PROFILE_CREATED);
      trackProfileCompleted();
      toastNotify.success("プロフィールを保存しました！補助金を探しましょう");
      setIsNewProfile(false);
      setTimeout(() => {
        router.push("/subsidies?from=onboarding");
      }, 800);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      {/* 100%完了コンフェッティ */}
      <Confetti
        show={showCompleteConfetti}
        onDone={() => setShowCompleteConfetti(false)}
      />

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">企業プロフィール</h1>
          <AnimatePresence>
            {showCompleteBadge && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold"
              >
                <Star className="h-3.5 w-3.5 fill-green-500 text-green-500" />
                プロフィール完成！
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="text-muted-foreground mt-1">
          補助金申請書類の基盤となる事業者情報を入力してください
        </p>
      </div>

      {/* 100%完了メッセージ */}
      <AnimatePresence>
        {showCompleteBadge && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-6 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-full bg-green-100 p-2 shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  準備万端！AIがレコメンドします
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  プロフィールが100%完成しました。より精度の高い補助金マッチングとAI生成が利用できます。
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mb-6 bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* クイックモードバナー */}
      {isQuickMode && isNewProfile && (
        <div className="mb-6 rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 mt-0.5">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                まずは3項目だけでOK！
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium text-foreground">事業者名</span>・<span className="font-medium text-foreground">業種</span>・<span className="font-medium text-foreground">従業員数</span>を入力すれば、すぐにAI申請書を体験できます。
                他の項目はあとから追加できます。
              </p>
              <button
                onClick={handleQuickSave}
                disabled={!canQuickSave || saving}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {saving ? "保存中..." : canQuickSave ? "クイック保存してAI生成へ" : "3項目を入力してください"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ステップインジケーター */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(step.key)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                currentStep === step.key
                  ? "bg-primary text-primary-foreground"
                  : i < stepIndex
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-xs">
                {i + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="hidden sm:block h-px w-8 bg-border" />
            )}
          </div>
        ))}
      </div>

      {/* プロフィール充実度インジケーター */}
      {!isNewProfile && (() => {
        const pct = calculateProfileCompleteness(profile as BusinessProfile);
        return (
          <div className="mb-4 rounded-lg bg-muted/60 px-4 py-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                プロフィール充実度
                <HelpTooltip
                  content="プロフィールが詳しいほど、AIが精密な申請書を生成します。充実度が高いほど補助金マッチング精度も向上します。"
                  position="right"
                />
              </span>
              <span className={`font-semibold ${pct === 100 ? "text-green-600" : pct >= 60 ? "text-primary" : "text-muted-foreground"}`}>
                {pct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-border">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-500" : "bg-primary"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })()}

      {/* ステップコンテンツ */}
      <div className="rounded-xl border border-border bg-card p-6">
        {currentStep === "basic" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">基本情報</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  事業者名 *
                </label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  placeholder="例: ISLE & ROOTS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  代表者名 *
                </label>
                <input
                  type="text"
                  value={profile.representative}
                  onChange={(e) => update("representative", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">都道府県</label>
                <select
                  value={profile.prefecture}
                  onChange={(e) => update("prefecture", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-card"
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">所在地（市区町村以降）</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  電話番号
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  業種 *
                </label>
                <select
                  value={profile.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-card"
                >
                  <option value="">選択してください</option>
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  従業員数 *
                </label>
                <select
                  value={profile.employeeCount}
                  onChange={(e) => update("employeeCount", parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-card"
                >
                  <option value={0}>選択してください</option>
                  {EMPLOYEE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === "business" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">事業内容</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                事業概要 *
              </label>
              <textarea
                value={profile.businessDescription}
                onChange={(e) => update("businessDescription", e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                placeholder="事業の概要を記述してください"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                主な商品・サービス *
              </label>
              <textarea
                value={profile.products}
                onChange={(e) => update("products", e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                placeholder="商品やサービスを記述してください"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                主な顧客層
              </label>
              <textarea
                value={profile.targetCustomers}
                onChange={(e) => update("targetCustomers", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                販売チャネル
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SALES_CHANNEL_OPTIONS.map((ch) => {
                  const selected = profile.salesChannels
                    .split(",").map((s) => s.trim()).filter(Boolean);
                  const isActive = selected.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        const next = isActive
                          ? selected.filter((s) => s !== ch)
                          : [...selected, ch];
                        update("salesChannels", next.join(","));
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                自社の強み *
              </label>
              <textarea
                value={profile.strengths}
                onChange={(e) => update("strengths", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                placeholder="競合と比較した自社の強み"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                経営上の課題
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CHALLENGE_OPTIONS.map((ch) => {
                  const selected = profile.challenges
                    .split(",").map((s) => s.trim()).filter(Boolean);
                  const isActive = selected.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        const next = isActive
                          ? selected.filter((s) => s !== ch)
                          : [...selected, ch];
                        update("challenges", next.join(","));
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentStep === "financial" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">財務情報</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  年間売上
                </label>
                <select
                  value={profile.annualRevenue ?? ""}
                  onChange={(e) =>
                    update(
                      "annualRevenue",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-card"
                >
                  <option value="">選択してください</option>
                  {REVENUE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  設立年
                </label>
                <input
                  type="number"
                  value={profile.foundedYear ?? ""}
                  onChange={(e) =>
                    update(
                      "foundedYear",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  placeholder="例: 2020"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === "confirm" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">入力内容の確認</h2>
            <div className="space-y-3 text-sm">
              {([
                ["事業者名", profile.companyName],
                ["都道府県", profile.prefecture],
                ["所在地", profile.address],
                ["業種", profile.industry],
                ["従業員数", profile.employeeCount ? `${EMPLOYEE_RANGES.find((r) => r.value === profile.employeeCount)?.label ?? profile.employeeCount + "名"}` : ""],
                ["事業概要", profile.businessDescription],
                ["商品・サービス", profile.products],
                ["販売チャネル", profile.salesChannels.split(",").filter(Boolean).join("、")],
                ["自社の強み", profile.strengths],
                ["経営上の課題", profile.challenges.split(",").filter(Boolean).join("、")],
                ["年間売上", profile.annualRevenue ? (REVENUE_RANGES.find((r) => r.value === profile.annualRevenue)?.label ?? `${profile.annualRevenue}万円`) : ""],
                ["設立年", profile.foundedYear ? `${profile.foundedYear}年` : ""],
              ] as [string, string | number | null][]).map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-2 border-b border-border">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="col-span-2 whitespace-pre-wrap">
                    {value || "（未入力）"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <button
            onClick={() => {
              const prev = STEPS[stepIndex - 1];
              if (prev) setCurrentStep(prev.key);
            }}
            disabled={stepIndex === 0}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent active:scale-[0.97] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            戻る
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary/5 active:scale-[0.97] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="h-4 w-4 animate-[icon-pop_0.2s_ease-out]" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "保存中..." : saved ? "保存済み" : "保存"}
            </button>
            {stepIndex < STEPS.length - 1 && (
              <button
                onClick={() => {
                  const next = STEPS[stepIndex + 1];
                  if (next) {
                    posthog.capture(EVENTS.ONBOARDING_STEP_COMPLETED, {
                      step: currentStep,
                      step_index: stepIndex,
                    });
                    setCurrentStep(next.key);
                  }
                }}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                次へ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
