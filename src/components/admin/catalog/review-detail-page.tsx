"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  deleteReview,
  fetchReview,
  updateReviewStatus,
} from "@/services/catalog-reviews";
import type { ReviewItem } from "@/types/reviews";

const LIST_PATH = "/my-admin/catalog/reviews";

type Props = { reviewId: string };

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function ReviewDetailPage({ reviewId }: Props) {
  const router = useRouter();
  const [review, setReview] = useState<ReviewItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setReview(await fetchReview(reviewId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load review"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [reviewId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatus(status: "APPROVED" | "REJECTED") {
    setActing(true);
    try {
      await updateReviewStatus(reviewId, status);
      royalToast.success(status === "APPROVED" ? "Review approved" : "Review rejected");
      await load();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Action failed"));
    } finally {
      setActing(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId);
      royalToast.success("Review deleted");
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  if (loading || !review) {
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
        title={review.title || `Review #${review.id}`}
        listPath={LIST_PATH}
        listLabel="Reviews"
        sectionLabel="Catalog"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${reviewId}/edit`}
            className="admin-btn admin-btn-outline admin-data-add-btn"
          >
            Edit
          </Link>
          {!review.isApproved && (
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-data-add-btn"
              disabled={acting}
              onClick={() => void handleStatus("APPROVED")}
            >
              Approve
            </button>
          )}
          {review.isApproved && (
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-data-add-btn"
              disabled={acting}
              onClick={() => void handleStatus("REJECTED")}
            >
              Reject
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn-outline admin-data-add-btn danger"
            onClick={() => void handleDelete()}
          >
            Delete
          </button>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Review</h4>
            <p className="admin-review-stars">
              {renderStars(review.rating)} ({review.rating}/5)
            </p>
            <p>
              <strong>{review.title || "—"}</strong>
            </p>
            <p>{review.reviewText || "—"}</p>
            <p>Verified purchase: {review.isVerifiedPurchase ? "Yes" : "No"}</p>
            <p>
              Status:{" "}
              <span
                className={`admin-status-badge ${review.isApproved ? "active" : "inactive"}`}
              >
                {review.isApproved ? "Approved" : "Pending"}
              </span>
            </p>
          </div>
          <div className="admin-detail-card">
            <h4>Product</h4>
            <p>
              <strong>{review.productName}</strong>
            </p>
            <p>SKU: {review.productSku}</p>
            <p>Product ID: {review.productId}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Customer</h4>
            <p>
              <strong>{review.customerName}</strong>
            </p>
            <p>{review.customerEmail || "—"}</p>
            <p>Customer ID: {review.customerId}</p>
            {review.orderId && <p>Order ID: {review.orderId}</p>}
          </div>
          <div className="admin-detail-card">
            <h4>Moderation</h4>
            <p>Approved by: {review.approvedBy ?? "—"}</p>
            <p>
              Approved at: {review.approvedAt ? formatDate(review.approvedAt) : "—"}
            </p>
            <p>Created: {formatDate(review.createdAt)}</p>
            <p>Updated: {formatDate(review.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
