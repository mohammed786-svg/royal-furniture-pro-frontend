import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/seo";
import { getAllBlogPosts } from "@/lib/seo/blog-posts";

const STATIC_PATHS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/stores", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6 },
  { path: "/franchise", changeFrequency: "monthly", priority: 0.5 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.4 },
  { path: "/living", changeFrequency: "daily", priority: 0.9 },
  { path: "/bedroom", changeFrequency: "daily", priority: 0.9 },
  { path: "/dining", changeFrequency: "daily", priority: 0.9 },
  { path: "/study-office", changeFrequency: "weekly", priority: 0.8 },
  { path: "/outdoor", changeFrequency: "weekly", priority: 0.7 },
  { path: "/decor", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
  { path: "/return-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/shipping-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/site-map", changeFrequency: "monthly", priority: 0.4 },
];

/**
 * Serves /sitemap.xml — lists storefront, category, and blog URLs for Google.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, "");

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((item) => ({
    url: `${base}${item.path === "/" ? "" : item.path}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...blogEntries];
}
