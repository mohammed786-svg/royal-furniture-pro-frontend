"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { CartLineItemRow } from "@/components/cart/cart-line-item";
import { WishlistSummary } from "@/components/cart/wishlist-summary";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";

export function WishlistPageContent() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const wishlistItems = useCartStore((s) => s.wishlistItems);
  const removeFromWishlist = useCartStore((s) => s.removeFromWishlist);
  const addWishlistItemToCart = useCartStore((s) => s.addWishlistItemToCart);
  const addAllWishlistToCart = useCartStore((s) => s.addAllWishlistToCart);

  const handleRemove = async (id: string) => {
    try {
      await removeFromWishlist(id);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not remove item"));
    }
  };

  const handleAddToCart = async (id: string) => {
    try {
      await addWishlistItemToCart(id);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not add to cart"));
    }
  };

  const handleAddAll = async () => {
    if (wishlistItems.length === 0) return;
    try {
      await addAllWishlistToCart();
      toast.success(`${wishlistItems.length} item(s) added to cart`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not add items to cart"));
    }
  };

  if (!accessToken) {
    return (
      <main className="cart-page cart-page--wishlist">
        <div className="cart-page__inner royal-section-inner">
          <p className="cart-page__empty">
            Please{" "}
            <Link href="/login" className="cart-page__empty-link">
              sign in
            </Link>{" "}
            to view your wishlist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page cart-page--wishlist">
      <div className="cart-page__inner royal-section-inner">
        <CategoryBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "My Wishlist", href: "/wishlist" },
          ]}
        />

        <div className="cart-page__layout">
          <section className="cart-page__main">
            <h1 className="cart-page__title">My Wishlist ({wishlistItems.length})</h1>
            <div className="cart-page__list">
              {wishlistItems.length === 0 ? (
                <p className="cart-page__empty">
                  Your wishlist is empty.{" "}
                  <Link href="/" className="cart-page__empty-link">
                    Browse products
                  </Link>
                </p>
              ) : (
                wishlistItems.map((item) => (
                  <CartLineItemRow
                    key={item.id}
                    item={item}
                    mode="wishlist"
                    onRemove={handleRemove}
                    onAddToCart={handleAddToCart}
                  />
                ))
              )}
            </div>
          </section>

          <WishlistSummary items={wishlistItems} onAddAllToCart={handleAddAll} />
        </div>
      </div>
    </main>
  );
}
