"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { CartLineItemRow } from "@/components/cart/cart-line-item";
import { CheckoutStepper } from "@/components/cart/checkout-stepper";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { useCartStore } from "@/lib/store/cart-store";

export function CartPageContent() {
  const cartItems = useCartStore((s) => s.cartItems);
  const updateCartQuantity = useCartStore((s) => s.updateCartQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const handleQuantityChange = async (id: string, quantity: number) => {
    try {
      await updateCartQuantity(id, quantity);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update quantity"));
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart(id);
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not remove item"));
    }
  };

  return (
    <main className="cart-page">
      <div className="cart-page__inner royal-section-inner">
        <CategoryBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "My Cart", href: "/cart" },
          ]}
        />

        <CheckoutStepper activeStep={1} />

        <div className="cart-page__layout">
          <section className="cart-page__main">
            <h1 className="cart-page__title">My Cart ({cartItems.length})</h1>
            <div className="cart-page__list">
              {cartItems.length === 0 ? (
                <p className="cart-page__empty">
                  Your cart is empty.{" "}
                  <Link href="/" className="cart-page__empty-link">
                    Continue shopping
                  </Link>
                </p>
              ) : (
                cartItems.map((item) => (
                  <CartLineItemRow
                    key={item.id}
                    item={item}
                    mode="cart"
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))
              )}
            </div>
          </section>

          {cartItems.length > 0 && (
            <CheckoutOrderSummary
              items={cartItems}
              proceedHref="/checkout/address"
              proceedLabel="Proceed to address"
            />
          )}
        </div>
      </div>
    </main>
  );
}
