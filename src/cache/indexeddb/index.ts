/**
 * IndexedDB cache architecture for offline cart/wishlist (future mobile PWA).
 */
export const indexedDbConfig = {
  name: "royal-furniture-pro",
  version: 1,
  stores: {
    cart: "cart",
    wishlist: "wishlist",
    catalog: "catalog",
  },
} as const;

export type IndexedDbStoreName =
  (typeof indexedDbConfig.stores)[keyof typeof indexedDbConfig.stores];
