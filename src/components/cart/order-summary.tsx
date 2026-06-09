"use client";

import { useState } from "react";
import Link from "next/link";
import {
  cartOrderTotal,
  cartSubtotal,
  cartTax,
  formatPrice,
  type CartLineItem,
} from "@/lib/constants/cart-data";

type OrderSummaryProps = {
  items: CartLineItem[];
};

export function OrderSummary({ items }: OrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState("");
  const subtotal = cartSubtotal(items);
  const tax = cartTax(subtotal);
  const total = cartOrderTotal(items);

  return (
    <aside className="order-summary">
      <h2 className="order-summary__title">Order Summary</h2>

      <dl className="order-summary__rows">
        <div className="order-summary__row">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="order-summary__row">
          <dt>Paytm Giftcard</dt>
          <dd>{formatPrice(0)}</dd>
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

      <div className="order-summary__discount">
        <p className="order-summary__discount-title">Apply Discount Code</p>
        <label className="order-summary__discount-label" htmlFor="discount-code">
          Enter discount code
        </label>
        <input
          id="discount-code"
          type="text"
          placeholder="Enter discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="order-summary__discount-input"
        />
        <button type="button" className="order-summary__discount-btn">
          Apply Discount
        </button>
      </div>

      <div className="order-summary__actions">
        <button
          type="button"
          className="order-summary__pay order-summary__pay--primary"
        >
          Card, UPI, No Cost EMI
        </button>
        <button
          type="button"
          className="order-summary__pay order-summary__pay--secondary"
        >
          Net Banking, Wallet, Bajaj EMI
        </button>
        <Link href="/" className="order-summary__pay order-summary__pay--shop">
          Continue Shopping
        </Link>
      </div>
    </aside>
  );
}
