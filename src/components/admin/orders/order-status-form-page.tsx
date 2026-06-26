"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createOrderStatus,
  fetchOrderStatus,
  updateOrderStatus,
} from "@/services/orders-api";
import type { OrderStatusFormValues, OrderStatusItem } from "@/types/orders";

const LIST_PATH = "/my-admin/orders/status";

const emptyForm: OrderStatusFormValues = {
  statusCode: "",
  statusName: "",
  description: "",
  displayOrder: 0,
  isTerminal: false,
  isActive: true,
};

function itemToForm(item: OrderStatusItem): OrderStatusFormValues {
  return {
    statusCode: item.statusCode,
    statusName: item.statusName,
    description: item.description ?? "",
    displayOrder: item.displayOrder,
    isTerminal: item.isTerminal,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; statusId?: string };

export function OrderStatusFormPage({ mode, statusId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<OrderStatusFormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (mode !== "edit" || !statusId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchOrderStatus(statusId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load status"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, statusId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.statusCode.trim()) e.statusCode = "Status code is required";
    if (!form.statusName.trim()) e.statusName = "Status name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && statusId) {
        await updateOrderStatus(statusId, form);
        royalToast.success("Status updated");
      } else {
        await createOrderStatus(form);
        royalToast.success("Status created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Order Status" : "Add Order Status";

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
        listLabel="Order Status"
        sectionLabel="Orders"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Status Details</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Status Code" required error={errors.statusCode}>
                <input
                  value={form.statusCode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, statusCode: e.target.value.toUpperCase() }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Status Name" required error={errors.statusName}>
                <input
                  value={form.statusName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, statusName: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Display Order">
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Description" className="span-2">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </ProductFormField>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isTerminal}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isTerminal: e.target.checked }))
                  }
                />
                Terminal status
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isActive: e.target.checked }))
                  }
                />
                Active
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
            {saving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
