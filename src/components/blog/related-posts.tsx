import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { getAllPosts, type BlogPostMeta } from "@/lib/blog";

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function RelatedPosts({ currentSlug, currentTags }: RelatedPostsProps) {
  const allPosts = getAllPosts();

  // Filter out current post
  const otherPosts = allPosts.filter((p) => p.slug !== currentSlug);

  // Score posts by tag overlap
  const scored = otherPosts.map((post) => {
    const overlap = post.tags.filter((t) => currentTags.includes(t)).length;
    return { post, score: overlap };
  });

  // Sort by score (desc), then by date (desc)
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.date.localeCompare(a.post.date);
  });

  const related: BlogPostMeta[] = scored.slice(0, 3).map((s) => s.post);

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-bold mb-4">関連記事</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <h4 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {post.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
              <Calendar className="h-3 w-3" />
              {formatDate(post.date)}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          すべての記事を見る
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
