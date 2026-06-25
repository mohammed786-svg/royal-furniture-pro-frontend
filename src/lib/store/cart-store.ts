"use client";

import { create } from "zustand";
import { productDetailToProductItem } from "@/lib/cart/line-item";
import type { CartLineItem } from "@/lib/constants/cart-data";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import {
  addStorefrontCartItem,
  addStorefrontWishlistItem,
  clearStorefrontCart,
  fetchStorefrontCart,
  fetchStorefrontWishlist,
  removeStorefrontCartItem,
  removeStorefrontWishlistItem,
  updateStorefrontCartItem,
} from "@/services/storefront-commerce";

type CartStore = {
  cartItems: CartLineItem[];
  wishlistItems: CartLineItem[];
  cartLoading: boolean;
  wishlistLoading: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addToCart: (product: ProductItem, quantity?: number) => Promise<void>;
  addDetailToCart: (product: ProductDetail, quantity?: number) => Promise<void>;
  updateCartQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  addToWishlist: (product: ProductItem) => Promise<void>;
  addDetailToWishlist: (product: ProductDetail) => Promise<void>;
  removeFromWishlist: (lineId: string) => Promise<void>;
  addWishlistItemToCart: (lineId: string) => Promise<void>;
  addAllWishlistToCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  cartItemCount: () => number;
  clearCart: () => Promise<void>;
  setCartFromApi: (items: CartLineItem[]) => void;
  setWishlistFromApi: (items: CartLineItem[]) => void;
};

function normalizeCartItems(items: CartLineItem[]): CartLineItem[] {
  return items.map((item) => ({
    ...item,
    image: resolveMediaUrl(item.image) ?? item.image,
  }));
}

function findByProductId(items: CartLineItem[], productId: string) {
  return items.find((item) => item.productId === productId);
}

async function refreshWishlist(set: (partial: Partial<CartStore>) => void) {
  try {
    const data = await fetchStorefrontWishlist();
    set({ wishlistItems: normalizeCartItems(data.items), wishlistLoading: false });
  } catch {
    set({ wishlistLoading: false });
  }
}

export const useCartStore = create<CartStore>()((set, get) => ({
  cartItems: [],
  wishlistItems: [],
  cartLoading: false,
  wishlistLoading: false,
  hydrated: false,

  setCartFromApi: (items) => set({ cartItems: normalizeCartItems(items) }),
  setWishlistFromApi: (items) => set({ wishlistItems: normalizeCartItems(items) }),

  hydrate: async () => {
    if (get().hydrated) return;
    set({ cartLoading: true, wishlistLoading: true });
    try {
      const cart = await fetchStorefrontCart();
      set({
        cartItems: normalizeCartItems(cart.items),
        cartLoading: false,
        hydrated: true,
      });
    } catch {
      set({ cartLoading: false, hydrated: true });
    }
    await refreshWishlist(set);
  },

  addToCart: async (product, quantity = 1) => {
    const data = await addStorefrontCartItem({ productId: product.id, quantity });
    set({ cartItems: normalizeCartItems(data.items) });
  },

  addDetailToCart: async (product, quantity = 1) => {
    await get().addToCart(productDetailToProductItem(product), quantity);
  },

  updateCartQuantity: async (lineId, quantity) => {
    const data = await updateStorefrontCartItem(lineId, {
      quantity: Math.max(1, quantity),
    });
    set({ cartItems: normalizeCartItems(data.items) });
  },

  removeFromCart: async (lineId) => {
    const data = await removeStorefrontCartItem(lineId);
    set({ cartItems: normalizeCartItems(data.items) });
  },

  addToWishlist: async (product) => {
    if (findByProductId(get().wishlistItems, product.id)) return;
    try {
      const data = await addStorefrontWishlistItem(product.id);
      set({ wishlistItems: normalizeCartItems(data.items) });
    } catch {
      // Guest users must sign in for wishlist
    }
  },

  addDetailToWishlist: async (product) => {
    await get().addToWishlist(productDetailToProductItem(product));
  },

  removeFromWishlist: async (lineId) => {
    const item = get().wishlistItems.find((i) => i.id === lineId);
    if (!item) return;
    const data = await removeStorefrontWishlistItem(item.productId);
    set({ wishlistItems: normalizeCartItems(data.items) });
  },

  addWishlistItemToCart: async (lineId) => {
    const item = get().wishlistItems.find((i) => i.id === lineId);
    if (!item) return;
    await get().addToCart(
      {
        id: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        mrp: item.mrp,
        href: item.href,
        collection: item.collection,
      },
      1,
    );
  },

  addAllWishlistToCart: async () => {
    for (const item of get().wishlistItems) {
      await get().addWishlistItemToCart(item.id);
    }
  },

  isInCart: (productId) => Boolean(findByProductId(get().cartItems, productId)),
  isInWishlist: (productId) => Boolean(findByProductId(get().wishlistItems, productId)),
  cartItemCount: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),

  clearCart: async () => {
    const data = await clearStorefrontCart();
    set({ cartItems: normalizeCartItems(data.items) });
  },
}));
