"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchOrder, updateOrder } from "@/services/orders-api";
import {
  fetchPaymentVerifications,
  updatePayment,
  updatePaymentVerification,
} from "@/services/payments-api";
import type { OrderDetail, OrderPayment } from "@/types/orders";
import type { PaymentVerificationItem } from "@/types/payments";

type Props = {
  orderId: string;
  order: OrderDetail;
  onOrderUpdated: (order: OrderDetail) => void;
};

function paymentStatusTone(status: string): "active" | "inactive" | "warning" {
  const value = status.toUpperCase();
  if (value === "VERIFIED" || value === "PAID") return "active";
  if (value === "PENDING" || value === "PARTIAL") return "warning";
  return "inactive";
}

function verificationStatusTone(status: string): "active" | "inactive" | "warning" {
  const value = status.toUpperCase();
  if (value === "APPROVED") return "active";
  if (value === "PENDING") return "warning";
  return "inactive";
}

function overallPaymentStatus(payments: OrderPayment[]): string {
  if (payments.length === 0) return "NONE";
  const statuses = payments.map((p) => p.paymentStatus.toUpperCase());
  if (statuses.every((s) => s === "VERIFIED" || s === "PAID")) return "VERIFIED";
  if (statuses.some((s) => s === "VERIFIED" || s === "PAID")) return "PARTIAL";
  if (statuses.some((s) => s === "PENDING")) return "PENDING";
  return payments[0]?.paymentStatus ?? "UNKNOWN";
}

