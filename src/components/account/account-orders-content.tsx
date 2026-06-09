"use client";

import Image from "next/image";
import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { formatPrice } from "@/lib/constants/cart-data";
import { useOrderStore } from "@/lib/store/order-store";

export function AccountOrdersContent() {
  const orders = useOrderStore((s) => s.orders);

  return (
    <AccountShell
      title="My Orders"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "My Orders" },
      ]}
    >
      {orders.length === 0 ? (
        <p className="account-empty">
          You have no orders yet.{" "}
          <Link href="/" className="account-link">
            Browse furniture
          </Link>
        </p>
      ) : (
        <ul className="account-orders-full">
          {orders.map((order) => (
            <li key={order.id} className="account-order-card">
              <header className="account-order-card__head">
                <div>
                  <p className="account-order-card__id">{order.id}</p>
                  <p className="account-order-card__date">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="account-order-card__total">
                  <span>Total</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
              </header>
              <ul className="account-order-card__items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <Image
                      src={item.image}
                      alt=""
                      width={56}
                      height={56}
                      className="account-order-card__thumb"
                    />
                    <div>
                      <p className="account-order-card__name">{item.name}</p>
                      <p className="account-order-card__qty">Qty {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <footer className="account-order-card__foot">
                <span className="account-order-card__status">Payment verification</span>
                <Link
                  href={`/track-order?orderId=${encodeURIComponent(order.id)}`}
                  className="account-form__submit account-form__submit--inline"
                >
                  Track order
                </Link>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
