/**
 * React Query key factory — use when implementing API hooks.
 */
export const queryKeys = {
  all: ["royal"] as const,
  auth: {
    all: () => [...queryKeys.all, "auth"] as const,
    session: () => [...queryKeys.auth.all(), "session"] as const,
  },
  navbar: () => [...queryKeys.all, "navbar"] as const,
  heroBanners: (position = "HOME_HERO") =>
    [...queryKeys.all, "hero-banners", position] as const,
  storefrontHome: () => [...queryKeys.all, "storefront-home"] as const,
  categories: {
    all: () => [...queryKeys.all, "categories"] as const,
    tree: () => [...queryKeys.categories.all(), "tree"] as const,
    detail: (slug: string) => [...queryKeys.categories.all(), "detail", slug] as const,
    listing: (
      categorySlug: string,
      subCategorySlug: string,
      underSubCategorySlug?: string,
    ) =>
      [
        ...queryKeys.categories.all(),
        "listing",
        categorySlug,
        subCategorySlug,
        underSubCategorySlug ?? "",
      ] as const,
  },
  products: {
    all: () => [...queryKeys.all, "products"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.all(), "list", filters] as const,
    detail: (slug: string) => [...queryKeys.products.all(), "detail", slug] as const,
    inventory: (id: number | string) =>
      [...queryKeys.products.all(), "inventory", id] as const,
  },
  cart: {
    all: () => [...queryKeys.all, "cart"] as const,
    guest: (sessionId: string) =>
      [...queryKeys.cart.all(), "guest", sessionId] as const,
    customer: (customerId: number | string) =>
      [...queryKeys.cart.all(), "customer", customerId] as const,
  },
  wishlist: {
    all: () => [...queryKeys.all, "wishlist"] as const,
  },
  orders: {
    all: () => [...queryKeys.all, "orders"] as const,
    detail: (id: number | string) => [...queryKeys.orders.all(), "detail", id] as const,
  },
  dashboard: {
    all: () => [...queryKeys.all, "dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all(), "stats"] as const,
  },
} as const;
