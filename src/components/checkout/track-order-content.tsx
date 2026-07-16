"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Download,
  FileText,
  MapPin,
  Package,
  PackageSearch,
  Search,
  Sparkles,
  Truck,
} from "lucide-react";
import { StorefrontInvoiceModal } from "@/components/checkout/storefront-invoice-modal";
import { StorefrontOrderActionsBar } from "@/components/orders/storefront-order-actions-bar";
import { MediaImage } from "@/components/ui/media-image";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { formatPrice } from "@/lib/constants/cart-data";
import { formatApiDateTime } from "@/lib/datetime/format-api-datetime";
import { useAuthStore } from "@/lib/store/auth-store";
import { royalToast } from "@/lib/toast/royal-toast";
import { trackStorefrontOrder } from "@/services/storefront-commerce";
import type {
  StorefrontOrderSummary,
  StorefrontTrackOrderResponse,
} from "@/types/storefront-commerce";

const ORDER_JOURNEY = [
  { id: "placed", label: "Placed", codes: ["PENDING", "PAYMENT_PENDING"] },
  { id: "paid", label: "Paid", codes: ["PAYMENT_VERIFIED"] },
  {
    id: "processing",
    label: "Processing",
    codes: ["CONFIRMED", "PROCESSING", "PACKED"],
  },
  { id: "shipped", label: "Shipped", codes: ["SHIPPED"] },
  { id: "delivered", label: "Delivered", codes: ["DELIVERED"] },
] as const;

const PAID_ORDER_CODES = new Set([
  "PAYMENT_VERIFIED",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
]);

function cleanValue(value?: string | null): string {
  if (!value) return "";
  const text = value.trim();
  if (!text || text.toUpperCase() === "NA") return "";
  return text;
}

function formatTrackDate(value: string): string {
  return formatApiDateTime(value);
}

function resolveStatusCode(status: string): string {
  return status.trim().toUpperCase();
}

function journeyIndex(statusCode: string): number {
  const code = resolveStatusCode(statusCode);
  if (["CANCELLED", "RETURNED", "REFUNDED"].includes(code)) return -1;
  for (let i = ORDER_JOURNEY.length - 1; i >= 0; i -= 1) {
    if ((ORDER_JOURNEY[i].codes as readonly string[]).includes(code)) return i;
  }
  return 0;
}

function statusBadgeClass(status: string): string {
  const code = resolveStatusCode(status);
  if (code.includes("DELIVER")) return "track-status-pill track-status-pill--delivered";
  if (code.includes("SHIP")) return "track-status-pill track-status-pill--shipped";
  if (code.includes("CANCEL")) return "track-status-pill track-status-pill--cancelled";
  if (code.includes("RETURN") || code.includes("REFUND")) {
    return "track-status-pill track-status-pill--cancelled";
  }
  if (code.includes("PAYMENT")) return "track-status-pill track-status-pill--payment";
  if (code.includes("CONFIRM") || code.includes("PROCESS") || code.includes("PACK")) {
    return "track-status-pill track-status-pill--processing";
  }
  return "track-status-pill track-status-pill--pending";
}

function isInvoiceEligible(order: StorefrontOrderSummary): boolean {
  const code = resolveStatusCode(order.status);
  if (code === "DELIVERED") return true;
  return PAID_ORDER_CODES.has(code);
}

