"use client";

import Link from "next/link";
import { Minus, Percent, Plus, Trash2, Truck } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import {
  formatPrice,
  lineItemSavings,
  type CartLineItem,
} from "@/lib/constants/cart-data";

type CartLineItemRowProps = {
  item: CartLineItem;
  mode: "cart" | "wishlist";
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onAddToCart?: (id: string) => void;
};

export function CartLineItemRow({
  item,
  mode,
  onQuantityChange,
  onRemove,
  onAddToCart,
}: CartLineItemRowProps) {
  const savings = lineItemSavings(item);

  return (
    <article className="cart-line-item">
      <Link href={item.href} className="cart-line-item__thumb">
        <MediaImage
          src={item.image}
          alt={item.name}
          fill
          fit="cover"
          resolveUrl={false}
          imgClassName="cart-line-item__thumb-img"
        />
      </Link>

      <div className="cart-line-item__body">
        <Link href={item.href} className="cart-line-item__name">
          {item.name}
        </Link>

        {item.collectionLogo && (
          <div className="cart-line-item__brand">
            <MediaImage
              src={item.collectionLogo}
              alt={item.collection ?? "Brand"}
              height={18}
              width={72}
              fit="contain"
              placeholderSize="xs"
              resolveUrl={false}
            />
          </div>
        )}

        {mode === "cart" ? (
          <div className="cart-line-item__qty">
            <button
              type="button"
              className="cart-line-item__qty-btn"
              aria-label="Decrease quantity"
              onClick={() =>
                onQuantityChange?.(item.id, Math.max(1, item.quantity - 1))
              }
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
            <span className="cart-line-item__qty-value">{item.quantity}</span>
            <button
              type="button"
              className="cart-line-item__qty-btn"
              aria-label="Increase quantity"
              onClick={() => onQuantityChange?.(item.id, item.quantity + 1)}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="cart-line-item__add-cart"
            onClick={() => onAddToCart?.(item.id)}
          >
            ADD TO CART
          </button>
        )}

        <div className="cart-line-item__price-row">
          <span className="cart-line-item__price">
            {formatPrice(item.price * item.quantity)}
          </span>
          <span className="cart-line-item__mrp">
            {formatPrice(item.mrp * item.quantity)}
          </span>
        </div>

        {savings > 0 && (
          <p className="cart-line-item__save">
            <Percent className="cart-line-item__save-icon" strokeWidth={2} />
            You Save {formatPrice(savings)}
          </p>
        )}

        <button
          type="button"
          className="cart-line-item__remove"
          onClick={() => onRemove?.(item.id)}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          Remove
        </button>

        {item.deliveryNote && (
          <p
            className={`cart-line-item__delivery${item.deliveryNote.type === "unavailable" ? " cart-line-item__delivery--warn" : ""}`}
          >
            <Truck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            {item.deliveryNote.text}
          </p>
        )}
      </div>
    </article>
  );
}
