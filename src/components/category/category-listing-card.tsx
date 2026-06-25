"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductWishlistButton } from "@/components/shop/product-wishlist-button";
import { MediaImage } from "@/components/ui/media-image";
import type { ProductItem } from "@/lib/constants/home-data";
import { getProductHref } from "@/lib/constants/product-details";

type CategoryListingCardProps = {
  product: ProductItem;
};

export function CategoryListingCard({ product }: CategoryListingCardProps) {
  const isOnlineExclusive = product.badge === "Online Exclusive";
  const isNewArrival = product.badge === "New Arrival";

  const href =
    product.href && product.href !== "#" ? product.href : getProductHref(product);

  return (
    <article className="category-listing-card">
      <div className="category-listing-card__media">
        <Link href={href} className="category-listing-card__image-link">
          <MediaImage
            src={product.image}
            alt={product.name}
            fill
            className="category-listing-card__image"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        </Link>

        {product.discount && (
          <span className="category-listing-card__discount">{product.discount}</span>
        )}

        <ProductWishlistButton
          product={product}
          className="category-listing-card__wishlist"
        />

        {(isNewArrival || isOnlineExclusive) && (
          <div className="category-listing-card__badges">
            {isNewArrival && (
              <span className="category-listing-card__badge category-listing-card__badge--new">
                New Arrival
              </span>
            )}
            {isOnlineExclusive && (
              <span className="category-listing-card__badge category-listing-card__badge--exclusive">
                Online Exclusive
              </span>
            )}
          </div>
        )}
      </div>

      <Link href={href} className="category-listing-card__title">
        {product.name}
      </Link>

      <AddToCartButton product={product} className="category-listing-card__add-cart" />
    </article>
  );
}
