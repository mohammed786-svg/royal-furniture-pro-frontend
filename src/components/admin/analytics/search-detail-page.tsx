"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchSearch } from "@/services/analytics-api";
import type { SearchHistoryItem } from "@/types/analytics";

const LIST_PATH = "/my-admin/analytics/search";

type Props = { searchId: string };

export function SearchDetailPage({ searchId }: Props) {
  const router = useRouter();
  const [item, setItem] = useState<SearchHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItem(await fetchSearch(searchId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load search record"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [searchId, router]);

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
        title={item.searchQuery}
        listPath={LIST_PATH}
        listLabel="Search Reports"
        sectionLabel="Analytics"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${searchId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Search Record
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Search Info</h4>
            <p>
              Query: <strong>{item.searchQuery}</strong>
            </p>
            <p>Results: {item.resultsCount}</p>
            <p>Session: {item.sessionId || "—"}</p>
            <p>Searched: {formatDate(item.searchedAt)}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Context</h4>
            <p>Customer ID: {item.customerId || "—"}</p>
            <p>Clicked Product: {item.clickedProductId || "—"}</p>
            <p>IP Address: {item.ipAddress || "—"}</p>
          </div>
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
