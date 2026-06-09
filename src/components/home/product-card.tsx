"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductWishlistButton } from "@/components/shop/product-wishlist-button";
import { formatPrice, type ProductItem } from "@/lib/constants/home-data";
import { getProductHref } from "@/lib/constants/product-details";

type ProductCardProps = {
  product: ProductItem;
};

export function ProductCard({ product }: ProductCardProps) {
  const isOnlineExclusive = product.badge === "Online Exclusive";
  const isNewArrival = product.badge === "New Arrival";
  const href = getProductHref(product);

  return (
    <article className="flex h-full flex-col overflow-hidden border border-gray-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="product-card-hover relative aspect-square w-full overflow-hidden bg-white p-2 sm:p-3">
        <Link
          href={href}
          className="product-card-zoom absolute inset-0 block p-1 transition-transform duration-500 ease-out"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain object-center"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            unoptimized
          />
        </Link>

        {product.discount && (
          <span className="absolute top-2 left-2 z-[6] bg-[#f7941d] px-1.5 py-0.5 text-[11px] font-bold text-white sm:text-xs">
            {product.discount}
          </span>
        )}

        <ProductWishlistButton
          product={product}
          className="absolute top-2 right-2 z-[6] flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm"
        />

        {(isNewArrival || isOnlineExclusive || product.badge) && (
          <div className="absolute bottom-2 left-2 z-[6] flex flex-wrap gap-1">
            {isNewArrival && (
              <span className="rounded-sm bg-[#7b2d8e] px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-[11px]">
                New Arrival
              </span>
            )}
            {isOnlineExclusive && (
              <span className="rounded-sm bg-[#5cb85c] px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-[11px]">
                Online Exclusive
              </span>
            )}
            {product.badge &&
              product.badge !== "New Arrival" &&
              product.badge !== "Online Exclusive" && (
                <span className="rounded-sm bg-[#1a2744] px-1.5 py-0.5 text-[10px] font-bold text-white uppercase sm:text-[11px]">
                  {product.badge}
                </span>
              )}
          </div>
        )}

        <div className="product-card-cart-layer pointer-events-none absolute inset-0 z-[5] flex items-center justify-center opacity-0 transition-opacity duration-300">
          <AddToCartButton
            product={product}
            className="product-card-cart-btn pointer-events-auto translate-y-3 bg-[#e53935] px-8 py-2.5 text-sm font-bold tracking-wide text-white uppercase shadow-md transition-all duration-300 hover:bg-[#d32f2f]"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-3 pt-2 sm:px-3">
        <Link href={href} className="mb-1 block">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#222] hover:text-[#1a2744] sm:text-[15px]">
            {product.name}
          </h3>
        </Link>
        {product.collection && (
          <p className="mb-1 text-xs text-gray-500 sm:text-sm">{product.collection}</p>
        )}
        {product.rating && (
          <p className="mb-1 text-xs font-medium text-green-700 sm:text-sm">
            {product.rating}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="text-lg font-bold text-[#111] sm:text-xl">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-[#999] line-through sm:text-base">
            {formatPrice(product.mrp)}
          </span>
        </div>
      </div>
    </article>
  );
}
