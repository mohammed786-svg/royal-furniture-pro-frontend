"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";
import { useCartStore } from "@/lib/store/cart-store";

type BuyNowButtonProps = {
  product: ProductItem | ProductDetail;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
};

function isProductDetail(p: ProductItem | ProductDetail): p is ProductDetail {
  return "images" in p && Array.isArray(p.images);
}

export function BuyNowButton({
  product,
  quantity = 1,
  className,
  children = "BUY NOW",
}: BuyNowButtonProps) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const addDetailToCart = useCartStore((s) => s.addDetailToCart);

  const handleClick = () => {
    if (isProductDetail(product)) {
      addDetailToCart(product, quantity);
    } else {
      addToCart(product, quantity);
    }
    toast.success("Added to cart");
    router.push("/cart");
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
