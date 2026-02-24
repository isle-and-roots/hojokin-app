import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Tag, ArrowLeft, Sparkles } from "lucide-react";
import {
  getAllSlugs,
  getPostBySlug,
  renderMarkdown,
} from "@/lib/blog";
import { BlogPostTracker, BlogCtaLink } from "./tracker";

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
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 記事本文 */}
        <article
          className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* CTA */}
        <div className="mt-12 rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">
            補助金の申請書類をAIで自動生成
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            プロフィールを登録するだけで、AIが審査に通りやすい申請書の下書きを作成します。まずは無料でお試しください。
          </p>
          <BlogCtaLink slug={slug} />
        </div>

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
