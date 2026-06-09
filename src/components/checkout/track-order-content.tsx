"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PackageSearch, Search, Truck } from "lucide-react";
import { formatPrice } from "@/lib/constants/cart-data";
import {
  ORDER_STATUS_STEPS,
  orderStatusIndex,
  useOrderStore,
} from "@/lib/store/order-store";
import {
  formatIndianMobileDisplay,
  normalizeIndianMobile,
} from "@/lib/validators/indian-mobile";

export function TrackOrderContent() {
  const searchParams = useSearchParams();
  const getOrder = useOrderStore((s) => s.getOrder);
  const findOrdersByMobile = useOrderStore((s) => s.findOrdersByMobile);
  const orders = useOrderStore((s) => s.orders);

  const [orderIdInput, setOrderIdInput] = useState(searchParams.get("orderId") ?? "");
  const [mobileInput, setMobileInput] = useState("");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    searchParams.get("orderId"),
  );

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderIdInput(id);
      setActiveOrderId(id);
    }
  }, [searchParams]);

  const activeOrder = activeOrderId ? getOrder(activeOrderId) : undefined;
  const mobileResults = mobileInput.trim()
    ? findOrdersByMobile(normalizeIndianMobile(mobileInput))
    : [];

  const handleSearchId = (e: React.FormEvent) => {
    e.preventDefault();
    const id = orderIdInput.trim().toUpperCase();
    if (getOrder(id)) {
      setActiveOrderId(id);
    } else {
      setActiveOrderId(null);
    }
  };

  const handleSearchMobile = (e: React.FormEvent) => {
    e.preventDefault();
    const list = findOrdersByMobile(normalizeIndianMobile(mobileInput));
    if (list[0]) setActiveOrderId(list[0].id);
    else setActiveOrderId(null);
  };

  const statusIdx = activeOrder ? orderStatusIndex(activeOrder.status) : -1;

  return (
    <main className="track-order-page">
      <div className="track-order-page__hero">
        <div className="track-order-page__hero-inner royal-section-inner">
          <PackageSearch className="track-order-page__hero-icon" strokeWidth={1.25} />
          <h1 className="track-order-page__title">Track your order</h1>
          <p className="track-order-page__subtitle">
            Enter your order ID or registered mobile to see live status
          </p>
        </div>
      </div>

      <div className="track-order-page__body royal-section-inner">
        <div className="track-order-search-grid">
          <form className="track-search-card" onSubmit={handleSearchId}>
            <label htmlFor="track-order-id">Order ID</label>
            <div className="track-search-card__row">
              <input
                id="track-order-id"
                type="text"
                placeholder="RF-20260603-1234"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
              <button type="submit">
                <Search className="h-4 w-4" />
                Track
              </button>
            </div>
          </form>

          <form className="track-search-card" onSubmit={handleSearchMobile}>
            <label htmlFor="track-mobile">Mobile number</label>
            <div className="track-search-card__row">
              <input
                id="track-mobile"
                type="tel"
                inputMode="numeric"
                placeholder="82965 65587"
                value={mobileInput}
                onChange={(e) =>
                  setMobileInput(
                    formatIndianMobileDisplay(normalizeIndianMobile(e.target.value)),
                  )
                }
              />
              <button type="submit">
                <Search className="h-4 w-4" />
                Find
              </button>
            </div>
          </form>
        </div>

        {mobileResults.length > 1 && !activeOrder && (
          <ul className="track-order-pick-list">
            {mobileResults.map((o) => (
              <li key={o.id}>
                <button type="button" onClick={() => setActiveOrderId(o.id)}>
                  {o.id} — {formatPrice(o.total)}
                </button>
              </li>
            ))}
          </ul>
        )}

        {activeOrder ? (
          <div className="track-order-result">
            <header className="track-order-result__head">
              <div>
                <p className="track-order-result__id">{activeOrder.id}</p>
                <p className="track-order-result__date">
                  Placed{" "}
                  {new Date(activeOrder.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="track-order-result__total">
                <span>Total</span>
                <strong>{formatPrice(activeOrder.total)}</strong>
              </div>
            </header>

            <div className="track-timeline">
              {ORDER_STATUS_STEPS.map((step, index) => {
                const done = index <= statusIdx;
                const current = index === statusIdx;
                return (
                  <div
                    key={step.status}
                    className={`track-timeline__step${done ? " track-timeline__step--done" : ""}${current ? " track-timeline__step--current" : ""}`}
                  >
                    <div className="track-timeline__dot">
                      {done ? <Truck className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="track-timeline__content">
                      <p className="track-timeline__label">{step.label}</p>
                      <p className="track-timeline__desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <ul className="track-order-items">
              {activeOrder.items.map((item) => (
                <li key={item.id} className="track-order-item">
                  <Image
                    src={item.image}
                    alt=""
                    width={72}
                    height={72}
                    className="track-order-item__img"
                  />
                  <div>
                    <p className="track-order-item__name">{item.name}</p>
                    <p className="track-order-item__meta">
                      Qty {item.quantity} · {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : activeOrderId ? (
          <p className="track-order-empty">
            No order found for that ID. Check and try again.
          </p>
        ) : orders.length === 0 ? (
          <p className="track-order-empty">
            No orders yet. Complete a purchase to track it here.
          </p>
        ) : null}

        {!activeOrder && orders.length > 0 && !activeOrderId && (
          <div className="track-recent">
            <h2>Recent orders</h2>
            <ul>
              {orders.slice(0, 5).map((o) => (
                <li key={o.id}>
                  <button type="button" onClick={() => setActiveOrderId(o.id)}>
                    <span>{o.id}</span>
                    <span>{formatPrice(o.total)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
