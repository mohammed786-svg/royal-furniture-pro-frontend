"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchShipmentTrackingEntry } from "@/services/shipping-api";
import type { ShipmentTrackingItem } from "@/types/shipping";

const LIST_PATH = "/admin/shipping/tracking";

type Props = { trackingId: string };

export function ShipmentTrackingDetailPage({ trackingId }: Props) {
  const router = useRouter();
  const [item, setItem] = useState<ShipmentTrackingItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItem(await fetchShipmentTrackingEntry(trackingId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load tracking entry"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [trackingId, router]);

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
        title={`Tracking — ${item.orderNumber}`}
        listPath={LIST_PATH}
        listLabel="Tracking"
        sectionLabel="Shipping"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${trackingId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Tracking
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Order Info</h4>
            <p>
              Order: <strong>{item.orderNumber}</strong>
            </p>
            <p>Customer: {item.customerName}</p>
            <p>Shipment ID: {item.shipmentId}</p>
            <p>AWB: {item.awbNumber ?? "—"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Status</h4>
            <p>Code: {item.statusCode}</p>
            <p>Message: {item.statusMessage}</p>
            <p>Location: {item.location ?? "—"}</p>
            <p>Source: {item.source}</p>
            <p>Tracked At: {formatDate(item.trackedAt)}</p>
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