export function OrderPaymentsPanel({ orderId, order, onOrderUpdated }: Props) {
  const [verifications, setVerifications] = useState<PaymentVerificationItem[]>([]);
  const [loadingVerifications, setLoadingVerifications] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);

  const loadVerifications = useCallback(async () => {
    setLoadingVerifications(true);
    try {
      const data = await fetchPaymentVerifications({
        orderId,
        pageSize: 50,
        sortBy: "created_at",
        sortDir: "desc",
      });
      setVerifications(data.items);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load payment verifications"));
      setVerifications([]);
    } finally {
      setLoadingVerifications(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadVerifications();
  }, [loadVerifications]);

  async function refreshOrder() {
    const updated = await fetchOrder(orderId);
    onOrderUpdated(updated);
    return updated;
  }

  async function handleVerificationStatus(
    verificationId: string,
    status: "APPROVED" | "REJECTED",
  ) {
    const label = status === "APPROVED" ? "approve" : "reject";
    if (
      !window.confirm(`Are you sure you want to ${label} this payment verification?`)
    ) {
      return;
    }
    setActingId(verificationId);
    try {
      await updatePaymentVerification(verificationId, { verificationStatus: status });
      await loadVerifications();
      await refreshOrder();
      royalToast.success(
        status === "APPROVED"
          ? "Payment verified successfully"
          : "Payment verification rejected",
      );
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Verification update failed"));
    } finally {
      setActingId(null);
    }
  }

  async function handleMarkPaymentVerified(payment: OrderPayment) {
    if (!window.confirm("Mark this payment as verified?")) return;
    setUpdatingPaymentId(payment.id);
    try {
      await updatePayment(payment.id, {
        paymentStatus: "VERIFIED",
      });
      await refreshOrder();
      royalToast.success("Payment marked as verified");
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to update payment"));
    } finally {
      setUpdatingPaymentId(null);
    }
  }

  async function handleConfirmOrderAfterPayment() {
    if (!window.confirm("Mark this order as payment verified?")) return;
    try {
      const updated = await updateOrder(orderId, { statusCode: "PAYMENT_VERIFIED" });
      onOrderUpdated(updated);
      royalToast.success("Order updated to Payment Verified");
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to update order status"));
    }
  }

  const paymentSummary = overallPaymentStatus(order.payments);
  const canConfirmOrder =
    (paymentSummary === "VERIFIED" || paymentSummary === "PAID") &&
    ["PENDING", "PAYMENT_PENDING"].includes(order.currentStatus.toUpperCase());

  return (
    <div className="admin-order-payments">
      <div className="admin-inventory-detail-grid">
        <div className="admin-detail-card">
          <h4>Payment Summary</h4>
          <p>
            <span>Method:</span> <strong>{order.paymentMethod}</strong>
          </p>
          <p>
            <span>Order total:</span> {formatCurrency(order.totalAmount)}
          </p>
          <p>
            <span>Payment status:</span>{" "}
            <span className={`admin-status-badge ${paymentStatusTone(paymentSummary)}`}>
              {paymentSummary}
            </span>
          </p>
        </div>
        <div className="admin-detail-card">
          <h4>Actions</h4>
          {canConfirmOrder ? (
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => void handleConfirmOrderAfterPayment()}
            >
              Mark order as Payment Verified
            </button>
          ) : (
            <p className="admin-form-hint">
              Order status can be updated after payment is verified.
            </p>
          )}
          <p className="admin-form-hint" style={{ marginTop: "0.75rem" }}>
            <Link href="/my-admin/payments/verification" className="admin-data-link">
              Open all payment verifications
            </Link>
          </p>
        </div>
      </div>

      <div className="admin-data-table-wrap">
        <h4 className="admin-detail-card__title">Payment records</h4>
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Reference / UTR</th>
              <th>Paid At</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {order.payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-data-empty">
                  No payments recorded
                </td>
              </tr>
            ) : (
              order.payments.map((payment) => {
                const pending =
                  payment.paymentStatus.toUpperCase() === "PENDING" ||
                  payment.paymentStatus.toUpperCase() === "PAID";
                return (
                  <tr key={payment.id}>
                    <td>{payment.paymentMethod}</td>
                    <td>{formatCurrency(payment.paymentAmount)}</td>
                    <td>
                      <span
                        className={`admin-status-badge ${paymentStatusTone(payment.paymentStatus)}`}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td>{payment.transactionRef ?? "—"}</td>
                    <td>{payment.paidAt ? formatDate(payment.paidAt) : "—"}</td>
                    <td>{payment.createdAt ? formatDate(payment.createdAt) : "—"}</td>
                    <td>
                      {pending ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          disabled={updatingPaymentId === payment.id}
                          onClick={() => void handleMarkPaymentVerified(payment)}
                        >
                          {updatingPaymentId === payment.id
                            ? "Saving…"
                            : "Mark verified"}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-order-payments__verifications">
        <h4 className="admin-detail-card__title">Payment verification</h4>
        {loadingVerifications ? (
          <div className="admin-product-form-loading admin-product-form-loading--inline">
            <div className="admin-inline-spinner" />
            <p>Loading verification details…</p>
          </div>
        ) : verifications.length === 0 ? (
          <p className="admin-data-empty">
            No payment verification submitted for this order.
          </p>
        ) : (
          <div className="admin-order-payments__verification-list">
            {verifications.map((item) => {
              const screenshotSrc = resolveMediaUrl(item.screenshotUrl);
              const isPending = item.verificationStatus.toUpperCase() === "PENDING";
              return (
                <div
                  key={item.id}
                  className="admin-detail-card admin-order-payments__verification-card"
                >
                  <div className="admin-order-payments__verification-header">
                    <div>
                      <p className="admin-order-payments__verification-utr">
                        UTR: <strong>{item.utrNumber}</strong>
                      </p>
                      <p>
                        Amount: {formatCurrency(item.paymentAmount)} · Payment ID:{" "}
                        {item.paymentId}
                      </p>
                    </div>
                    <span
                      className={`admin-status-badge ${verificationStatusTone(item.verificationStatus)}`}
                    >
                      {item.verificationStatus}
                    </span>
                  </div>

                  <div className="admin-inventory-detail-grid">
                    <div>
                      <p>
                        <span>Verified by:</span> {item.verifiedByName ?? "—"}
                      </p>
                      <p>
                        <span>Verified at:</span>{" "}
                        {item.verificationTime
                          ? formatDate(item.verificationTime)
                          : "—"}
                      </p>
                      <p>
                        <span>Submitted:</span>{" "}
                        {item.createdAt ? formatDate(item.createdAt) : "—"}
                      </p>
                      {item.remarks && item.remarks !== "NA" ? (
                        <p>
                          <span>Remarks:</span> {item.remarks}
                        </p>
                      ) : null}
                    </div>
                    {screenshotSrc ? (
                      <div className="admin-order-payments__screenshot">
                        <p className="admin-order-payments__screenshot-label">
                          Payment screenshot
                        </p>
                        {}
                        <a
                          href={screenshotSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={screenshotSrc}
                            alt="Payment screenshot"
                            className="admin-order-payments__screenshot-img"
                          />
                        </a>
                      </div>
                    ) : (
                      <p className="admin-form-hint">No screenshot uploaded</p>
                    )}
                  </div>

                  <div className="admin-order-payments__verification-actions">
                    <Link
                      href={`/my-admin/payments/verification/${item.id}`}
                      className="admin-btn admin-btn-outline admin-btn-sm"
                    >
                      View details
                    </Link>
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary admin-btn-sm"
                          disabled={actingId === item.id}
                          onClick={() =>
                            void handleVerificationStatus(item.id, "APPROVED")
                          }
                        >
                          {actingId === item.id ? "Saving…" : "Approve payment"}
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          disabled={actingId === item.id}
                          onClick={() =>
                            void handleVerificationStatus(item.id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
