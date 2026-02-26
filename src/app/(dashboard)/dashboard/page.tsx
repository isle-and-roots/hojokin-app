import Link from "next/link";
import {
  Building2,
  FileText,
  TrendingUp,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { searchSubsidies, getRecommendedSubsidiesWithReasons } from "@/lib/subsidies";
import {
  PROMPT_SUPPORT_CONFIG,
  DIFFICULTY_CONFIG,
} from "@/lib/data/subsidy-categories";
import { CreditDisplay } from "@/components/credit-display";
import { PlanBadgeCard } from "@/components/dashboard/plan-badge";
import { RecommendedSubsidies } from "@/components/dashboard/recommended-subsidies";
import { OnboardingStepper } from "@/components/dashboard/onboarding-stepper";
import { SignupTracker } from "@/components/dashboard/signup-tracker";
import { WelcomeModal } from "@/components/dashboard/welcome-modal";
import type { BusinessProfile, RecommendationResult } from "@/types";

const stats = [
  { label: "申請中", value: "0", icon: FileText, color: "text-blue-600" },
  { label: "採択済", value: "0", icon: TrendingUp, color: "text-green-600" },
];

async function getProfile(): Promise<BusinessProfile | null> {
  // Supabase が未設定の場合（ローカル開発）はスキップ
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { getBusinessProfile } = await import("@/lib/db/business-profiles");
    return await getBusinessProfile(user.id);
  } catch {
    return null;
  }
}

async function getApplicationCount(): Promise<number> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return 0;
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;
    const { count, error } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const params = await searchParams;
  const isWelcome = params.welcome === "true";

  const { items: subsidies } = await searchSubsidies({});
  const activeSubsidies = subsidies.filter((s) => s.isActive);
  const aiSupported = activeSubsidies.filter(
    (s) => s.promptSupport !== "NONE"
  );

  const profile = await getProfile();
  const applicationCount = await getApplicationCount();

  let recommendation: RecommendationResult | null = null;
  if (profile) {
    recommendation = getRecommendedSubsidiesWithReasons(profile);
  }

  // オンボーディング表示ロジック
  // Step 1: プロフィールなし
  // Step 3: プロフィールあり + 申請なし
  // 非表示: プロフィールあり + 申請あり（全完了）
  const showStepper = !profile || applicationCount === 0;
  const stepperCurrentStep: 1 | 3 = profile ? 3 : 1;

  return (
    <div className="p-8">
      <SignupTracker isWelcome={isWelcome} />
      <WelcomeModal show={isWelcome && !profile} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-muted-foreground mt-1">
          補助金申請の状況を一覧で確認できます
        </p>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              AI対応補助金
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold">{aiSupported.length}件</p>
        </div>
        <CreditDisplay variant="card" />
        <PlanBadgeCard />
      </div>

      {/* クイックアクション */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">はじめる</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/profile"
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">企業プロフィール登録</h3>
              <p className="text-sm text-muted-foreground mt-1">
                事業者情報を入力して申請書類の基盤を作成
              </p>
            </div>
          </Link>
          <Link
            href="/subsidies"
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <Search className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">補助金を探す</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {activeSubsidies.length}件の補助金からぴったりの制度を検索
              </p>
            </div>
          </Link>
          <Link
            href="/applications"
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">申請一覧</h3>
              <p className="text-sm text-muted-foreground mt-1">
                作成済みの申請書類を管理
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* オンボーディングステッパー or レコメンドセクション */}
      {showStepper && (
        <OnboardingStepper
          currentStep={stepperCurrentStep}
          isWelcome={isWelcome && !profile}
        />
      )}

      {recommendation && (
        <RecommendedSubsidies
          companyName={profile!.companyName}
          items={recommendation.items}
          profileCompleteness={recommendation.profileCompleteness}
        />
      )}

      {/* 対応補助金 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">対応補助金</h2>
          <Link
            href="/subsidies"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            すべて見る
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {aiSupported.slice(0, 4).map((s) => {
            const promptConf = PROMPT_SUPPORT_CONFIG[s.promptSupport];
            const diffConf = DIFFICULTY_CONFIG[s.difficulty];
            return (
              <Link
                key={s.id}
                href={`/subsidies/${s.id}`}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${promptConf.color}`}
                  >
                    <Sparkles className="h-3 w-3" />
                    {promptConf.label}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${diffConf.color}`}
                  >
                    {diffConf.label}
                  </span>
                </div>
                <h3 className="font-semibold">{s.nameShort}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {s.summary}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  上限 {s.maxAmount ? `${s.maxAmount.toLocaleString()}万円` : "—"}{" "}
                  | 補助率 {s.subsidyRate}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
