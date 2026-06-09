import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderSuccessContent } from "@/components/checkout/order-success-content";

export const metadata: Metadata = {
  title: "Order Confirmed | Royal Furniture Pro",
  description: "Your order has been placed successfully",
};

function SuccessFallback() {
  return (
    <main className="order-success-page">
      <div className="order-success-page__inner royal-section-inner">
        <p className="order-success-card__subtitle">Loading…</p>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
