"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchPageView } from "@/services/analytics-api";
import type { PageViewItem } from "@/types/analytics";

const LIST_PATH = "/my-admin/analytics/page-views";

type Props = { pageViewId: string };

export function PageViewDetailPage({ pageViewId }: Props) {
  const router = useRouter();
  const [item, setItem] = useState<PageViewItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItem(await fetchPageView(pageViewId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load page view"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [pageViewId, router]);

  useEffect(() => {
    void load();
  }, [load]);

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

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={item.pageUrl}
        listPath={LIST_PATH}
        listLabel="Page Views"
        sectionLabel="Analytics"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${pageViewId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Page View
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Page Info</h4>
            <p>
              URL: <strong>{item.pageUrl}</strong>
            </p>
            <p>Title: {item.pageTitle || "—"}</p>
            <p>Session: {item.sessionId || "—"}</p>
            <p>Viewed: {formatDate(item.viewedAt)}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Context</h4>
            <p>Customer ID: {item.customerId || "—"}</p>
            <p>Product ID: {item.productId || "—"}</p>
            <p>Category ID: {item.categoryId || "—"}</p>
            <p>Sub-Category ID: {item.subCategoryId || "—"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Tracking</h4>
            <p>Referrer: {item.referrer || "—"}</p>
            <p>IP Address: {item.ipAddress || "—"}</p>
            <p>Created: {formatDate(item.createdAt)}</p>
            <p>Updated: {formatDate(item.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
