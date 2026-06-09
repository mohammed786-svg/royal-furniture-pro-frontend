import Link from "next/link";
import {
  cartSubtotal,
  formatPrice,
  type CartLineItem,
} from "@/lib/constants/cart-data";

type WishlistSummaryProps = {
  items: CartLineItem[];
  onAddAllToCart?: () => void;
};

export function WishlistSummary({ items, onAddAllToCart }: WishlistSummaryProps) {
  const subtotal = cartSubtotal(items);

  return (
    <aside className="order-summary wishlist-summary">
      <h2 className="order-summary__title">Wishlist Summary</h2>

      <p className="wishlist-summary__text">
        {items.length} item{items.length === 1 ? "" : "s"} saved for later
      </p>

      <div className="order-summary__total wishlist-summary__total">
        <span>Total Value</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>

      <div className="order-summary__actions">
        <button
          type="button"
          className="order-summary__pay order-summary__pay--primary"
          onClick={onAddAllToCart}
          disabled={items.length === 0}
        >
          Add All to Cart
        </button>
        <Link href="/cart" className="order-summary__pay order-summary__pay--secondary">
          View Cart
        </Link>
        <Link href="/" className="order-summary__pay order-summary__pay--shop">
          Continue Shopping
        </Link>
      </div>
    </aside>
  );
}
