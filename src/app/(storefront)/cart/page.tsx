import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "My Cart | Royal Furniture Pro",
  description: "Review items in your shopping cart",
};

export default function CartPage() {
  return <CartPageContent />;
}
