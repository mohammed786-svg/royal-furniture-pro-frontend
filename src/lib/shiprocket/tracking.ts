export type ShiprocketTrackingEvent = {
  statusCode: string;
  statusMessage: string;
  location?: string;
  trackedAt?: string;
};

export type ParsedShiprocketTracking = {
  currentStatus?: string;
  awb?: string;
  courier?: string;
  etd?: string;
  events: ShiprocketTrackingEvent[];
};

function cleanShiprocketValue(value: unknown): string {
  if (value == null) return "";
  const text = String(value).trim();
  if (!text || text.toUpperCase() === "NA") return "";
  return text;
}

export function parseShiprocketTrackingPayload(
  data: Record<string, unknown>,
): ParsedShiprocketTracking {
  const trackingData =
    data.tracking_data && typeof data.tracking_data === "object"
      ? (data.tracking_data as Record<string, unknown>)
      : data;

  const scans = trackingData.shipment_track_activities ?? trackingData.scans ?? [];
  const events: ShiprocketTrackingEvent[] = [];

  if (Array.isArray(scans)) {
    for (const scan of scans) {
      if (!scan || typeof scan !== "object") continue;
      const row = scan as Record<string, unknown>;
      events.push({
        statusCode:
          cleanShiprocketValue(row["sr-status-label"] ?? row.status) || "UPDATE",
        statusMessage:
          cleanShiprocketValue(row.activity ?? row.status) || "Shipment update",
        location: cleanShiprocketValue(row.location) || undefined,
        trackedAt: cleanShiprocketValue(row.date) || undefined,
      });
    }
  }

  return {
    currentStatus: cleanShiprocketValue(
      trackingData.shipment_status ??
        trackingData.current_status ??
        data.current_status ??
        data.shipment_status,
    ),
    awb: cleanShiprocketValue(trackingData.awb ?? data.awb),
    courier: cleanShiprocketValue(
      trackingData.courier_name ?? data.courier_name ?? data.courier,
    ),
    etd: cleanShiprocketValue(trackingData.edd ?? data.edd),
    events,
  };
}
