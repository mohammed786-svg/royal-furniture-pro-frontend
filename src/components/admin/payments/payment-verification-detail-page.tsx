"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  fetchPaymentVerification,
  updatePaymentVerification,
} from "@/services/payments-api";
import type { PaymentVerificationItem } from "@/types/payments";

const LIST_PATH = "/admin/payments/verification";

type Props = { verificationId: string };

export function PaymentVerificationDetailPage({ verificationId }: Props) {
  const router = useRouter();
  const [item, setItem] = useState<PaymentVerificationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItem(await fetchPaymentVerification(verificationId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load verification"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [verificationId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatusUpdate(status: "APPROVED" | "REJECTED") {
    if (!item) return;
    const label = status === "APPROVED" ? "approve" : "reject";
    if (!window.confirm(`Are you sure you want to ${label} this verification?`)) return;
    setActing(true);
    try {
      const updated = await updatePaymentVerification(verificationId, {
        verificationStatus: status,
      });
      setItem(updated);
      royalToast.success(`Verification ${status.toLowerCase()}`);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Update failed"));
    } finally {
      setActing(false);
    }
  }

  if (loading || !item) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const screenshotSrc = resolveMediaUrl(item.screenshotUrl);
  const isPending = item.verificationStatus.toUpperCase() === "PENDING";

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={`Verification — ${item.orderNumber}`}
        listPath={LIST_PATH}
        listLabel="Verification"
        sectionLabel="Payments"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${verificationId}/edit`}
            className="admin-btn admin-btn-outline admin-data-add-btn"
          >
            Edit
          </Link>
          {isPending && (
            <>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-data-add-btn"
                disabled={acting}
                onClick={() => void handleStatusUpdate("APPROVED")}
              >
                Approve
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-outline admin-data-add-btn"
                disabled={acting}
                onClick={() => void handleStatusUpdate("REJECTED")}
              >
                Reject
              </button>
            </>
          )}
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Order Info</h4>
            <p>
              Order: <strong>{item.orderNumber}</strong>
            </p>
            <p>Customer: {item.customerName}</p>
            <p>Payment ID: {item.paymentId}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Verification Info</h4>
            <p>UTR: {item.utrNumber}</p>
            <p>Amount: {formatCurrency(item.paymentAmount)}</p>
            <p>Status: {item.verificationStatus}</p>
            <p>Verified By: {item.verifiedByName ?? "—"}</p>
            <p>Verified At: {formatDate(item.verificationTime)}</p>
          </div>
          {item.remarks && (
            <div className="admin-detail-card">
              <h4>Remarks</h4>
              <p>{item.remarks}</p>
            </div>
          )}
          {screenshotSrc && (
            <div className="admin-detail-card span-2">
              <h4>Screenshot</h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotSrc}
                alt="Payment screenshot"
                className="admin-detail-logo"
              />
            </div>
          )}
          <div className="admin-detail-card">
            <h4>Timestamps</h4>
            <p>Created: {formatDate(item.createdAt)}</p>
            <p>Updated: {formatDate(item.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
