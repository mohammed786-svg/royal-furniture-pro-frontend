"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createShipment,
  fetchShipment,
  fetchShippingMetaOptions,
  updateShipment,
} from "@/services/shipping-api";
import type { ShipmentFormValues, ShipmentItem } from "@/types/shipping";

const LIST_PATH = "/admin/shipping";

const emptyForm: ShipmentFormValues = {
  orderId: "",
  shiprocketOrderId: "",
  shipmentIdExternal: "",
  awbNumber: "",
  courierName: "",
  trackingNumber: "",
  pickupStatus: "NA",
  deliveryStatus: "PENDING",
  shippingLabelUrl: "",
  estimatedDeliveryDate: "",
  shippedAt: "",
  deliveredAt: "",
};

function itemToForm(item: ShipmentItem): ShipmentFormValues {
  return {
    orderId: item.orderId,
    shiprocketOrderId: item.shiprocketOrderId ?? "",
    shipmentIdExternal: item.shipmentIdExternal ?? "",
    awbNumber: item.awbNumber ?? "",
    courierName: item.courierName ?? "",
    trackingNumber: item.trackingNumber ?? "",
    pickupStatus: item.pickupStatus ?? "NA",
    deliveryStatus: item.deliveryStatus ?? "PENDING",
    shippingLabelUrl: item.shippingLabelUrl ?? "",
    estimatedDeliveryDate: item.estimatedDeliveryDate ?? "",
    shippedAt: item.shippedAt ?? "",
    deliveredAt: item.deliveredAt ?? "",
  };
}

function toDatetimeLocal(value: string) {
  return value ? value.slice(0, 16) : "";
}

function fromDatetimeLocal(value: string) {
  return value ? new Date(value).toISOString() : "";
}

type Props = { mode: "create" | "edit"; shipmentId?: string };

export function ShipmentFormPage({ mode, shipmentId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ShipmentFormValues>(emptyForm);
  const [orders, setOrders] = useState<
    { id: string; orderNumber: string; customerName: string }[]
  >([]);
  const [pickupStatuses, setPickupStatuses] = useState<string[]>([]);
  const [deliveryStatuses, setDeliveryStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const meta = await fetchShippingMetaOptions();
      setOrders(meta.orders);
      setPickupStatuses(meta.pickupStatuses);
      setDeliveryStatuses(meta.deliveryStatuses);
      if (mode === "edit" && shipmentId) {
        setForm(itemToForm(await fetchShipment(shipmentId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load shipment"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, shipmentId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.orderId) e.orderId = "Order is required";
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
        shiprocketOrderId: form.shiprocketOrderId || undefined,
        shipmentIdExternal: form.shipmentIdExternal || undefined,
        awbNumber: form.awbNumber || undefined,
        courierName: form.courierName || undefined,
        trackingNumber: form.trackingNumber || undefined,
        shippingLabelUrl: form.shippingLabelUrl || undefined,
        estimatedDeliveryDate: form.estimatedDeliveryDate || undefined,
        shippedAt: form.shippedAt || undefined,
        deliveredAt: form.deliveredAt || undefined,
      };
      if (mode === "edit" && shipmentId) {
        await updateShipment(shipmentId, payload);
        royalToast.success("Shipment updated");
      } else {
        await createShipment(payload);
        royalToast.success("Shipment created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Shipment" : "Add Shipment";

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
        listLabel="Shipments"
        sectionLabel="Shipping"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Shipment Details</h2>
              <p>shipmenttbl — order, courier and delivery status</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Order" required error={errors.orderId}>
                <select
                  value={form.orderId}
                  onChange={(e) => setForm((p) => ({ ...p, orderId: e.target.value }))}
                >
                  <option value="">Select order</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} — {o.customerName}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Shiprocket Order ID">
                <input
                  value={form.shiprocketOrderId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, shiprocketOrderId: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="External Shipment ID">
                <input
                  value={form.shipmentIdExternal}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, shipmentIdExternal: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="AWB Number">
                <input
                  value={form.awbNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, awbNumber: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Courier">
                <input
                  value={form.courierName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, courierName: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Tracking Number">
                <input
                  value={form.trackingNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, trackingNumber: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Pickup Status">
                <select
                  value={form.pickupStatus}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pickupStatus: e.target.value }))
                  }
                >
                  {pickupStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Delivery Status">
                <select
                  value={form.deliveryStatus}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, deliveryStatus: e.target.value }))
                  }
                >
                  {deliveryStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Shipping Label URL">
                <input
                  value={form.shippingLabelUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, shippingLabelUrl: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Estimated Delivery">
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.estimatedDeliveryDate)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      estimatedDeliveryDate: fromDatetimeLocal(e.target.value),
                    }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Shipped At">
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.shippedAt)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      shippedAt: fromDatetimeLocal(e.target.value),
                    }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Delivered At">
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.deliveredAt)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      deliveredAt: fromDatetimeLocal(e.target.value),
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
