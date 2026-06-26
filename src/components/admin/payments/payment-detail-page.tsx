"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchPayment } from "@/services/payments-api";
import type { PaymentItem } from "@/types/payments";

const LIST_PATH = "/my-admin/payments";

type Props = { paymentId: string };

export function PaymentDetailPage({ paymentId }: Props) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPayment(await fetchPayment(paymentId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load payment"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [paymentId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !payment) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={`Payment — ${payment.orderNumber}`}
        listPath={LIST_PATH}
        listLabel="Payments"
        sectionLabel="Payments"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${paymentId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Payment
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Order Info</h4>
            <p>
              Order: <strong>{payment.orderNumber}</strong>
            </p>
            <p>Customer: {payment.customerName}</p>
            <p>Status: {payment.paymentStatus}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Payment Info</h4>
            <p>Method: {payment.paymentMethod}</p>
            <p>
              Amount: {formatCurrency(payment.paymentAmount)} ({payment.currency})
            </p>
            <p>Transaction Ref: {payment.transactionRef ?? "—"}</p>
            <p>Paid At: {formatDate(payment.paidAt)}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Timestamps</h4>
            <p>Created: {formatDate(payment.createdAt)}</p>
            <p>Updated: {formatDate(payment.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
