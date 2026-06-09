"use client";

import toast from "react-hot-toast";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";
import { useCartStore } from "@/lib/store/cart-store";

type AddToCartButtonProps = {
  product: ProductItem | ProductDetail;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
};

function isProductDetail(p: ProductItem | ProductDetail): p is ProductDetail {
  return "images" in p && Array.isArray(p.images);
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  children = "Add to Cart",
}: AddToCartButtonProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const addDetailToCart = useCartStore((s) => s.addDetailToCart);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProductDetail(product)) {
      addDetailToCart(product, quantity);
    } else {
      addToCart(product, quantity);
    }
    toast.success("Added to cart");
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
