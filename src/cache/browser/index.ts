import { browserCacheConfig } from "@/config/cache";

/**
 * Browser cache helpers — pair with CDN / Redis-backed APIs in production.
 */
export function buildCacheKey(
  segment: keyof typeof browserCacheConfig.keys,
  suffix?: string,
): string {
  const base = browserCacheConfig.keys[segment];
  return suffix ? `${base}:${suffix}` : base;
}

export const browserCacheTTL = browserCacheConfig.ttl;
