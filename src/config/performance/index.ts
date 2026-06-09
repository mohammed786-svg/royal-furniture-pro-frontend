/**
 * Rendering strategy reference for Royal Furniture Pro.
 *
 * Route groups (no pages yet):
 * - app/(storefront)  → SSR + ISR catalog, SSG marketing shells
 * - app/(admin)       → SSR dashboard, dynamic, no cache
 * - app/(auth)        → SSR auth flows
 * - app/(marketing)   → SSG legal/CMS pages
 *
 * Patterns:
 * - Server Components: default for data fetching
 * - Client Components: cart, wishlist, websocket, theme, forms
 * - Streaming: loading.tsx + Suspense per route when built
 * - ISR: revalidate + tags from config/cache/revalidation.config.ts
 * - Edge: move middleware + geo routes to edge runtime when needed
 */
export const performanceConfig = {
  runtime: {
    default: "nodejs" as const,
    edgeCandidates: ["middleware", "og", "sitemap"] as const,
  },
  rendering: {
    storefront: "isr" as const,
    product: "isr" as const,
    admin: "ssr" as const,
    marketing: "ssg" as const,
  },
} as const;
