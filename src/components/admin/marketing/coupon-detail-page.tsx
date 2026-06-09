"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchCoupon } from "@/services/marketing-api";
import type { CouponItem } from "@/types/marketing";

const LIST_PATH = "/admin/marketing/coupons";

type Props = { couponId: string };

function formatDiscount(coupon: CouponItem) {
  if (coupon.discountType === "PERCENTAGE") {
    return `${coupon.discountValue}%`;
  }
  return formatCurrency(coupon.discountValue);
}

export function CouponDetailPage({ couponId }: Props) {
  const router = useRouter();
  const [coupon, setCoupon] = useState<CouponItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCoupon(await fetchCoupon(couponId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load coupon"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [couponId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !coupon) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const usages = coupon.usages ?? [];

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={coupon.couponCode}
        listPath={LIST_PATH}
        listLabel="Coupons"
        sectionLabel="Marketing"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${couponId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Coupon
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Coupon Info</h4>
            <p>
              <strong>{coupon.couponName}</strong>
            </p>
            <p>Code: {coupon.couponCode}</p>
            <p>Type: {coupon.discountType === "PERCENTAGE" ? "Percentage" : "Fixed"}</p>
            <p>Value: {formatDiscount(coupon)}</p>
            <p>
              Used: {coupon.usedCount} / {coupon.usageLimit || "∞"}
            </p>
            <p>Status: {coupon.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Limits & Dates</h4>
            <p>Max discount: {formatCurrency(coupon.maxDiscountAmount)}</p>
            <p>Min order: {formatCurrency(coupon.minimumOrderAmount)}</p>
            <p>Per customer: {coupon.usagePerCustomer}</p>
            <p>Starts: {formatDate(coupon.startsAt)}</p>
            <p>Expires: {formatDate(coupon.expiresAt)}</p>
            <p>Created: {formatDate(coupon.createdAt)}</p>
            <p>Updated: {formatDate(coupon.updatedAt)}</p>
          </div>
        </div>
        <div className="admin-detail-card span-2 mt-4">
          <h4>Usage History ({usages.length})</h4>
          <div className="admin-data-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Order</th>
                  <th>Discount</th>
                  <th>Used At</th>
                </tr>
              </thead>
              <tbody>
                {usages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-data-empty">
                      No usage records
                    </td>
                  </tr>
                ) : (
                  usages.map((usage) => (
                    <tr key={usage.id}>
                      <td>{usage.customerName}</td>
                      <td>{usage.customerEmail ?? "—"}</td>
                      <td>{usage.orderId}</td>
                      <td>{formatCurrency(usage.discountApplied)}</td>
                      <td>{formatDate(usage.usedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
