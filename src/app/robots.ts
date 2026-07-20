import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/seo";

/**
 * Serves /robots.txt — allow public pages; block admin, API, checkout, account.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/my-admin/",
          "/admin/",
          "/account/",
          "/checkout/",
          "/cart",
          "/wishlist",
          "/login",
          "/register",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/my-admin/", "/admin/", "/account/", "/checkout/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