export function TrackOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn());
  const accessToken = useAuthStore((s) => s.accessToken);

  const orderIdFromUrl = searchParams.get("orderId") ?? "";
  const [orderIdInput, setOrderIdInput] = useState(orderIdFromUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StorefrontTrackOrderResponse | null>(null);
  const [searched, setSearched] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const autoTrackedRef = useRef(false);

  useEffect(() => {
    if (orderIdFromUrl) setOrderIdInput(orderIdFromUrl);
  }, [orderIdFromUrl]);

  const returnPath = orderIdFromUrl
    ? `/track-order?orderId=${encodeURIComponent(orderIdFromUrl)}`
    : "/track-order";

  const runTrack = useCallback(async (orderNumber: string) => {
    if (!orderNumber.trim()) {
      royalToast.error("Order ID is required");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await trackStorefrontOrder(orderNumber.trim().toUpperCase());
      setResult(data);
    } catch (error) {
      setResult(null);
      royalToast.error(getApiErrorMessage(error, "Order not found"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isLoggedIn || !accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(returnPath)}`);
      return;
    }

    if (orderIdFromUrl && !autoTrackedRef.current) {
      autoTrackedRef.current = true;
      void runTrack(orderIdFromUrl);
    }
  }, [
    isHydrated,
    isLoggedIn,
    accessToken,
    orderIdFromUrl,
    returnPath,
    router,
    runTrack,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void runTrack(orderIdInput);
  };

  const activeStep = useMemo(
    () => (result ? journeyIndex(result.order.status) : 0),
    [result],
  );

  const journeyProgress = useMemo(() => {
    if (activeStep < 0) return 0;
    if (ORDER_JOURNEY.length <= 1) return 100;
    return (activeStep / (ORDER_JOURNEY.length - 1)) * 100;
  }, [activeStep]);

  if (!isHydrated || !isLoggedIn) {
    return (
      <div className="track-order-page track-order-page--fancy">
        <div className="track-order-page__hero track-order-page__hero--fancy">
          <div className="track-order-page__hero-inner royal-section-inner">
            <PackageSearch className="track-order-page__hero-icon" strokeWidth={1.25} />
            <h1 className="track-order-page__title">Track your order</h1>
            <p className="track-order-page__subtitle">
              Sign in to view live shipment updates
            </p>
          </div>
        </div>
      </div>
    );
  }

  const shipment = result?.shipment;
  const trackingEvents = result?.tracking ?? [];
  const orderStatusCode = resolveStatusCode(result?.order.status ?? "");
  const orderStatusLabel =
    result?.order.statusName || result?.order.status || "Processing";
  const deliveryStatus =
    orderStatusCode === "DELIVERED"
      ? orderStatusLabel
      : shipment?.deliveryStatus?.trim() || orderStatusLabel;
  const awb = cleanValue(shipment?.awbNumber ?? shipment?.trackingNumber);
  const courier = cleanValue(shipment?.courierName);
  const edd = cleanValue(shipment?.estimatedDeliveryDate);
  const invoiceAvailable =
    Boolean(result?.invoiceAvailable) ||
    (result ? isInvoiceEligible(result.order) : false);

  return (
    <div className="track-order-page track-order-page--fancy">
      <div className="track-order-page__hero track-order-page__hero--fancy">
        <div className="track-order-page__hero-glow" aria-hidden />
        <div className="track-order-page__hero-inner royal-section-inner">
          <div className="track-order-page__hero-badge">
            <Sparkles className="h-4 w-4" />
            Live tracking
          </div>
          <PackageSearch className="track-order-page__hero-icon" strokeWidth={1.25} />
          <h1 className="track-order-page__title">Track your order</h1>
          <p className="track-order-page__subtitle">
            Real-time courier updates powered by Shiprocket
          </p>
        </div>
      </div>

      <div className="track-order-page__body royal-section-inner">
        {!orderIdFromUrl ? (
          <form
            className="track-search-card track-search-card--fancy"
            onSubmit={handleSearch}
          >
            <div className="track-search-card__intro">
              <h2>Find your shipment</h2>
              <p>Enter your order ID to see shipment progress and invoice.</p>
            </div>
            <div className="track-search-card__field">
              <label htmlFor="track-order-id">Order ID</label>
              <input
                id="track-order-id"
                type="text"
                placeholder="RF-ORD-20260629-0007"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="track-order-btn track-order-btn--primary track-order-btn--wide"
              disabled={loading}
            >
              <Search className="h-4 w-4" />
              {loading ? "Searching…" : "Track shipment"}
            </button>
          </form>
        ) : loading && !result ? (
          <div className="track-order-loading">
            <div className="track-order-loading__spinner" />
            <p>Fetching your shipment details…</p>
          </div>
        ) : null}

        {result ? (
          <div className="track-stage">
            <section className="track-command-strip">
              <div className="track-command-strip__identity">
                <p className="track-order-card__eyebrow">Order reference</p>
                <h2 className="track-command-strip__title">
                  {result.order.orderNumber}
                </h2>
                <p className="track-order-card__date">
                  Placed{" "}
                  {result.order.createdAt
                    ? formatTrackDate(result.order.createdAt)
                    : "—"}
                </p>
              </div>

              <div
                className="track-command-journey"
                style={
                  { "--journey-progress": `${journeyProgress}%` } as React.CSSProperties
                }
              >
                <div className="track-command-journey__inner">
                  <div className="track-command-journey__track" aria-hidden />
                  <div className="track-command-journey__fill" aria-hidden />
                  {ORDER_JOURNEY.map((step, index) => {
                    const done = activeStep >= index;
                    const current = activeStep === index;
                    return (
                      <div
                        key={step.id}
                        className={`track-command-journey__step ${done ? "is-done" : ""} ${current ? "is-current" : ""}`}
                      >
                        <div className="track-command-journey__dot">
                          {done ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>
                        <span>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="track-command-strip__summary">
                <span className={statusBadgeClass(result.order.status)}>
                  {orderStatusLabel}
                </span>
                <div className="track-command-strip__total">
                  <span>Order total</span>
                  <strong>{formatPrice(result.order.totalAmount)}</strong>
                </div>
              </div>
            </section>

            <div className="track-bento">
              <section className="track-panel track-panel--tracking">
                <div className="track-panel__head">
                  <div>
                    <p className="track-order-card__eyebrow">Shipment status</p>
                    <h3 className="track-order-delivery-title">{deliveryStatus}</h3>
                  </div>
                  <span className="track-order-live-badge">Live</span>
                </div>

                <div className="track-order-shipment-meta">
                  <div>
                    <Truck className="h-4 w-4" />
                    <span>{courier || "Courier will be assigned soon"}</span>
                  </div>
                  {awb ? (
                    <div>
                      <Package className="h-4 w-4" />
                      <span>AWB {awb}</span>
                    </div>
                  ) : null}
                  {edd ? (
                    <div>
                      <MapPin className="h-4 w-4" />
                      <span>Expected {formatTrackDate(edd)}</span>
                    </div>
                  ) : null}
                </div>

                <div className="track-panel__body">
                  {!shipment && orderStatusCode !== "DELIVERED" ? (
                    <div className="track-order-empty-state track-panel__fill">
                      <Package className="h-8 w-8" />
                      <p>
                        Your order is confirmed. Shiprocket tracking will appear here
                        once the package is handed to the courier.
                      </p>
                    </div>
                  ) : (
                    <div className="track-timeline track-timeline--fancy track-panel__fill">
                      <h4>Shipment activity</h4>
                      {trackingEvents.length === 0 ? (
                        <div className="track-order-empty-state track-order-empty-state--compact track-panel__fill-center">
                          <CheckCircle2 className="h-8 w-8" />
                          <p>
                            {orderStatusCode === "DELIVERED"
                              ? "Your order has been delivered successfully."
                              : "Shipment registered. Courier scan updates will appear here as your package moves."}
                          </p>
                        </div>
                      ) : (
                        <div className="track-timeline__list">
                          {trackingEvents.map((event, index) => (
                            <div
                              key={`${event.statusCode}-${event.trackedAt}-${index}`}
                              className={`track-timeline__step track-timeline__step--fancy ${index === 0 ? "is-latest" : ""}`}
                            >
                              <div className="track-timeline__dot">
                                <Truck className="h-4 w-4" />
                              </div>
                              <div className="track-timeline__content">
                                <p className="track-timeline__label">
                                  {event.statusMessage}
                                </p>
                                <p className="track-timeline__desc">
                                  {[
                                    event.location,
                                    event.trackedAt
                                      ? formatTrackDate(event.trackedAt)
                                      : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              <section className="track-panel track-panel--details">
                <div className="track-panel__head">
                  <div>
                    <p className="track-order-card__eyebrow">Order details</p>
                    <h3>Summary &amp; items</h3>
                  </div>
                </div>

                <div className="track-order-metrics track-order-metrics--stack">
                  <div className="track-order-metric">
                    <span>Payment</span>
                    <strong>{result.order.paymentMethod || "—"}</strong>
                  </div>
                  <div className="track-order-metric">
                    <span>Items</span>
                    <strong>{result.items.length}</strong>
                  </div>
                  <div className="track-order-metric">
                    <span>Total paid</span>
                    <strong>{formatPrice(result.order.totalAmount)}</strong>
                  </div>
                </div>

                {invoiceAvailable ? (
                  <div className="track-order-invoice-cta track-order-invoice-cta--compact">
                    <div>
                      <FileText className="h-5 w-5" />
                      <div>
                        <strong>Invoice ready</strong>
                        <p>View or download your tax invoice.</p>
                      </div>
                    </div>
                    <div className="track-order-invoice-cta__actions">
                      <button
                        type="button"
                        className="track-order-btn track-order-btn--ghost"
                        onClick={() => setInvoiceOpen(true)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="track-order-btn track-order-btn--primary"
                        onClick={() => setInvoiceOpen(true)}
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="track-order-invoice-hint">
                    Invoice will be available after payment is verified or once your
                    order is delivered.
                  </p>
                )}

                <ul className="track-order-items track-order-items--fancy track-panel__items">
                  {result.items.map((item) => {
                    const productHref =
                      item.href ||
                      (item.productSlug ? `/product/${item.productSlug}` : "");
                    const media = (
                      <div className="track-order-item__media">
                        <MediaImage
                          src={item.imageUrl || null}
                          alt={item.name}
                          fill
                          fit="cover"
                          placeholderSize="sm"
                          showLabel
                        />
                      </div>
                    );

                    return (
                      <li
                        key={item.id}
                        className="track-order-item track-order-item--fancy"
                      >
                        {productHref ? (
                          <Link
                            href={productHref}
                            className="track-order-item__media-link"
                            aria-label={`View ${item.name}`}
                          >
                            {media}
                          </Link>
                        ) : (
                          media
                        )}
                        <div className="track-order-item__body">
                          {productHref ? (
                            <Link
                              href={productHref}
                              className="track-order-item__name track-order-item__name--link"
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <p className="track-order-item__name">{item.name}</p>
                          )}
                          <p className="track-order-item__meta">
                            SKU {item.sku || "—"} · Qty {item.quantity}
                          </p>
                        </div>
                        <strong className="track-order-item__price">
                          {formatPrice(item.lineTotal)}
                        </strong>
                      </li>
                    );
                  })}
                </ul>

                <StorefrontOrderActionsBar
                  orderNumber={result.order.orderNumber}
                  actions={result.actions}
                  onActionComplete={() => void runTrack(result.order.orderNumber)}
                />
              </section>
            </div>
          </div>
        ) : searched && !loading ? (
          <div className="track-order-empty-state">
            <PackageSearch className="h-10 w-10" />
            <p>No order found. Check that the order ID belongs to your account.</p>
          </div>
        ) : null}

        <p className="track-order-help">
          Need help? <Link href="/contact">Contact support</Link>
        </p>
      </div>

      {result && invoiceAvailable ? (
        <StorefrontInvoiceModal
          orderNumber={result.order.orderNumber}
          open={invoiceOpen}
          onClose={() => setInvoiceOpen(false)}
        />
      ) : null}
    </div>
  );
}
