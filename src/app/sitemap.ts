import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/seo";

/**
 * Sitemap architecture — extend with dynamic routes when pages are implemented.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
