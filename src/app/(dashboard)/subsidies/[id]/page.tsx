import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Banknote,
  Calendar,
  ArrowRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileText,
  ClipboardList,
  Building2,
  BookOpen,
} from "lucide-react";
import { getSubsidyById } from "@/lib/subsidies";
import { getPostsBySubsidyId } from "@/lib/blog";
import { DUMMY_SUBSIDIES } from "@/lib/data/subsidies";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  DIFFICULTY_CONFIG,
  PROMPT_SUPPORT_CONFIG,
  SCALE_LABELS,
  INDUSTRY_LABELS,
} from "@/lib/data/subsidy-categories";

/** ISR: 1時間ごとに再検証 */
export const revalidate = 3600;

/** jGrantsから追加された補助金もSSGできるようdynamic paramsを許可 */
export const dynamicParams = true;

export async function generateStaticParams() {
  return DUMMY_SUBSIDIES.map((s: { id: string }) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const subsidy = await getSubsidyById(id);

  if (!subsidy) {
    return { title: "補助金が見つかりません" };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

  return {
    title: `${subsidy.nameShort} | 補助金申請サポート`,
    description: subsidy.summary,
    openGraph: {
      title: `${subsidy.nameShort} | 補助金申請サポート`,
      description: subsidy.summary,
      type: "article",
      url: `${siteUrl}/subsidies/${id}`,
    },
    twitter: {
      card: "summary",
      title: subsidy.nameShort,
      description: subsidy.summary,
    },
    alternates: {
      canonical: `${siteUrl}/subsidies/${id}`,
    },
  };
}

export default async function SubsidyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const subsidy = await getSubsidyById(id);

  if (!subsidy) {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: subsidy.name,
    description: subsidy.summary,
    provider: {
      "@type": "GovernmentOrganization",
      name: subsidy.department,
    },
    areaServed: {
      "@type": "Country",
      name: "Japan",
    },
    url: `${siteUrl}/subsidies/${id}`,
    ...(subsidy.url ? { sameAs: subsidy.url } : {}),
  };

  const relatedPosts = getPostsBySubsidyId(id);
  const difficultyConf = DIFFICULTY_CONFIG[subsidy.difficulty];
  const promptConf = PROMPT_SUPPORT_CONFIG[subsidy.promptSupport];

  const formatAmount = (amount: number | null) => {
    if (amount === null) return "—";
    if (amount >= 10000) return `${(amount / 10000).toLocaleString()}億円`;
    return `${amount.toLocaleString()}万円`;
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "随時受付";
    const d = new Date(deadline);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="p-8 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* パンくず */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/subsidies" className="hover:text-foreground transition-colors">
          補助金検索
        </Link>
        <span>/</span>
        <span className="text-foreground">{subsidy.nameShort}</span>
      </nav>

      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {subsidy.categories.map((cat) => (
            <span
              key={cat}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[cat]}`}
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyConf.color}`}
          >
            {difficultyConf.label}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${promptConf.color}`}
          >
            {subsidy.promptSupport !== "NONE" && (
              <Sparkles className="h-3 w-3" />
            )}
            {promptConf.label}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1">{subsidy.name}</h1>
        <p className="text-muted-foreground">{subsidy.department}</p>
      </div>

      {/* 金額・締切サマリ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Banknote className="h-3.5 w-3.5" />
            上限額
          </div>
          <p className="text-lg font-bold">{formatAmount(subsidy.maxAmount)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Banknote className="h-3.5 w-3.5" />
            補助率
          </div>
          <p className="text-lg font-bold">{subsidy.subsidyRate}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Calendar className="h-3.5 w-3.5" />
            締切
          </div>
          <p className="text-lg font-bold">{formatDeadline(subsidy.deadline)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Building2 className="h-3.5 w-3.5" />
            対象規模
          </div>
          <p className="text-sm font-bold">
            {subsidy.targetScale.map((s) => SCALE_LABELS[s]).join("・")}
          </p>
        </div>
      </div>

      {/* 概要 */}
      <section className="rounded-xl border border-border bg-card p-5 mb-4">
        <h2 className="font-semibold mb-2">概要</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {subsidy.description}
        </p>
        {subsidy.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {subsidy.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 対象業種 */}
      <section className="rounded-xl border border-border bg-card p-5 mb-4">
        <h2 className="font-semibold mb-2">対象業種</h2>
        <div className="flex flex-wrap gap-2">
          {subsidy.targetIndustries.map((ind) => (
            <span
              key={ind}
              className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium"
            >
              {INDUSTRY_LABELS[ind]}
            </span>
          ))}
        </div>
      </section>

      {/* 適格性要件 */}
      {subsidy.eligibilityCriteria.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5 mb-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            適格性要件
          </h2>
          <ul className="space-y-2">
            {subsidy.eligibilityCriteria.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-green-600 mt-0.5">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 対象外ケース */}
      {subsidy.excludedCases.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5 mb-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            対象外となるケース
          </h2>
          <ul className="space-y-2">
            {subsidy.excludedCases.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-red-500 mt-0.5">✕</span>
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 必要書類 */}
      {subsidy.requiredDocuments.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5 mb-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            必要書類
          </h2>
          <ul className="space-y-1.5">
            {subsidy.requiredDocuments.map((doc, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 申請書セクション構成 */}
      {subsidy.applicationSections.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5 mb-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            申請書セクション構成
          </h2>
          <div className="space-y-2">
            {subsidy.applicationSections.map((sec) => (
              <div
                key={sec.key}
                className="flex items-start gap-3 rounded-lg bg-muted/50 px-4 py-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{sec.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sec.description}
                  </p>
                </div>
                {sec.group && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {sec.group}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 関連ブログ記事 */}
      {relatedPosts.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5 mb-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            関連する記事
          </h2>
          <div className="space-y-3">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-lg bg-muted/50 px-4 py-3 hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium hover:text-primary transition-colors">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="flex items-center gap-3">
        {subsidy.promptSupport !== "NONE" && subsidy.isActive && (
          <Link
            href={`/applications/new?subsidyId=${subsidy.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            この補助金で申請を作成
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        {subsidy.url && (
          <a
            href={subsidy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
          >
            公式サイト
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <Link
          href="/subsidies"
          className="px-5 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          検索に戻る
        </Link>
      </div>
    </div>
  );
}
