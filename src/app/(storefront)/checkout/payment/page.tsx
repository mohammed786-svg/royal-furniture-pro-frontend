import type { Metadata } from "next";
import { PaymentPageContent } from "@/components/checkout/payment-page-content";

export const metadata: Metadata = {
  title: "Payment | Royal Furniture Pro",
  description: "Complete payment via UPI, bank transfer, or Google Pay",
};

export default function CheckoutPaymentPage() {
  return <PaymentPageContent />;
}
