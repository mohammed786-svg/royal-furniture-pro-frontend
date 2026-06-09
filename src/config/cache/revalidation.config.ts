/**
 * ISR / on-demand revalidation tags (Next.js).
 */
export const revalidationConfig = {
  tags: {
    navbar: "navbar",
    categories: "categories",
    products: "products",
    product: (slug: string) => `product:${slug}`,
    category: (slug: string) => `category:${slug}`,
    banners: "banners",
    cms: "cms",
    settings: "settings",
  },
  times: {
    static: false as const,
    catalog: 300,
    homepage: 60,
    product: 120,
  },
} as const;
