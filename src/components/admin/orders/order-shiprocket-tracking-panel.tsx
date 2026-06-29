"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCw, Truck } from "lucide-react";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  parseShiprocketTrackingPayload,
  type ParsedShiprocketTracking,
  type ShiprocketTrackingEvent,
} from "@/lib/shiprocket/tracking";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchShiprocketTracking } from "@/services/shiprocket-api";
import type { OrderDetail } from "@/types/orders";

type Shipment = OrderDetail["shipments"][number];
type StoredTracking = OrderDetail["shipmentTracking"][number];

function cleanValue(value?: string | null): string {
  if (!value) return "";
  const text = value.trim();
  if (!text || text.toUpperCase() === "NA") return "";
  return text;
}

function formatTrackDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function storedToEvents(rows: StoredTracking[]): ShiprocketTrackingEvent[] {
  return rows.map((row) => ({
    statusCode: row.statusCode,
    statusMessage: row.statusMessage,
    location: row.location ?? undefined,
    trackedAt: row.trackedAt ?? undefined,
  }));
}

type Props = {
  order: OrderDetail;
};

export function OrderShiprocketTrackingPanel({ order }: Props) {
  const [liveByShipment, setLiveByShipment] = useState<
    Record<string, ParsedShiprocketTracking>
  >({});
  const [loading, setLoading] = useState(false);

  const trackingByShipment = useMemo(() => {
    const map = new Map<string, StoredTracking[]>();
    for (const row of order.shipmentTracking) {
      const list = map.get(row.shipmentId) ?? [];
      list.push(row);
      map.set(row.shipmentId, list);
    }
    return map;
  }, [order.shipmentTracking]);

  const loadLiveTracking = useCallback(async () => {
    if (order.shipments.length === 0) return;
    setLoading(true);
    const results: Record<string, ParsedShiprocketTracking> = {};

    await Promise.all(
      order.shipments.map(async (shipment) => {
        const awb = cleanValue(shipment.awbNumber ?? shipment.trackingNumber);
        const shipmentId = cleanValue(shipment.shipmentIdExternal);
        if (!awb && !shipmentId) return;

        try {
          const data = await fetchShiprocketTracking({
            awb: awb || undefined,
            shipmentId: !awb ? shipmentId : undefined,
          });
          results[shipment.id] = parseShiprocketTrackingPayload(data);
        } catch {
          // Fall back to stored tracking rows for this shipment.
        }
      }),
    );

    setLiveByShipment(results);
    setLoading(false);
  }, [order.shipments]);

  useEffect(() => {
    void loadLiveTracking();
  }, [loadLiveTracking]);

  async function handleRefresh() {
    try {
      await loadLiveTracking();
      royalToast.success("Shiprocket tracking refreshed");
    } catch (error) {
      royalToast.error(getApiErrorMessage(error, "Failed to refresh tracking"));
    }
  }

  return (
    <div className="admin-order-tracking">
      <div className="admin-order-tracking__toolbar">
        <div>
          <h4 className="admin-detail-card__title">Shiprocket live tracking</h4>
          <p className="admin-form-hint">
            Pulled from Shiprocket API using AWB or shipment ID on this order.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-outline admin-btn-sm"
          disabled={loading || order.shipments.length === 0}
          onClick={() => void handleRefresh()}
        >
          <RefreshCw size={14} className={loading ? "admin-icon-spin" : undefined} />
          {loading ? "Refreshing…" : "Refresh from Shiprocket"}
        </button>
      </div>

      {order.shipments.length === 0 ? (
        <p className="admin-data-empty">
          No Shiprocket shipment linked to this order yet. A shipment is created after
          checkout when Shiprocket is enabled.
        </p>
      ) : (
        <div className="admin-order-tracking__shipments">
          {order.shipments.map((shipment) => (
            <ShipmentTrackingCard
              key={shipment.id}
              shipment={shipment}
              live={liveByShipment[shipment.id]}
              stored={trackingByShipment.get(shipment.id) ?? []}
              loading={loading}
            />
          ))}
        </div>
      )}

      <div className="admin-data-table-wrap" style={{ marginTop: "1.5rem" }}>
        <h4 className="admin-detail-card__title">Order milestones</h4>
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Message</th>
              <th>Location</th>
              <th>Tracked At</th>
              <th>Visible to customer</th>
            </tr>
          </thead>
          <tbody>
            {order.tracking.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-data-empty">
                  No order milestones recorded
                </td>
              </tr>
            ) : (
              order.tracking.map((t) => (
                <tr key={t.id}>
                  <td>{t.statusCode}</td>
                  <td>{t.statusMessage}</td>
                  <td>{t.location ?? "—"}</td>
                  <td>{t.trackedAt ? formatDate(t.trackedAt) : "—"}</td>
                  <td>{t.isCustomerVisible ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShipmentTrackingCard({
  shipment,
  live,
  stored,
  loading,
}: {
  shipment: Shipment;
  live?: ParsedShiprocketTracking;
  stored: StoredTracking[];
  loading: boolean;
}) {
  const awb = cleanValue(live?.awb ?? shipment.awbNumber ?? shipment.trackingNumber);
  const courier = cleanValue(live?.courier ?? shipment.courierName);
  const status =
    cleanValue(live?.currentStatus ?? shipment.deliveryStatus) || "Awaiting updates";
  const events = live && live.events.length > 0 ? live.events : storedToEvents(stored);

  const srOrderId = cleanValue(shipment.shiprocketOrderId);

  return (
    <div className="admin-detail-card admin-order-tracking__card">
      <div className="admin-order-tracking__card-head">
        <div>
          <p className="admin-order-tracking__status">{status}</p>
          <p className="admin-order-tracking__meta">
            {courier ? `${courier}` : "Courier pending"}
            {awb ? ` · AWB ${awb}` : ""}
            {live?.etd ? ` · EDD ${live.etd}` : ""}
          </p>
        </div>
        <div className="admin-order-tracking__ids">
          {srOrderId ? (
            <Link
              href={`/my-admin/shiprocket/orders/${srOrderId}`}
              className="admin-data-link"
            >
              SR Order {srOrderId}
            </Link>
          ) : null}
          {cleanValue(shipment.shipmentIdExternal) ? (
            <span>Shipment ID {shipment.shipmentIdExternal}</span>
          ) : null}
        </div>
      </div>

      <div className="admin-track-timeline">
        {loading && events.length === 0 ? (
          <p className="admin-form-hint">Loading Shiprocket tracking…</p>
        ) : events.length === 0 ? (
          <p className="admin-data-empty">
            Shipment created in Shiprocket. Tracking scans will appear when the courier
            updates the package.
          </p>
        ) : (
          events.map((event, index) => (
            <div
              key={`${event.statusCode}-${event.trackedAt}-${index}`}
              className="admin-track-timeline__step admin-track-timeline__step--done"
            >
              <div className="admin-track-timeline__dot">
                <Truck size={14} aria-hidden />
              </div>
              <div className="admin-track-timeline__content">
                <p className="admin-track-timeline__label">{event.statusMessage}</p>
                <p className="admin-track-timeline__desc">
                  {[event.location, formatTrackDate(event.trackedAt)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {stored.length > 0 && live && live.events.length > 0 ? (
        <details className="admin-order-tracking__stored">
          <summary>Stored tracking events ({stored.length})</summary>
          <table className="admin-data-table" style={{ marginTop: "0.75rem" }}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Message</th>
                <th>Location</th>
                <th>Tracked At</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {stored.map((row) => (
                <tr key={row.id}>
                  <td>{row.statusCode}</td>
                  <td>{row.statusMessage}</td>
                  <td>{row.location ?? "—"}</td>
                  <td>{row.trackedAt ? formatDate(row.trackedAt) : "—"}</td>
                  <td>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ) : null}
    </div>
  );
}
