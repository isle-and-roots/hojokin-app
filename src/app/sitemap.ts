import type { MetadataRoute } from "next";
import { DUMMY_SUBSIDIES } from "@/lib/data/subsidies";
import { getAllSubsidiesFromDb } from "@/lib/db/subsidies";
import { getAllPosts, getAllTags } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

  // DB優先で補助金データ取得（フォールバック: 静的データ）
  let subsidies: Array<{ id: string; lastUpdated: string }>;
  try {
    const dbSubsidies = await getAllSubsidiesFromDb();
    subsidies = dbSubsidies && dbSubsidies.length > 0 ? dbSubsidies : DUMMY_SUBSIDIES;
  } catch {
    subsidies = DUMMY_SUBSIDIES;
  }

  const subsidyPages = subsidies.map((s) => ({
    url: `${baseUrl}/subsidies/${s.id}`,
    lastModified: new Date(s.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPosts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const tagPages = getAllTags().map((tag) => ({
    url: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shindan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/subsidies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/tokushoho`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...subsidyPages,
    ...blogPosts,
    ...tagPages,
  ];
}
