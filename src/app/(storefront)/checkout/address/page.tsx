import type { Metadata } from "next";
import { AddressPageContent } from "@/components/checkout/address-page-content";

export const metadata: Metadata = {
  title: "Delivery Address | Royal Furniture Pro",
  description: "Add or select delivery address for checkout",
};

export default function CheckoutAddressPage() {
  return <AddressPageContent />;
}
