import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Tag, ArrowLeft, Sparkles } from "lucide-react";
import {
  getAllSlugs,
  getPostBySlug,
  renderMarkdown,
} from "@/lib/blog";
import { BlogPostTracker, BlogCtaLink, InlineBlogCta } from "./tracker";
import { RelatedPosts } from "@/components/blog/related-posts";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "記事が見つかりません" };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      url: `${siteUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const htmlContent = await renderMarkdown(post.content);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "ISLE & ROOTS Inc.",
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
    keywords: post.keywords.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "コラム",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-foreground hover:text-primary transition-colors"
          >
            補助金申請サポート
          </Link>
          <Link
            href="/login"
            className="text-sm text-primary hover:underline"
          >
            ログイン
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <BlogPostTracker slug={slug} title={post.title} />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        {/* パンくず */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            ホーム
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-foreground transition-colors"
          >
            コラム
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">
            {post.title}
          </span>
        </nav>

        {/* 記事ヘッダー */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span>{post.author}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* 記事本文（前半） */}
        <article
          className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* 中間インラインCTA */}
        <InlineBlogCta slug={slug} />

        {/* 末尾CTA */}
        <div className="mt-12 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">
            補助金の申請書をAIで自動作成
          </h3>
          <p className="text-sm text-muted-foreground mb-2 max-w-md mx-auto">
            事業内容を入力するだけで、審査に通りやすい申請書の下書きをAIが自動生成。
            採択率アップに直結する具体的な文章を、3分で作成できます。
          </p>
          <ul className="flex flex-col sm:flex-row justify-center gap-x-6 gap-y-1 text-xs text-muted-foreground mb-6">
            <li className="flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary shrink-0" />
              無料プランで月3セクションまで生成
            </li>
            <li className="flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary shrink-0" />
              15種類以上の補助金に対応
            </li>
            <li className="flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary shrink-0" />
              クレジットカード不要で登録
            </li>
          </ul>
          <BlogCtaLink slug={slug} variant="bottom" />
        </div>

        {/* 関連する補助金 */}
        {post.relatedSubsidyIds.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3">関連する補助金</h3>
            <div className="flex flex-wrap gap-2">
              {post.relatedSubsidyIds.map((id) => (
                <Link
                  key={id}
                  href={`/subsidies/${id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {id}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 関連記事 */}
        <RelatedPosts currentSlug={slug} currentTags={post.tags} />

        {/* 戻るリンク */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            コラム一覧に戻る
          </Link>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-border mt-16 py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            補助金申請サポート
          </Link>
          <span className="mx-2">|</span>
          <Link
            href="/subsidies"
            className="hover:text-foreground transition-colors"
          >
            補助金検索
          </Link>
          <span className="mx-2">|</span>
          <Link
            href="/pricing"
            className="hover:text-foreground transition-colors"
          >
            料金プラン
          </Link>
          <p className="mt-3 text-xs">
            &copy; {new Date().getFullYear()} ISLE & ROOTS Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
