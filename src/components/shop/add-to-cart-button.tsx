"use client";

import toast from "react-hot-toast";
import { useRequireCustomerLogin } from "@/lib/auth/require-customer-login";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";
import { useCartStore } from "@/lib/store/cart-store";

type AddToCartButtonProps = {
  product: ProductItem | ProductDetail;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

function isProductDetail(p: ProductItem | ProductDetail): p is ProductDetail {
  return "images" in p && Array.isArray(p.images);
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  children = "Add to Cart",
  disabled = false,
}: AddToCartButtonProps) {
  const requireLogin = useRequireCustomerLogin();
  const addToCart = useCartStore((s) => s.addToCart);
  const addDetailToCart = useCartStore((s) => s.addDetailToCart);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin()) return;

    try {
      if (isProductDetail(product)) {
        await addDetailToCart(product, quantity);
      } else {
        await addToCart(product, quantity);
      }
      toast.success("Added to cart");
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
