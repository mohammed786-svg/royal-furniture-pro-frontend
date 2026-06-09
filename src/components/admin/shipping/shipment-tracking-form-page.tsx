"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createShipmentTracking,
  fetchShipmentTrackingEntry,
  fetchShippingMetaOptions,
  updateShipmentTracking,
} from "@/services/shipping-api";
import type {
  ShipmentTrackingFormValues,
  ShipmentTrackingItem,
} from "@/types/shipping";

const LIST_PATH = "/admin/shipping/tracking";

const emptyForm: ShipmentTrackingFormValues = {
  shipmentId: "",
  orderId: "",
  statusCode: "",
  statusMessage: "",
  location: "",
  trackedAt: "",
  source: "MANUAL",
};

function itemToForm(item: ShipmentTrackingItem): ShipmentTrackingFormValues {
  return {
    shipmentId: item.shipmentId,
    orderId: item.orderId,
    statusCode: item.statusCode,
    statusMessage: item.statusMessage,
    location: item.location ?? "",
    trackedAt: item.trackedAt ?? "",
    source: item.source,
  };
}

function toDatetimeLocal(value: string) {
  return value ? value.slice(0, 16) : "";
}

function fromDatetimeLocal(value: string) {
  return value ? new Date(value).toISOString() : "";
}

type Props = { mode: "create" | "edit"; trackingId?: string };

export function ShipmentTrackingFormPage({ mode, trackingId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ShipmentTrackingFormValues>(emptyForm);
  const [shipments, setShipments] = useState<
    { id: string; orderId: string; orderNumber: string; awbNumber?: string | null }[]
  >([]);
  const [trackingSources, setTrackingSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const meta = await fetchShippingMetaOptions();
      setShipments(meta.shipments);
      setTrackingSources(meta.trackingSources);
      if (mode === "edit" && trackingId) {
        setForm(itemToForm(await fetchShipmentTrackingEntry(trackingId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load tracking entry"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, trackingId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleShipmentChange(shipmentId: string) {
    const shipment = shipments.find((s) => s.id === shipmentId);
    setForm((p) => ({
      ...p,
      shipmentId,
      orderId: shipment?.orderId ?? p.orderId,
    }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.shipmentId) e.shipmentId = "Shipment is required";
    if (!form.statusCode.trim()) e.statusCode = "Status code is required";
    if (!form.statusMessage.trim()) e.statusMessage = "Status message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        location: form.location || undefined,
        trackedAt: form.trackedAt || undefined,
      };
      if (mode === "edit" && trackingId) {
        await updateShipmentTracking(trackingId, payload);
        royalToast.success("Tracking entry updated");
      } else {
        await createShipmentTracking(payload);
        royalToast.success("Tracking entry created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Tracking" : "Add Tracking";

  if (loading) {
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
        title={title}
        listPath={LIST_PATH}
        listLabel="Tracking"
        sectionLabel="Shipping"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Tracking Details</h2>
              <p>shipmenttrackingtbl — status updates and location</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Shipment" required error={errors.shipmentId}>
                <select
                  value={form.shipmentId}
                  onChange={(e) => handleShipmentChange(e.target.value)}
                >
                  <option value="">Select shipment</option>
                  {shipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.orderNumber} — {s.awbNumber ?? "No AWB"}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Status Code" required error={errors.statusCode}>
                <input
                  value={form.statusCode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, statusCode: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField
                label="Status Message"
                required
                error={errors.statusMessage}
                className="span-2"
              >
                <input
                  value={form.statusMessage}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, statusMessage: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Source">
                <select
                  value={form.source}
                  onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                >
                  {trackingSources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Tracked At">
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.trackedAt)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      trackedAt: fromDatetimeLocal(e.target.value),
                    }))
                  }
                />
              </ProductFormField>
            </div>
          </section>
        </div>
        <div className="admin-product-form-footer">
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => router.push(LIST_PATH)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
