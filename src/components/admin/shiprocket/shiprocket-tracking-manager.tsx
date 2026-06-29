"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchShiprocketTracking } from "@/services/shiprocket-api";

export function ShiprocketTrackingManager() {
  const [awb, setAwb] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awb.trim() && !shipmentId.trim()) {
      royalToast.error("Enter AWB or Shiprocket shipment ID");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchShiprocketTracking({
        awb: awb.trim() || undefined,
        shipmentId: shipmentId.trim() || undefined,
      });
      setResult(data);
    } catch (error) {
      setResult(null);
      royalToast.error(getApiErrorMessage(error, "Tracking failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel-card">
      <form className="admin-form-grid" onSubmit={handleTrack}>
        <label>
          AWB number
          <input
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            placeholder="e.g. 1234567890"
          />
        </label>
        <label>
          Shiprocket shipment ID
          <input
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            placeholder="Optional if AWB entered"
          />
        </label>
        <button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={loading}
        >
          {loading ? "Tracking…" : "Track from Shiprocket"}
        </button>
      </form>

      {result && (
        <pre className="admin-json-preview">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
