"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Package, Truck } from "lucide-react";
import { AccountShell } from "@/components/account/account-shell";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { formatPrice } from "@/lib/constants/cart-data";
import { useAddressStore } from "@/lib/store/address-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { fetchStorefrontOrders } from "@/services/storefront-commerce";
import type { StorefrontOrderSummary } from "@/types/storefront-commerce";

export function AccountDashboardContent() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const addresses = useAddressStore((s) => s.addresses);
  const wishlistCount = useCartStore((s) => s.wishlistItems.length);
  const cartCount = useCartStore((s) => s.cartItemCount());

  const [orders, setOrders] = useState<StorefrontOrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    if (!accessToken) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    let active = true;
    (async () => {
      setLoadingOrders(true);
      try {
        const data = await fetchStorefrontOrders({ pageSize: 10 });
        if (active) setOrders(data.items);
      } catch (error) {
        if (active) {
          console.error(getApiErrorMessage(error, "Could not load orders"));
        }
      } finally {
        if (active) setLoadingOrders(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isHydrated, accessToken]);

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
          <span className="account-stat-card__value">
            {loadingOrders ? "…" : orders.length}
          </span>
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
        {loadingOrders ? (
          <p className="account-empty">Loading orders…</p>
        ) : recent.length === 0 ? (
          <p className="account-empty">
            No orders yet. Start shopping to see orders here.
          </p>
        ) : (
          <ul className="account-order-list">
            {recent.map((order) => (
              <li key={order.orderId} className="account-order-row">
                <div>
                  <p className="account-order-row__id">{order.orderNumber}</p>
                  <p className="account-order-row__meta">
                    {order.statusName || order.status}
                    {order.createdAt
                      ? ` · ${new Date(order.createdAt).toLocaleDateString("en-IN")}`
                      : ""}
                  </p>
                </div>
                <div className="account-order-row__right">
                  <strong>{formatPrice(order.totalAmount)}</strong>
                  <Link
                    href={`/track-order?orderId=${encodeURIComponent(order.orderNumber)}`}
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
