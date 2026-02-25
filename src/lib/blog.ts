import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  keywords: string[];
  author: string;
  relatedSubsidyIds: string[];
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  author: string;
}

function ensureBlogDir(): boolean {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function parsePost(fileName: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_DIR, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const slug = fileName.replace(/\.md$/, "");

    return {
      slug,
      title: (data.title as string) || "",
      date: (data.date as string) || "",
      description: (data.description as string) || "",
      tags: (data.tags as string[]) || [],
      keywords: (data.keywords as string[]) || [],
      author: (data.author as string) || "補助金サポート編集部",
      relatedSubsidyIds: (data.relatedSubsidyIds as string[]) || [],
      content,
    };
  } catch {
    return null;
  }
}

export function getAllPosts(): BlogPostMeta[] {
  if (!ensureBlogDir()) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((fileName) => {
      const post = parsePost(fileName);
      if (!post) return null;
      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        description: post.description,
        tags: post.tags,
        author: post.author,
      };
    })
    .filter((p): p is BlogPostMeta => p !== null);

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!ensureBlogDir()) return null;

  const fileName = `${slug}.md`;
  const filePath = path.join(BLOG_DIR, fileName);

  if (!fs.existsSync(filePath)) return null;

  return parsePost(fileName);
}

export async function renderMarkdown(content: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(content);
  return result.toString();
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAllSlugs(): string[] {
  if (!ensureBlogDir()) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
