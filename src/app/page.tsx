import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Sparkles,
  FileText,
  Search,
  Shield,
  ArrowRight,
  ArrowDown,
  Clock,
  CreditCard,
  Brain,
  UserCheck,
  PenTool,
  FileDown,
  Banknote,
  Calendar,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { getLandingStats } from "@/lib/data/landing-stats";
import { PLAN_LIST } from "@/lib/plans";
import { PROMPT_SUPPORT_CONFIG } from "@/lib/data/subsidy-categories";
import { StickyHeader } from "@/components/landing/sticky-header";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { CategoryTabs } from "@/components/landing/category-tabs";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { CtaLink } from "@/components/landing/cta-link";
import { EmailCaptureSection } from "@/components/landing/email-capture-section";
import { ExitIntentModal } from "@/components/landing/exit-intent-modal";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "AIが生成した申請書は本当に使えるのですか？",
    answer:
      "AIは中小企業診断士の知見を基に、各補助金の審査基準に沿った文章を生成します。ただし、生成された内容は下書きとしてご活用ください。最終的な内容の確認・調整はお客様の責任で行っていただく必要があります。",
  },
  {
    question: "無料プランでどこまで使えますか？",
    answer:
      "無料プランでは月3回までAI生成をご利用いただけます。補助金の検索・閲覧は無制限です。まずは無料で品質をお確かめいただき、ご満足いただけましたらProプランへのアップグレードをご検討ください。",
  },
  {
    question: "どの補助金に対応していますか？",
    answer:
      "現在9カテゴリ100件以上の補助金に対応しています。持続化補助金やIT導入補助金など主要な補助金はAI完全対応で、セクションごとに最適化された文章を生成します。その他の補助金もAI汎用対応で申請書の下書きを生成できます。",
  },
  {
    question: "生成された申請書の品質に不安があります",
    answer:
      "AI生成後も自由に編集が可能です。また、追加のコンテキストを指定して再生成することもできます。Proプランでは回数制限が大幅に緩和されるため、何度でも試行錯誤して最適な申請書を作成できます。",
  },
  {
    question: "データのセキュリティは大丈夫ですか？",
    answer:
      "お客様の企業情報と申請書データはSupabaseの安全なデータベースに保存されます。通信はすべてSSL/TLSで暗号化され、APIキーの管理もセキュアに行っています。第三者への情報共有は一切ございません。",
  },
  {
    question: "解約はいつでもできますか？",
    answer:
      "はい、いつでも解約可能です。顧客ポータルからワンクリックで解約できます。解約後も現在の請求期間の終了までサービスをご利用いただけます。",
  },
];

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function formatAmount(amount: number | null): string {
  if (amount === null) return "要確認";
  if (amount >= 10000) return `${(amount / 10000).toFixed(0)}億円`;
  return `${amount.toLocaleString()}万円`;
}

function formatPrice(price: number): string {
  if (price === 0) return "¥0";
  return `¥${price.toLocaleString()}`;
}

