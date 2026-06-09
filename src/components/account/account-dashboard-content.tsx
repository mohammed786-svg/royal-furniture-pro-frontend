"use client";

import Link from "next/link";
import { Heart, MapPin, Package, Truck } from "lucide-react";
import { AccountShell } from "@/components/account/account-shell";
import { formatPrice } from "@/lib/constants/cart-data";
import { useAddressStore } from "@/lib/store/address-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useOrderStore } from "@/lib/store/order-store";

export function AccountDashboardContent() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const addresses = useAddressStore((s) => s.addresses);
  const wishlistCount = useCartStore((s) => s.wishlistItems.length);
  const cartCount = useCartStore((s) => s.cartItemCount());

  const recent = orders.slice(0, 3);

  return (
    <AccountShell title="Dashboard">
      <p className="account-lead">
        Welcome back, <strong>{user?.name}</strong>. Manage orders, addresses, and your
        furniture shopping in one place.
      </p>

      <div className="account-stats">
        <Link href="/account/orders" className="account-stat-card">
          <Package className="account-stat-card__icon" />
          <span className="account-stat-card__value">{orders.length}</span>
          <span className="account-stat-card__label">Orders</span>
        </Link>
        <Link href="/account/addresses" className="account-stat-card">
          <MapPin className="account-stat-card__icon" />
          <span className="account-stat-card__value">{addresses.length}</span>
          <span className="account-stat-card__label">Addresses</span>
        </Link>
        <Link href="/wishlist" className="account-stat-card">
          <Heart className="account-stat-card__icon" />
          <span className="account-stat-card__value">{wishlistCount}</span>
          <span className="account-stat-card__label">Wishlist</span>
        </Link>
        <Link href="/cart" className="account-stat-card">
          <span className="account-stat-card__value">{cartCount}</span>
          <span className="account-stat-card__label">Cart items</span>
        </Link>
      </div>

      <div className="account-quick-actions">
        <Link href="/track-order" className="account-quick-btn">
          <Truck className="h-4 w-4" />
          Track an order
        </Link>
        <Link href="/" className="account-quick-btn account-quick-btn--outline">
          Continue shopping
        </Link>
      </div>

      <section className="account-section">
        <div className="account-section__head">
          <h2>Recent orders</h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="account-link">
              View all
            </Link>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="account-empty">
            No orders yet. Start shopping to see orders here.
          </p>
        ) : (
          <ul className="account-order-list">
            {recent.map((order) => (
              <li key={order.id} className="account-order-row">
                <div>
                  <p className="account-order-row__id">{order.id}</p>
                  <p className="account-order-row__meta">
                    {order.items.length} item(s) ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="account-order-row__right">
                  <strong>{formatPrice(order.total)}</strong>
                  <Link
                    href={`/track-order?orderId=${encodeURIComponent(order.id)}`}
                    className="account-link"
                  >
                    Track
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AccountShell>
  );
}
