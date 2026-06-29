"use client";

import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useRequireCustomerCommerce } from "@/lib/auth/require-customer-login";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";
import { useCartStore } from "@/lib/store/cart-store";

type ProductWishlistButtonProps = {
  product: ProductItem | ProductDetail;
  className?: string;
  iconClassName?: string;
  filledClassName?: string;
};

function isProductDetail(p: ProductItem | ProductDetail): p is ProductDetail {
  return "images" in p && Array.isArray(p.images);
}

export function ProductWishlistButton({
  product,
  className = "",
  iconClassName = "h-4 w-4 stroke-[#a67c00] stroke-[1.75]",
  filledClassName = "fill-[#c5a059]",
}: ProductWishlistButtonProps) {
  const requireCommerce = useRequireCustomerCommerce();
  const isInWishlist = useCartStore((s) => s.isInWishlist(product.id));
  const addToWishlist = useCartStore((s) => s.addToWishlist);
  const addDetailToWishlist = useCartStore((s) => s.addDetailToWishlist);
  const removeFromWishlist = useCartStore((s) => s.removeFromWishlist);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInWishlist && !requireCommerce()) return;

    if (isInWishlist) {
      const lineId = `wl-${product.id}`;
      removeFromWishlist(lineId);
      toast.success("Removed from wishlist");
      return;
    }

    try {
      if (isProductDetail(product)) {
        await addDetailToWishlist(product);
      } else {
        await addToWishlist(product);
      }
      toast.success("Added to wishlist");
    } catch {
      toast.error("Could not add to wishlist");
    }
  };

  return (
    <button
      type="button"
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isInWishlist}
      className={className}
      onClick={handleClick}
    >
      <Heart
        className={`${iconClassName}${isInWishlist ? ` ${filledClassName}` : " fill-none"}`}
      />
    </button>
  );
}
