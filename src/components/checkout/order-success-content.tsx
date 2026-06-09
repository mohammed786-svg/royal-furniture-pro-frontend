"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/constants/cart-data";
import { useOrderStore } from "@/lib/store/order-store";

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const getOrder = useOrderStore((s) => s.getOrder);
  const order = orderId ? getOrder(orderId) : undefined;

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
            payment details and will verify shortly.
          </p>

          {order && (
            <div className="order-success-card__details">
              <p>
                <span>Order ID</span>
                <strong>{order.id}</strong>
              </p>
              <p>
                <span>Amount</span>
                <strong>{formatPrice(order.total)}</strong>
              </p>
              <p>
                <span>Payment ref.</span>
                <strong>{order.paymentReference}</strong>
              </p>
              <p>
                <span>Items</span>
                <strong>{order.items.length}</strong>
              </p>
            </div>
          )}

          {orderId && !order && (
            <p className="order-success-card__ref">Reference: {orderId}</p>
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
                orderId
                  ? `/track-order?orderId=${encodeURIComponent(orderId)}`
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