export default async function LandingPage() {
  // 認証済みユーザーはダッシュボードへリダイレクト
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch {
    // Supabase 未設定の場合はランディングページを表示
  }

  const stats = getLandingStats();

  return (
    <div className="min-h-screen">
      {/* Exit Intent Modal */}
      <ExitIntentModal />

      {/* 1. Sticky Header */}
      <StickyHeader />

      {/* 2. Hero */}
      <section className="hero-gradient relative overflow-hidden pt-28 pb-20 px-6">
        {/* Decorative blurred circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            AI搭載 補助金申請支援サービス
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
            <span className="gradient-text">{stats.total}件以上の補助金</span>
            に対応
            <br />
            申請書類をAIが自動生成
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            持続化補助金・IT導入補助金・ものづくり補助金など、{stats.categoryCount}
            カテゴリ{stats.total}
            件の補助金をカバー。企業プロフィールを入力するだけで、中小企業診断士レベルの申請書類をAIが生成します。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <CtaLink
              href="/login"
              location="hero"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              無料で申請書を作成する
              <ArrowRight className="h-5 w-5" />
            </CtaLink>
            <Link
              href="/subsidies"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-border font-semibold text-lg hover:bg-accent transition-all"
            >
              <Search className="h-5 w-5" />
              補助金を探す
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-600" />
              無料プランあり
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4" />
              クレジットカード不要
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              3分で最初の生成
            </span>
          </div>
        </div>
      </section>

      {/* 3. Stats Bar */}
      <section className="py-10 px-6 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedCounter
            target={stats.total}
            suffix="件+"
            label="対応補助金数"
          />
          <AnimatedCounter
            target={stats.categoryCount}
            suffix="カテゴリ"
            label="補助金カテゴリ"
          />
          <AnimatedCounter
            target={stats.aiSupported}
            suffix="件"
            label="AI対応補助金"
          />
          <AnimatedCounter
            target={stats.fullSupport}
            suffix="件"
            label="AI完全対応"
          />
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
              HOW IT WORKS
            </p>
            <h2 className="text-3xl font-bold">3ステップで申請書類が完成</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              補助金の検索からWord出力まで、すべてブラウザ上で完結します
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-2xl border border-border bg-card p-8 text-center hover-lift step-connector">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                1
              </div>
              <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <Search className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">補助金を探す</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {stats.categoryCount}カテゴリ{stats.total}
                件以上の補助金データベースから、業種・規模に合った補助金を検索。AI対応度や難易度も一目で確認できます。
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-border bg-card p-8 text-center hover-lift step-connector">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                2
              </div>
              <div className="mx-auto h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-5">
                <Sparkles className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">AIが下書きを生成</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                企業プロフィールを基に、中小企業診断士レベルのAIが各セクションの申請書を自動生成。自由に編集も可能です。
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-border bg-card p-8 text-center hover-lift">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                3
              </div>
              <div className="mx-auto h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                <FileText className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Wordで出力</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                完成した申請書類をWord(DOCX)形式でエクスポート。そのまま申請窓口に提出できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. Email Capture */}
      <EmailCaptureSection />

      {/* 5. Category Showcase */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
              CATEGORIES
            </p>
            <h2 className="text-3xl font-bold">
              {stats.categoryCount}カテゴリの補助金をカバー
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              業種や目的に合わせて最適な補助金を見つけられます
            </p>
          </div>

          <CategoryTabs categories={stats.categories} />
        </div>
      </section>

      {/* 6. Popular Subsidies */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
              POPULAR
            </p>
            <h2 className="text-3xl font-bold">人気の補助金</h2>
            <p className="text-muted-foreground mt-3">
              最も多く利用されている補助金をご紹介
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.topSubsidies.map((subsidy) => {
              const supportConfig =
                PROMPT_SUPPORT_CONFIG[subsidy.promptSupport];
              return (
                <div
                  key={subsidy.id}
                  className="rounded-2xl border border-border bg-card p-6 hover-lift"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        stats.categoryColors[subsidy.categories[0]]
                      )}
                    >
                      {stats.categoryLabels[subsidy.categories[0]]}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1",
                        supportConfig.color
                      )}
                    >
                      <Sparkles className="h-3 w-3" />
                      {supportConfig.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{subsidy.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {subsidy.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
                    <span className="flex items-center gap-1">
                      <Banknote className="h-4 w-4" />
                      上限 {formatAmount(subsidy.maxAmount)}
                    </span>
                    <span>補助率 {subsidy.subsidyRate}</span>
                    {subsidy.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {subsidy.deadline}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/subsidies"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              すべての補助金を見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. AI Feature Showcase */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
              AI GENERATION
            </p>
            <h2 className="text-3xl font-bold">
              中小企業診断士レベルのAIが申請書を生成
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Before/After */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 opacity-60">
                <p className="text-xs text-muted-foreground mb-3 font-medium">
                  従来の申請書作成
                </p>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-destructive/20 rounded w-1/2 mt-4" />
                  <p className="text-xs text-destructive mt-1">
                    何を書けばいいか分からない...
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  所要時間: 3〜5日
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-primary" />
              </div>

              <div className="rounded-xl border-2 border-primary/30 bg-card p-5 shadow-lg shadow-primary/5">
                <p className="text-xs text-primary font-semibold mb-3 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI生成結果
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;当社は2015年の創業以来、地域密着型の飲食業として事業を展開してまいりました。代表者の15年にわたる料理人経験を活かし、地元産食材を使った...&rdquo;
                </p>
                <p className="text-xs text-green-600 mt-3 font-medium">
                  所要時間: 約3分
                </p>
              </div>
            </div>

            {/* Right: Feature list */}
            <div className="space-y-6">
              <FeatureItem
                icon={Brain}
                title="補助金ごとに最適化されたプロンプト"
                description="持続化補助金やIT導入補助金など、補助金の審査基準に合わせた専用プロンプトで高品質な文章を生成します。"
              />
              <FeatureItem
                icon={UserCheck}
                title="企業プロフィールを最大活用"
                description="一度登録した企業情報を全セクションに反映。手入力の手間を最小限に抑えます。"
              />
              <FeatureItem
                icon={PenTool}
                title="自由な編集と再生成"
                description="AI生成後も自由に編集可能。納得いかない部分は再生成で改善できます。"
              />
              <FeatureItem
                icon={FileDown}
                title="Word(DOCX)エクスポート"
                description="完成した申請書をWord形式で出力。そのまま申請窓口に提出できます。"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Pricing Preview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
              PRICING
            </p>
            <h2 className="text-3xl font-bold">シンプルな料金プラン</h2>
            <p className="text-muted-foreground mt-3">
              まずは無料プランでお試しください。いつでもアップグレード可能です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLAN_LIST.map((plan) => (
              <div
                key={plan.key}
                className={cn(
                  "rounded-2xl border bg-card p-6 hover-lift relative",
                  plan.highlighted
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                      おすすめ
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <p className="text-3xl font-bold">
                    {formatPrice(plan.price)}
                    {plan.price > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /月
                      </span>
                    )}
                  </p>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-600 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.price === 0 ? "/login" : "/pricing"}
                  className={cn(
                    "block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors",
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border hover:bg-accent"
                  )}
                >
                  {plan.price === 0 ? "無料で始める" : "詳細を見る"}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            すべてのプランは月額制（税込）です。いつでもキャンセルできます。
            <Link
              href="/pricing"
              className="text-primary hover:underline ml-2"
            >
              詳細を見る →
            </Link>
          </p>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
              FAQ
            </p>
            <h2 className="text-3xl font-bold">よくある質問</h2>
          </div>

          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="py-20 px-6 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 px-4 py-1.5 text-sm font-medium mb-6">
            <Clock className="h-4 w-4" />
            多くの補助金が年度内に締め切りを迎えます
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            補助金の申請、まだ間に合います
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            AIを使えば、申請書の作成時間を大幅に短縮。
            <br className="hidden sm:block" />
            無料プランでまず品質をお確かめください。
          </p>

          <CtaLink
            href="/login"
            location="final_cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            無料で申請書を作成する
            <ArrowRight className="h-5 w-5" />
          </CtaLink>

          <p className="mt-4 text-sm text-muted-foreground">
            クレジットカード不要 ・ 3分で最初の生成
          </p>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    H
                  </span>
                </div>
                <span className="font-bold">補助金サポート</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AIで中小企業の補助金申請をサポート
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">サービス</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/subsidies"
                    className="hover:text-foreground transition-colors"
                  >
                    補助金を探す
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    料金プラン
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    ブログ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">法的情報</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/legal/tokushoho"
                    className="hover:text-foreground transition-colors"
                  >
                    特定商取引法に基づく表記
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">運営</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>ISLE &amp; ROOTS</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ISLE &amp; ROOTS. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
