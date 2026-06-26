"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchShipment } from "@/services/shipping-api";
import type { ShipmentItem } from "@/types/shipping";

const LIST_PATH = "/my-admin/shipping";

type Props = { shipmentId: string };

export function ShipmentDetailPage({ shipmentId }: Props) {
  const router = useRouter();
  const [shipment, setShipment] = useState<ShipmentItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setShipment(await fetchShipment(shipmentId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load shipment"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [shipmentId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !shipment) {
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
        title={`Shipment — ${shipment.orderNumber}`}
        listPath={LIST_PATH}
        listLabel="Shipments"
        sectionLabel="Shipping"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${shipmentId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Shipment
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Order Info</h4>
            <p>
              Order: <strong>{shipment.orderNumber}</strong>
            </p>
            <p>Customer: {shipment.customerName}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Courier & Tracking</h4>
            <p>AWB: {shipment.awbNumber ?? "—"}</p>
            <p>Courier: {shipment.courierName ?? "—"}</p>
            <p>Tracking: {shipment.trackingNumber ?? "—"}</p>
            <p>Shiprocket Order: {shipment.shiprocketOrderId ?? "—"}</p>
            <p>External ID: {shipment.shipmentIdExternal ?? "—"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Status</h4>
            <p>Pickup: {shipment.pickupStatus ?? "—"}</p>
            <p>Delivery: {shipment.deliveryStatus ?? "—"}</p>
            <p>Est. Delivery: {formatDate(shipment.estimatedDeliveryDate)}</p>
            <p>Shipped: {formatDate(shipment.shippedAt)}</p>
            <p>Delivered: {formatDate(shipment.deliveredAt)}</p>
          </div>
          {shipment.shippingLabelUrl && (
            <div className="admin-detail-card">
              <h4>Label</h4>
              <p>
                <a href={shipment.shippingLabelUrl} target="_blank" rel="noreferrer">
                  View shipping label
                </a>
              </p>
            </div>
          )}
          <div className="admin-detail-card">
            <h4>Timestamps</h4>
            <p>Created: {formatDate(shipment.createdAt)}</p>
            <p>Updated: {formatDate(shipment.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
