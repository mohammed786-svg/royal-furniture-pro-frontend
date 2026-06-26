import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/seo";

/**
 * Robots.txt architecture — extend disallow rules for admin/dashboard routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/my-admin/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
