"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { addTracking, fetchOrderOptions, fetchOrders } from "@/services/orders-api";
import type { OrderListItem, OrderOptions, TrackingFormValues } from "@/types/orders";

const LIST_PATH = "/admin/orders/tracking";

const emptyForm: TrackingFormValues = {
  orderId: "",
  statusCode: "",
  statusMessage: "",
  location: "",
  trackedAt: "",
  isCustomerVisible: true,
};

export function TrackingFormPage() {
  const router = useRouter();
  const [form, setForm] = useState<TrackingFormValues>(emptyForm);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [options, setOptions] = useState<OrderOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [opts, orderData] = await Promise.all([
        fetchOrderOptions(),
        fetchOrders({ pageSize: 100, sortBy: "created_at", sortDir: "desc" }),
      ]);
      setOptions(opts);
      setOrders(orderData.items);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.orderId || !form.statusCode.trim()) {
      royalToast.error("Order and status code are required");
      return;
    }
    setSaving(true);
    try {
      await addTracking({
        ...form,
        statusMessage: form.statusMessage || form.statusCode,
        trackedAt: form.trackedAt || new Date().toISOString(),
      });
      royalToast.success("Tracking event added");
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to add tracking"));
    } finally {
      setSaving(false);
    }
  }

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
        title="Add Tracking Event"
        listPath={LIST_PATH}
        listLabel="Tracking"
        sectionLabel="Orders"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Tracking Details</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Order" required>
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
              <ProductFormField label="Status Code" required>
                <select
                  value={form.statusCode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, statusCode: e.target.value }))
                  }
                >
                  <option value="">Select status</option>
                  {(options?.statuses ?? []).map((s) => (
                    <option key={s.id} value={s.statusCode}>
                      {s.statusName} ({s.statusCode})
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Status Message">
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
              <ProductFormField label="Tracked At">
                <input
                  type="datetime-local"
                  value={form.trackedAt ? form.trackedAt.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      trackedAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    }))
                  }
                />
              </ProductFormField>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isCustomerVisible}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isCustomerVisible: e.target.checked }))
                  }
                />
                Visible to customer
              </label>
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
            {saving ? "Saving..." : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
