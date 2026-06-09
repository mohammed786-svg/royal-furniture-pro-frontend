"use client";

import Link from "next/link";
import {
  cartOrderTotal,
  cartSubtotal,
  cartTax,
  formatPrice,
  type CartLineItem,
} from "@/lib/constants/cart-data";

type CheckoutOrderSummaryProps = {
  items: CartLineItem[];
  proceedHref?: string;
  proceedLabel?: string;
  onProceed?: () => void;
  proceedDisabled?: boolean;
};

export function CheckoutOrderSummary({
  items,
  proceedHref,
  proceedLabel = "Proceed to Address",
  onProceed,
  proceedDisabled,
}: CheckoutOrderSummaryProps) {
  const subtotal = cartSubtotal(items);
  const tax = cartTax(subtotal);
  const total = cartOrderTotal(items);

  const proceedBtn = proceedHref ? (
    <Link
      href={proceedHref}
      className={`order-summary__checkout-btn${proceedDisabled ? " order-summary__checkout-btn--disabled" : ""}`}
      aria-disabled={proceedDisabled}
      onClick={(e) => proceedDisabled && e.preventDefault()}
    >
      {proceedLabel}
    </Link>
  ) : (
    <button
      type="button"
      className="order-summary__checkout-btn"
      onClick={onProceed}
      disabled={proceedDisabled}
    >
      {proceedLabel}
    </button>
  );

  return (
    <aside className="order-summary">
      <h2 className="order-summary__title">Order Summary</h2>
      <p className="order-summary__item-count">{items.length} item(s)</p>

      <dl className="order-summary__rows">
        <div className="order-summary__row">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="order-summary__row">
          <dt>Shipping</dt>
          <dd>{formatPrice(0)}</dd>
        </div>
        <div className="order-summary__row">
          <dt>Tax</dt>
          <dd>{formatPrice(tax)}</dd>
        </div>
      </dl>

      <div className="order-summary__total">
        <span>Order Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>

      {(proceedHref || onProceed) && (
        <div className="order-summary__checkout-wrap">{proceedBtn}</div>
      )}

      <Link href="/" className="order-summary__pay order-summary__pay--shop">
        Continue Shopping
      </Link>
    </aside>
  );
}
