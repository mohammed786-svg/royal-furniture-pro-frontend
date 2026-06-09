"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchOrderOptions, fetchOrders, initiateReturn } from "@/services/orders-api";
import type { OrderListItem, OrderOptions, ReturnFormValues } from "@/types/orders";

const LIST_PATH = "/admin/orders/returns";

const emptyForm: ReturnFormValues = {
  orderId: "",
  statusCode: "RETURNED",
  reason: "",
};

export function ReturnFormPage() {
  const router = useRouter();
  const [form, setForm] = useState<ReturnFormValues>(emptyForm);
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
    if (!form.orderId || !form.reason.trim()) {
      royalToast.error("Order and reason are required");
      return;
    }
    setSaving(true);
    try {
      const order = await initiateReturn(form);
      royalToast.success("Return initiated");
      router.push(`/admin/orders/${order.id}`);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to initiate return"));
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

  const returnStatuses = (options?.statuses ?? []).filter((s) =>
    ["RETURNED", "REFUNDED"].includes(s.statusCode),
  );

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title="Initiate Return"
        listPath={LIST_PATH}
        listLabel="Returns"
        sectionLabel="Orders"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Return Details</h2>
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
                      {o.orderNumber} — {o.customerName} ({o.currentStatus})
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Return Status" required>
                <select
                  value={form.statusCode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, statusCode: e.target.value }))
                  }
                >
                  {returnStatuses.length > 0 ? (
                    returnStatuses.map((s) => (
                      <option key={s.id} value={s.statusCode}>
                        {s.statusName}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="RETURNED">Returned</option>
                      <option value="REFUNDED">Refunded</option>
                    </>
                  )}
                </select>
              </ProductFormField>
              <ProductFormField label="Reason" required className="span-2">
                <textarea
                  rows={4}
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  placeholder="Reason for return/refund..."
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
            {saving ? "Processing..." : "Initiate Return"}
          </button>
        </div>
      </form>
    </div>
  );
}
