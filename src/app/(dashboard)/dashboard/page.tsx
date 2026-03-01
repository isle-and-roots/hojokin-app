import Link from "next/link";
import {
  Building2,
  FileText,
  TrendingUp,
  Search,
  Sparkles,
  ArrowRight,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { PageTransition, AnimatedGrid, AnimatedItem } from "@/components/ui/motion";
import { searchSubsidies, getRecommendedSubsidiesWithReasons } from "@/lib/subsidies";
import {
  PROMPT_SUPPORT_CONFIG,
  DIFFICULTY_CONFIG,
} from "@/lib/data/subsidy-categories";
import { PlanBadgeCard } from "@/components/dashboard/plan-badge";
import { RecommendedSubsidies } from "@/components/dashboard/recommended-subsidies";
import { OnboardingStepper } from "@/components/dashboard/onboarding-stepper";
import { SignupTracker } from "@/components/dashboard/signup-tracker";
import { WelcomeModal } from "@/components/dashboard/welcome-modal";
import { QuotaWidget } from "@/components/dashboard/quota-widget";
import { ProfileCompletenessBanner } from "@/components/dashboard/profile-completeness-banner";
import { IndustryQuickStart } from "@/components/dashboard/industry-quick-start";
import { SmartNotifications } from "@/components/dashboard/smart-notifications";
import { ChatOnboardingCta } from "@/components/dashboard/chat-onboarding-cta";
import { calculateProfileCompleteness } from "@/lib/subsidies";
import type { BusinessProfile, RecommendationResult } from "@/types";

interface StatCard {
  label: string;
  value: number;
  icon: typeof FileText;
  color: string;
  emptyIcon: typeof FileText;
  emptyCta: string;
  emptyHref: string;
}

const STAT_CONFIGS: StatCard[] = [
  {
    label: "申請中",
    value: 0,
    icon: FileText,
    color: "text-blue-600",
    emptyIcon: FileText,
    emptyCta: "最初の申請書をAIで作成",
    emptyHref: "/applications/new",
  },
  {
    label: "採択済",
    value: 0,
    icon: TrendingUp,
    color: "text-green-600",
    emptyIcon: Trophy,
    emptyCta: "補助金を探して採択を目指そう",
    emptyHref: "/subsidies",
  },
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

async function getUserPlan(): Promise<string> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return "free";
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "free";
    const { data } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    return (data?.plan as string) ?? "free";
  } catch {
    return "free";
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

  const [profile, applicationCount, userPlan] = await Promise.all([
    getProfile(),
    getApplicationCount(),
    getUserPlan(),
  ]);

  let recommendation: RecommendationResult | null = null;
  let profileCompleteness = 0;
  if (profile) {
    recommendation = await getRecommendedSubsidiesWithReasons(profile);
    profileCompleteness = calculateProfileCompleteness(profile);
  }

  return (
    <PageTransition>
    <div className="p-8">
      <SignupTracker isWelcome={isWelcome} />
      <WelcomeModal show={isWelcome && !profile} />

      {/* スマート通知 */}
      <SmartNotifications />

      {/* 初回ユーザー向けチャットCTA (セッション0件のとき自動表示) */}
      <ChatOnboardingCta />

      <div className="mb-8">
        {profile ? (
          <h1 className="text-2xl font-bold">こんにちは、{profile.companyName}さん</h1>
        ) : (
          <h1 className="text-2xl font-bold">ダッシュボード</h1>
        )}
        <p className="text-muted-foreground mt-1">
          補助金申請の状況を一覧で確認できます
        </p>
      </div>

      {/* ステータスカード */}
      <AnimatedGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {STAT_CONFIGS.map((stat) => (
          <AnimatedItem key={stat.label}>
            {stat.value === 0 ? (
              <Link
                href={stat.emptyHref}
                className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-card p-6 h-full hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  {stat.emptyCta}
                  <ArrowRight className="h-3 w-3" />
                </p>
              </Link>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 h-full">
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
            )}
          </AnimatedItem>
        ))}
        <AnimatedItem>
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50 p-6 shadow-sm h-full">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                AI対応補助金
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold">{aiSupported.length}件</p>
          </div>
        </AnimatedItem>
        <AnimatedItem>
          <QuotaWidget />
        </AnimatedItem>
        <AnimatedItem>
          <PlanBadgeCard />
        </AnimatedItem>
      </AnimatedGrid>

      {/* プロフィール充実度バナー */}
      {profile && (
        <ProfileCompletenessBanner
          completeness={profileCompleteness}
          plan={userPlan}
        />
      )}

      {/* プロフィール未作成: OnboardingStepperを優先表示 (クイックアクション非表示) */}
      {!profile && (
        <>
          {/* 業種選択 → クイックレコメンド */}
          <IndustryQuickStart />

          <OnboardingStepper
            hasProfile={false}
            hasApplication={false}
            isWelcome={isWelcome && !profile}
          />
        </>
      )}

      {/* プロフィールあり + 申請なし: 次のステップとクイックアクション */}
      {profile && applicationCount === 0 && (
        <>
          <OnboardingStepper
            hasProfile={true}
            hasApplication={false}
            isWelcome={false}
          />

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pl-3 border-l-[3px] border-primary">クイックアクション</h2>
            <AnimatedGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatedItem>
                <Link
                  href="/subsidies"
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full"
                >
                  <div className="flex items-center justify-between">
                    <Search className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-semibold">補助金を探す</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activeSubsidies.length}件の補助金からぴったりの制度を検索
                    </p>
                  </div>
                </Link>
              </AnimatedItem>
              <AnimatedItem>
                <Link
                  href="/applications"
                  data-tour="application-card"
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full"
                >
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-semibold">申請一覧</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      作成済みの申請書類を管理
                    </p>
                  </div>
                </Link>
              </AnimatedItem>
              <AnimatedItem>
                <Link
                  href="/chat"
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full"
                >
                  <div className="flex items-center justify-between">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-semibold">補助金について質問する</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      AIが補助金の疑問に答えます
                    </p>
                  </div>
                </Link>
              </AnimatedItem>
            </AnimatedGrid>
          </div>
        </>
      )}

      {/* プロフィールあり + 申請あり: チェックリスト(shindan未完の場合表示) + クイックアクション */}
      {profile && applicationCount > 0 && (
        <OnboardingStepper
          hasProfile={true}
          hasApplication={true}
          isWelcome={false}
        />
      )}

      {profile && applicationCount > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pl-3 border-l-[3px] border-primary">クイックアクション</h2>
          <AnimatedGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatedItem>
              <Link
                href="/profile"
                data-tour="profile-card"
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full"
              >
                <div className="flex items-center justify-between">
                  <Building2 className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h3 className="font-semibold">企業プロフィール</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    事業者情報を確認・更新する
                  </p>
                </div>
              </Link>
            </AnimatedItem>
            <AnimatedItem>
              <Link
                href="/subsidies"
                data-tour="subsidy-search-card"
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full"
              >
                <div className="flex items-center justify-between">
                  <Search className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h3 className="font-semibold">補助金を探す</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeSubsidies.length}件の補助金からぴったりの制度を検索
                  </p>
                </div>
              </Link>
            </AnimatedItem>
            <AnimatedItem>
              <Link
                href="/applications"
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full"
              >
                <div className="flex items-center justify-between">
                  <FileText className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h3 className="font-semibold">申請一覧</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    作成済みの申請書類を管理
                  </p>
                </div>
              </Link>
            </AnimatedItem>
            <AnimatedItem>
              <Link
                href="/chat"
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full"
              >
                <div className="flex items-center justify-between">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h3 className="font-semibold">補助金について質問する</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    AIが補助金の疑問に答えます
                  </p>
                </div>
              </Link>
            </AnimatedItem>
          </AnimatedGrid>
        </div>
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
          <h2 className="text-lg font-semibold pl-3 border-l-[3px] border-primary">対応補助金</h2>
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
    </PageTransition>
  );
}
