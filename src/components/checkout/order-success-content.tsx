"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderId");

  return (
    <main className="order-success-page">
      <div className="order-success-page__inner royal-section-inner">
        <div className="order-success-card">
          <div className="order-success-card__icon-wrap">
            <CheckCircle2 className="order-success-card__icon" strokeWidth={1.5} />
          </div>
          <h1 className="order-success-card__title">Order booked successfully!</h1>
          <p className="order-success-card__subtitle">
            Thank you for shopping with Royal Furniture Pro. We have received your
            payment details and will verify shortly. Your order is being prepared for
            Shiprocket dispatch.
          </p>

          {orderNumber && (
            <p className="order-success-card__ref">
              Order ID: <strong>{orderNumber}</strong>
            </p>
          )}

          <div className="order-success-card__actions">
            <Link
              href="/"
              className="order-success-card__btn order-success-card__btn--primary"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
            <Link
              href={
                orderNumber
                  ? `/track-order?orderId=${encodeURIComponent(orderNumber)}`
                  : "/track-order"
              }
              className="order-success-card__btn order-success-card__btn--outline"
            >
              <Package className="h-4 w-4" />
              Track order
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
