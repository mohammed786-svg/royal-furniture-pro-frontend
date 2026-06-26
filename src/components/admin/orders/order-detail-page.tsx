"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderInvoiceView } from "@/components/admin/orders/order-invoice-view";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  fetchOrder,
  fetchOrderInvoice,
  fetchOrderOptions,
  updateOrder,
} from "@/services/orders-api";
import type { OrderDetail, OrderInvoice, OrderOptions } from "@/types/orders";

const LIST_PATH = "/my-admin/orders";

const TABS = [
  "Summary",
  "Items",
  "Tracking",
  "History",
  "Payments",
  "Invoice",
] as const;
type Tab = (typeof TABS)[number];

type Props = { orderId: string };

function AddressCard({
  title,
  address,
}: {
  title: string;
  address?: OrderDetail["shippingAddress"];
}) {
  if (!address)
    return (
      <div className="admin-detail-card">
        <h4>{title}</h4>
        <p>—</p>
      </div>
    );
  return (
    <div className="admin-detail-card">
      <h4>{title}</h4>
      <p>
        <strong>{address.fullName}</strong>
      </p>
      <p>{address.phone}</p>
      <p>{address.addressLine1}</p>
      {address.addressLine2 && <p>{address.addressLine2}</p>}
      <p>
        {address.city}, {address.state} — {address.pincode}
      </p>
    </div>
  );
}

export function OrderDetailPage({ orderId }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [invoice, setInvoice] = useState<OrderInvoice | null>(null);
  const [options, setOptions] = useState<OrderOptions | null>(null);
  const [tab, setTab] = useState<Tab>("Summary");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [detail, opts] = await Promise.all([
        fetchOrder(orderId),
        fetchOrderOptions(),
      ]);
      setOrder(detail);
      setOptions(opts);
      setNewStatus(detail.currentStatus);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load order"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (tab !== "Invoice" || invoice) return;
    void fetchOrderInvoice(orderId)
      .then(setInvoice)
      .catch((err) =>
        royalToast.error(getApiErrorMessage(err, "Failed to load invoice")),
      );
  }, [tab, orderId, invoice]);

  async function handleStatusUpdate() {
    if (!newStatus || !order) return;
    setUpdating(true);
    try {
      const updated = await updateOrder(orderId, { statusCode: newStatus });
      setOrder(updated);
      royalToast.success("Order status updated");
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Update failed"));
    } finally {
      setUpdating(false);
    }
  }

  if (loading || !order) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={`Order ${order.orderNumber}`}
        listPath={LIST_PATH}
        listLabel="Orders"
        sectionLabel="Orders"
      />

      <div className="admin-data-card admin-order-detail">
        <div className="admin-profile-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`admin-profile-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Summary" && (
          <div className="admin-order-detail-content">
            <div className="admin-inventory-detail-grid">
              <div className="admin-detail-card">
                <h4>Customer</h4>
                <p>
                  <strong>{order.customerName}</strong>
                </p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
                <Link
                  href={`/my-admin/customers/${order.customerId}`}
                  className="admin-data-link"
                >
                  View customer
                </Link>
              </div>
              <div className="admin-detail-card">
                <h4>Order Info</h4>
                <p>
                  <span>Status:</span>{" "}
                  <strong>{order.statusName || order.currentStatus}</strong>
                </p>
                <p>
                  <span>Payment:</span> {order.paymentMethod}
                </p>
                <p>
                  <span>Created:</span> {formatDate(order.createdAt)}
                </p>
                {order.couponCode && (
                  <p>
                    <span>Coupon:</span> {order.couponCode}
                  </p>
                )}
              </div>
              <div className="admin-detail-card">
                <h4>Totals</h4>
                <p>Subtotal: {formatCurrency(order.subtotal)}</p>
                <p>Discount: {formatCurrency(order.discountAmount)}</p>
                <p>Tax: {formatCurrency(order.taxAmount)}</p>
                <p>Shipping: {formatCurrency(order.shippingAmount)}</p>
                <p className="grand">
                  <strong>Total: {formatCurrency(order.totalAmount)}</strong>
                </p>
              </div>
            </div>
            <div className="admin-inventory-detail-grid">
              <AddressCard title="Shipping Address" address={order.shippingAddress} />
              <AddressCard title="Billing Address" address={order.billingAddress} />
            </div>
            {order.notes && (
              <div className="admin-detail-card span-2">
                <h4>Notes</h4>
                <p>{order.notes}</p>
              </div>
            )}
            <div className="admin-order-status-update">
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {(options?.statuses ?? []).map((s) => (
                  <option key={s.id} value={s.statusCode}>
                    {s.statusName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                disabled={updating}
                onClick={() => void handleStatusUpdate()}
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        )}

        {tab === "Items" && (
          <div className="admin-data-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>HSN</th>
                  <th>GST</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.sku}</td>
                    <td>{item.hsnCode || "—"}</td>
                    <td>{item.gstPercent}%</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.discountAmount)}</td>
                    <td>{formatCurrency(item.taxAmount)}</td>
                    <td>{formatCurrency(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Tracking" && (
          <div className="admin-data-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Location</th>
                  <th>Tracked At</th>
                  <th>Visible</th>
                </tr>
              </thead>
              <tbody>
                {order.tracking.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-data-empty">
                      No tracking events
                    </td>
                  </tr>
                ) : (
                  order.tracking.map((t) => (
                    <tr key={t.id}>
                      <td>{t.statusCode}</td>
                      <td>{t.statusMessage}</td>
                      <td>{t.location ?? "—"}</td>
                      <td>{formatDate(t.trackedAt)}</td>
                      <td>{t.isCustomerVisible ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "History" && (
          <div className="admin-data-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Changed By</th>
                  <th>Reason</th>
                  <th>At</th>
                </tr>
              </thead>
              <tbody>
                {order.history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-data-empty">
                      No history
                    </td>
                  </tr>
                ) : (
                  order.history.map((h) => (
                    <tr key={h.id}>
                      <td>{h.fromStatus}</td>
                      <td>{h.toStatus}</td>
                      <td>{h.changedByName ?? h.changedBy ?? "—"}</td>
                      <td>{h.changeReason ?? "—"}</td>
                      <td>{formatDate(h.changedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Payments" && (
          <div className="admin-data-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                {order.payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-data-empty">
                      No payments recorded
                    </td>
                  </tr>
                ) : (
                  order.payments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.paymentMethod}</td>
                      <td>{formatCurrency(p.paymentAmount)}</td>
                      <td>{p.paymentStatus}</td>
                      <td>{p.transactionRef ?? "—"}</td>
                      <td>{formatDate(p.paidAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Invoice" &&
          (invoice ? (
            <OrderInvoiceView invoice={invoice} />
          ) : (
            <div className="admin-product-form-loading">
              <div className="admin-inline-spinner" />
              <p>Loading invoice...</p>
            </div>
          ))}
      </div>
    </div>
  );
}
