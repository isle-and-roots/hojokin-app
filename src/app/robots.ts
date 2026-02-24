import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hojokin.isle-and-roots.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/profile", "/applications", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
