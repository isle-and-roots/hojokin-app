import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Tag, ArrowRight, BookOpen } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "補助金コラム",
  description:
    "補助金の申請方法・書き方・採択のコツなど、中小企業経営者に役立つ情報を発信。持続化補助金・IT導入補助金・ものづくり補助金の最新情報も。",
  openGraph: {
    title: "補助金コラム | 補助金申請サポート",
    description:
      "補助金の申請方法・書き方・採択のコツなど、中小企業経営者に役立つ情報を発信。",
  },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

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

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">補助金コラム</h1>
          </div>
          <p className="text-muted-foreground">
            補助金の申請方法・書き方・採択のコツなど、中小企業経営者に役立つ情報を発信しています。
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>記事の準備中です。もうしばらくお待ちください。</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.date)}
                      </span>
                      {post.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {post.tags.slice(0, 3).join("・")}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium">
                      続きを読む
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
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
