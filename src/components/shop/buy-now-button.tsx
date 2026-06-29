"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { useRequireCustomerCommerce } from "@/lib/auth/require-customer-login";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";
import { useCartStore } from "@/lib/store/cart-store";

type BuyNowButtonProps = {
  product: ProductItem | ProductDetail;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

function isProductDetail(p: ProductItem | ProductDetail): p is ProductDetail {
  return "images" in p && Array.isArray(p.images);
}

export function BuyNowButton({
  product,
  quantity = 1,
  className,
  children = "BUY NOW",
  disabled = false,
}: BuyNowButtonProps) {
  const router = useRouter();
  const requireCommerce = useRequireCustomerCommerce();
  const addToCart = useCartStore((s) => s.addToCart);
  const addDetailToCart = useCartStore((s) => s.addDetailToCart);

  const handleClick = async () => {
    if (!requireCommerce()) return;

    try {
      if (isProductDetail(product)) {
        await addDetailToCart(product, quantity);
      } else {
        await addToCart(product, quantity);
      }
      router.push("/checkout/address");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not proceed to checkout"));
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
