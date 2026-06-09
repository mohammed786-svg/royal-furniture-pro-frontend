"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductWishlistButton } from "@/components/shop/product-wishlist-button";
import { formatPrice, type ProductItem } from "@/lib/constants/home-data";
import { getProductHref } from "@/lib/constants/product-details";

type ExclusiveProductCardProps = {
  product: ProductItem;
};

export function ExclusiveProductCard({ product }: ExclusiveProductCardProps) {
  const isNewArrival = product.badge === "New Arrival";
  const href = getProductHref(product);

  return (
    <article className="flex h-full w-full flex-col bg-white">
      <div className="product-card-hover relative aspect-[268/350] w-full overflow-hidden bg-[#f4f4f4]">
        <Link
          href={href}
          className="product-card-zoom absolute inset-0 block transition-transform duration-500 ease-out"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 45vw, 320px"
            unoptimized
          />
        </Link>

        {product.discount && (
          <span className="absolute top-0 left-0 z-[6] bg-[#f68b1f] px-2 py-1 text-xs font-bold leading-none text-white">
            {product.discount}
          </span>
        )}

        <ProductWishlistButton
          product={product}
          className="absolute top-2 right-2 z-[6] p-0.5"
          iconClassName="h-[18px] w-[18px] stroke-[#6b5a3e] stroke-[1.5]"
        />

        <div className="absolute bottom-2 left-2 z-[6] flex flex-wrap gap-1">
          {isNewArrival && (
            <span className="rounded-[3px] bg-[#7e2d96] px-1.5 py-[3px] text-[11px] font-bold leading-none text-white">
              New Arrival
            </span>
          )}
          <span className="rounded-[3px] bg-[#5cb85c] px-1.5 py-[3px] text-[11px] font-bold leading-none text-white">
            Online Exclusive
          </span>
        </div>

        <div className="product-card-cart-layer pointer-events-none absolute inset-0 z-[5] flex items-center justify-center opacity-0 transition-opacity duration-300">
          <AddToCartButton
            product={product}
            className="product-card-cart-btn pointer-events-auto translate-y-3 bg-[#e53935] px-8 py-2.5 text-sm font-bold tracking-wide text-white uppercase shadow-md transition-all duration-300 hover:bg-[#d32f2f]"
          />
        </div>
      </div>

      <div className="flex flex-col px-0 pt-2.5 pb-1">
        <Link href={href} className="mb-1.5 block">
          <h3 className="truncate text-[13px] font-normal leading-snug text-[#222] hover:text-[#1a2744]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold leading-none text-[#111] sm:text-lg">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm leading-none text-[#a0a0a0] line-through">
            {formatPrice(product.mrp)}
          </span>
        </div>
      </div>
    </article>
  );
}
