"use client";

import Link from "next/link";
import { CartLineItemRow } from "@/components/cart/cart-line-item";
import { CheckoutStepper } from "@/components/cart/checkout-stepper";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { useCartStore } from "@/lib/store/cart-store";

export function CartPageContent() {
  const cartItems = useCartStore((s) => s.cartItems);
  const updateCartQuantity = useCartStore((s) => s.updateCartQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

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
                    onQuantityChange={updateCartQuantity}
                    onRemove={removeFromCart}
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
