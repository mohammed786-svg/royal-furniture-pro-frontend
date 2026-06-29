"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { formatPrice } from "@/lib/constants/cart-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchStorefrontOrders } from "@/services/storefront-commerce";
import type { StorefrontOrderSummary } from "@/types/storefront-commerce";

export function AccountOrdersContent() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [orders, setOrders] = useState<StorefrontOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    if (!accessToken) {
      setLoading(false);
      setOrders([]);
      return;
    }

    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchStorefrontOrders();
        if (active) setOrders(data.items);
      } catch (error) {
        if (active)
          royalToast.error(getApiErrorMessage(error, "Could not load orders"));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isHydrated, accessToken]);

  return (
    <AccountShell
      title="My Orders"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "My Orders" },
      ]}
    >
      {loading ? (
        <p className="account-empty">Loading orders…</p>
      ) : !accessToken ? (
        <p className="account-empty">
          Please{" "}
          <Link href="/login" className="account-link">
            sign in
          </Link>{" "}
          to view your orders.
        </p>
      ) : orders.length === 0 ? (
        <p className="account-empty">
          You have no orders yet.{" "}
          <Link href="/" className="account-link">
            Browse furniture
          </Link>
        </p>
      ) : (
        <ul className="account-orders-full">
          {orders.map((order) => (
            <li key={order.orderId} className="account-order-card">
              <header className="account-order-card__head">
                <div>
                  <p className="account-order-card__id">{order.orderNumber}</p>
                  <p className="account-order-card__date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-IN")
                      : "—"}
                  </p>
                  <p className="account-order-card__status">
                    {order.statusName || order.status}
                  </p>
                </div>
                <div className="account-order-card__total">
                  <span>Total</span>
                  <strong>{formatPrice(order.totalAmount)}</strong>
                </div>
              </header>
              <Link
                href={`/track-order?orderId=${encodeURIComponent(order.orderNumber)}`}
                className="account-link"
              >
                Track shipment
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
