/**
 * Browser / CDN cache key prefixes and TTL hints.
 */
export const browserCacheConfig = {
  prefix: "royal",
  ttl: {
    navbar: 3600,
    heroBanners: 3600,
    storefrontHome: 3600,
    product: 1800,
    category: 3600,
    settings: 86400,
  },
  keys: {
    navbar: "royal:navbar:tree",
    heroBanners: "royal:banners",
    storefrontHome: "royal:storefront:home",
    settings: "royal:settings:all",
  },
} as const;
