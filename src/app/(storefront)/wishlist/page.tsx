import type { Metadata } from "next";
import { WishlistPageContent } from "@/components/cart/wishlist-page-content";

export const metadata: Metadata = {
  title: "My Wishlist | Royal Furniture Pro",
  description: "Your saved wishlist items",
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}
