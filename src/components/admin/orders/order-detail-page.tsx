"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";
import { OrderInvoiceView } from "@/components/admin/orders/order-invoice-view";
import { OrderLifecyclePanel } from "@/components/admin/orders/order-lifecycle-panel";
import { OrderPaymentsPanel } from "@/components/admin/orders/order-payments-panel";
import { OrderShiprocketTrackingPanel } from "@/components/admin/orders/order-shiprocket-tracking-panel";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import {
  AdminInfoCard,
  AdminInfoRow,
  AdminRecordChip,
  AdminRecordHero,
  AdminRecordMetrics,
  AdminRecordPanel,
  AdminRecordTabs,
} from "@/components/admin/shared/admin-record-detail";
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
  { id: "Summary", label: "Summary", icon: LayoutDashboard },
  { id: "Items", label: "Items", icon: Package },
  { id: "Tracking", label: "Tracking", icon: Truck },
  { id: "History", label: "History", icon: History },
  { id: "Payments", label: "Payments", icon: CreditCard },
  { id: "Invoice", label: "Invoice", icon: FileText },
] as const;

type Tab = (typeof TABS)[number]["id"];

type Props = { orderId: string };

function AddressBlock({
  title,
  address,
}: {
  title: string;
  address?: OrderDetail["shippingAddress"];
}) {
  return (
    <AdminInfoCard title={title} icon={MapPin}>
      {!address ? (
        <p className="admin-info-card__address">No address on file</p>
      ) : (
        <p className="admin-info-card__address">
          <strong>{address.fullName}</strong>
          {address.phone}
          <br />
          {address.addressLine1}
          {address.addressLine2 && (
            <>
              <br />
              {address.addressLine2}
            </>
          )}
          <br />
          {address.city}, {address.state} — {address.pincode}
        </p>
      )}
    </AdminInfoCard>
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

  const itemCount = useMemo(
    () => order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [order],
  );

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

      <div className="admin-data-card admin-record-detail">
        <AdminRecordHero
          eyebrow="Order detail"
          title={order.orderNumber}
          subtitle={`Placed ${formatDate(order.createdAt)} · ${order.customerName}`}
          badge={
            <OrderStatusBadge
              statusCode={order.statusCode}
              statusName={order.statusName}
              currentStatus={order.currentStatus}
            />
          }
          chips={
            <>
              <AdminRecordChip>{order.paymentMethod}</AdminRecordChip>
              {order.couponCode && (
                <AdminRecordChip tone="warning">
                  Coupon: {order.couponCode}
                </AdminRecordChip>
              )}
              <AdminRecordChip tone="muted">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </AdminRecordChip>
            </>
          }
          actions={
            <Link
              href={`/my-admin/customers/${order.customerId}`}
              className="admin-btn admin-btn-outline"
            >
              <User size={16} />
              View customer
            </Link>
          }
        />

        <AdminRecordMetrics
          items={[
            {
              label: "Order total",
              value: formatCurrency(order.totalAmount),
              tone: "info",
            },
            {
              label: "Payment",
              value: order.paymentMethod,
            },
            {
              label: "Customer",
              value: order.customerName,
              hint: order.customerPhone || order.customerEmail,
            },
            {
              label: "Status",
              value: order.statusName || order.currentStatus,
              tone: order.currentStatus.toLowerCase().includes("cancel")
                ? "danger"
                : order.currentStatus.toLowerCase().includes("deliver")
                  ? "success"
                  : "default",
            },
          ]}
        />

        <AdminRecordTabs
          tabs={[...TABS]}
          active={tab}
          onChange={(id) => setTab(id as Tab)}
        />

        {tab === "Summary" && (
          <AdminRecordPanel>
            <div className="admin-record-grid admin-record-grid--3">
              <AdminInfoCard title="Customer" icon={User}>
                <AdminInfoRow label="Name" value={order.customerName} strong />
                <AdminInfoRow label="Email" value={order.customerEmail || "—"} />
                <AdminInfoRow label="Phone" value={order.customerPhone || "—"} />
                <Link
                  href={`/my-admin/customers/${order.customerId}`}
                  className="admin-data-link"
                >
                  Open customer profile →
                </Link>
              </AdminInfoCard>

              <AdminInfoCard title="Order info" icon={LayoutDashboard}>
                <AdminInfoRow
                  label="Status"
                  value={order.statusName || order.currentStatus}
                  strong
                />
                <AdminInfoRow label="Payment" value={order.paymentMethod} />
                <AdminInfoRow label="Created" value={formatDate(order.createdAt)} />
                {order.couponCode && (
                  <AdminInfoRow label="Coupon" value={order.couponCode} />
                )}
              </AdminInfoCard>

              <AdminInfoCard title="Totals" icon={CreditCard}>
                <AdminInfoRow label="Subtotal" value={formatCurrency(order.subtotal)} />
                <AdminInfoRow
                  label="Discount"
                  value={formatCurrency(order.discountAmount)}
                />
                <AdminInfoRow label="Tax" value={formatCurrency(order.taxAmount)} />
                <AdminInfoRow
                  label="Shipping"
                  value={formatCurrency(order.shippingAmount)}
                />
                <AdminInfoRow
                  label="Grand total"
                  value={formatCurrency(order.totalAmount)}
                  strong
                />
              </AdminInfoCard>
            </div>

            <h3 className="admin-record-section-title admin-record-section-title--spaced">
              Delivery addresses
            </h3>
            <div className="admin-record-grid">
              <AddressBlock title="Shipping" address={order.shippingAddress} />
              <AddressBlock title="Billing" address={order.billingAddress} />
            </div>

            {order.notes && (
              <>
                <h3 className="admin-record-section-title admin-record-section-title--spaced">
                  Internal notes
                </h3>
                <AdminInfoCard title="Notes" icon={FileText}>
                  <p className="admin-info-card__address">{order.notes}</p>
                </AdminInfoCard>
              </>
            )}

            <h3 className="admin-record-section-title admin-record-section-title--spaced">
              Fulfillment actions
            </h3>
            <OrderLifecyclePanel
              orderId={orderId}
              order={order}
              onOrderUpdated={setOrder}
            />

            <div className="admin-status-toolbar">
              <div className="admin-status-toolbar__copy">
                <h5>Update order status</h5>
                <p>Change lifecycle stage for this order manually.</p>
              </div>
              <div className="admin-status-toolbar__controls">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
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
                  {updating ? "Updating..." : "Save status"}
                </button>
              </div>
            </div>
          </AdminRecordPanel>
        )}

        {tab === "Items" && (
          <AdminRecordPanel>
            <div className="admin-record-table-head">
              <h3>Line items</h3>
              <span>
                {order.items.length} product{order.items.length === 1 ? "" : "s"} ·{" "}
                {itemCount} unit{itemCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="admin-data-table-wrap">
              <table className="admin-data-table admin-data-table--comfortable">
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
          </AdminRecordPanel>
        )}

        {tab === "Tracking" && (
          <AdminRecordPanel>
            <OrderLifecyclePanel
              orderId={orderId}
              order={order}
              onOrderUpdated={setOrder}
            />
            <OrderShiprocketTrackingPanel order={order} />
          </AdminRecordPanel>
        )}

        {tab === "History" && (
          <AdminRecordPanel>
            <div className="admin-record-table-head">
              <h3>Status history</h3>
              <span>
                {order.history.length} change{order.history.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="admin-data-table-wrap">
              <table className="admin-data-table admin-data-table--comfortable">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Changed by</th>
                    <th>Reason</th>
                    <th>At</th>
                  </tr>
                </thead>
                <tbody>
                  {order.history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="admin-data-empty">
                        No history yet
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
          </AdminRecordPanel>
        )}

        {tab === "Payments" && (
          <AdminRecordPanel>
            <OrderPaymentsPanel
              orderId={orderId}
              order={order}
              onOrderUpdated={setOrder}
            />
          </AdminRecordPanel>
        )}

        {tab === "Invoice" && (
          <AdminRecordPanel>
            {invoice ? (
              <OrderInvoiceView invoice={invoice} />
            ) : (
              <div className="admin-product-form-loading">
                <div className="admin-inline-spinner" />
                <p>Loading invoice...</p>
              </div>
            )}
          </AdminRecordPanel>
        )}
      </div>
    </div>
  );
}
