import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { getAllTags, getPostsByTag } from "@/lib/blog";

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

  return {
    title: `「${decodedTag}」の記事一覧`,
    description: `「${decodedTag}」に関する補助金・助成金の情報記事一覧。中小企業の補助金申請に役立つコラムをお届けします。`,
    alternates: {
      canonical: `${siteUrl}/blog/tag/${tag}`,
    },
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  const allTags = getAllTags();

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
          <span className="text-foreground">{decodedTag}</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">「{decodedTag}」の記事一覧</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {posts.length}件の記事
          </p>
        </div>

        {/* 記事一覧 */}
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>このタグの記事はまだありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <h2 className="font-semibold leading-snug hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.date)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                          t === decodedTag
                            ? "bg-primary/10 text-primary font-medium"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 他のタグ */}
        {allTags.length > 1 && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              他のタグ
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags
                .filter((t) => t !== decodedTag)
                .map((t) => (
                  <Link
                    key={t}
                    href={`/blog/tag/${encodeURIComponent(t)}`}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {t}
                  </Link>
                ))}
            </div>
          </div>
        )}

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
