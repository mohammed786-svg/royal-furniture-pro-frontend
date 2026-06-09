import { STATIC_PAGE_SLUGS } from "@/lib/constants/static-page-data";

/** Top-level URL segments that are NOT furniture departments */
export const RESERVED_TOP_LEVEL_SLUGS = new Set([
  ...STATIC_PAGE_SLUGS.filter((s) => s !== "sitemap"),
  "site-map",
  "product",
  "cart",
  "wishlist",
  "login",
  "register",
  "account",
  "checkout",
  "track-order",
  "coming-soon",
  "api",
  "_next",
  "favicon.ico",
]);

export function isReservedTopLevelSlug(slug: string): boolean {
  return RESERVED_TOP_LEVEL_SLUGS.has(slug);
}
