"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { productItemToLineItem } from "@/lib/cart/line-item";
import {
  initialCartItems,
  initialWishlistItems,
  type CartLineItem,
} from "@/lib/constants/cart-data";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";

type CartStore = {
  cartItems: CartLineItem[];
  wishlistItems: CartLineItem[];
  addToCart: (product: ProductItem, quantity?: number) => void;
  addDetailToCart: (product: ProductDetail, quantity?: number) => void;
  updateCartQuantity: (lineId: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  addToWishlist: (product: ProductItem) => void;
  addDetailToWishlist: (product: ProductDetail) => void;
  removeFromWishlist: (lineId: string) => void;
  addWishlistItemToCart: (lineId: string) => void;
  addAllWishlistToCart: () => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  cartItemCount: () => number;
  clearCart: () => void;
};

function findByProductId(items: CartLineItem[], productId: string) {
  return items.find((item) => item.productId === productId);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: initialCartItems,
      wishlistItems: initialWishlistItems,

      addToCart: (product, quantity = 1) => {
        const existing = findByProductId(get().cartItems, product.id);
        if (existing) {
          set({
            cartItems: get().cartItems.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
          return;
        }
        set({
          cartItems: [
            ...get().cartItems,
            productItemToLineItem(product, "cart", quantity),
          ],
        });
      },

      addDetailToCart: (product, quantity = 1) => {
        get().addToCart(
          {
            id: product.id,
            name: product.name,
            image: product.images[0] ?? "",
            price: product.price,
            mrp: product.mrp,
            badge: product.badge,
            discount: product.discount,
            collection: product.category,
          },
          quantity,
        );
      },

      updateCartQuantity: (lineId, quantity) => {
        const qty = Math.max(1, quantity);
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === lineId ? { ...item, quantity: qty } : item,
          ),
        });
      },

      removeFromCart: (lineId) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== lineId),
        });
      },

      addToWishlist: (product) => {
        if (findByProductId(get().wishlistItems, product.id)) return;
        set({
          wishlistItems: [
            ...get().wishlistItems,
            productItemToLineItem(product, "wl", 1),
          ],
        });
      },

      addDetailToWishlist: (product) => {
        get().addToWishlist({
          id: product.id,
          name: product.name,
          image: product.images[0] ?? "",
          price: product.price,
          mrp: product.mrp,
          badge: product.badge,
          discount: product.discount,
          collection: product.category,
        });
      },

      removeFromWishlist: (lineId) => {
        set({
          wishlistItems: get().wishlistItems.filter((item) => item.id !== lineId),
        });
      },

      addWishlistItemToCart: (lineId) => {
        const item = get().wishlistItems.find((i) => i.id === lineId);
        if (!item) return;
        get().addToCart(
          {
            id: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            mrp: item.mrp,
            collection: item.collection,
          },
          1,
        );
      },

      addAllWishlistToCart: () => {
        for (const item of get().wishlistItems) {
          get().addToCart(
            {
              id: item.productId,
              name: item.name,
              image: item.image,
              price: item.price,
              mrp: item.mrp,
              collection: item.collection,
            },
            1,
          );
        }
      },

      isInCart: (productId) => Boolean(findByProductId(get().cartItems, productId)),

      isInWishlist: (productId) =>
        Boolean(findByProductId(get().wishlistItems, productId)),

      cartItemCount: () =>
        get().cartItems.reduce((sum, item) => sum + item.quantity, 0),

      clearCart: () => set({ cartItems: [] }),
    }),
    { name: "royal-cart-store" },
  ),
);
