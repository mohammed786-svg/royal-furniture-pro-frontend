"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { InventoryPageHeader } from "@/components/admin/inventory/inventory-page-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createAdjustment,
  fetchAdjustment,
  fetchInventoryOptions,
  fetchStock,
  updateAdjustmentStatus,
} from "@/services/inventory-api";
import type {
  AdjustmentFormValues,
  AdjustmentItem,
  InventoryOptions,
  StockItem,
} from "@/types/inventory";

const LIST_PATH = "/admin/inventory/adjustments";

const emptyForm: AdjustmentFormValues = {
  inventoryId: "",
  warehouseId: "",
  adjustmentType: "INCREASE",
  quantity: 1,
  reason: "",
};

type Props = { mode: "create" | "view"; adjustmentId?: string };

export function AdjustmentFormPage({ mode, adjustmentId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<AdjustmentFormValues>(emptyForm);
  const [detail, setDetail] = useState<AdjustmentItem | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [options, setOptions] = useState<InventoryOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const opts = await fetchInventoryOptions();
      setOptions(opts);
      if (mode === "create") {
        const stock = await fetchStock({ pageSize: 200 });
        setStockItems(stock.items);
      } else if (adjustmentId) {
        setDetail(await fetchAdjustment(adjustmentId));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, adjustmentId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function onStockSelect(inventoryId: string) {
    const item = stockItems.find((s) => s.id === inventoryId);
    setForm((p) => ({
      ...p,
      inventoryId,
      warehouseId: item?.warehouseId ?? "",
    }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.inventoryId || !form.quantity || !form.reason.trim()) {
      royalToast.error("Fill all required fields");
      return;
    }
    setSaving(true);
    try {
      await createAdjustment(form);
      royalToast.success("Adjustment created (pending approval)");
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(status: "APPROVED" | "REJECTED") {
    if (!adjustmentId || !window.confirm(`${status} this adjustment?`)) return;
    setSaving(true);
    try {
      await updateAdjustmentStatus(adjustmentId, status);
      royalToast.success(`Adjustment ${status.toLowerCase()}`);
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Action failed"));
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

  if (mode === "view" && detail) {
    return (
      <div className="admin-product-form-page">
        <InventoryPageHeader
          title={`Adjustment #${detail.id}`}
          listPath={LIST_PATH}
          listLabel="Adjustments"
        />
        <div className="admin-product-form-card">
          <div className="admin-product-form-body">
            <section className="admin-product-section-card">
              <header>
                <h2>Adjustment Details</h2>
              </header>
              <div className="admin-inventory-detail-grid">
                <div>
                  <span>Product</span>
                  <strong>{detail.productName}</strong>
                </div>
                <div>
                  <span>Warehouse</span>
                  <strong>{detail.warehouseName}</strong>
                </div>
                <div>
                  <span>Type</span>
                  <strong>{detail.adjustmentType}</strong>
                </div>
                <div>
                  <span>Quantity</span>
                  <strong>{detail.quantity}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{detail.status}</strong>
                </div>
                <div>
                  <span>Current Stock</span>
                  <strong>{detail.currentAvailableStock}</strong>
                </div>
                <div className="span-2">
                  <span>Reason</span>
                  <strong>{detail.reason}</strong>
                </div>
              </div>
            </section>
          </div>
          <div className="admin-product-form-footer">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => router.push(LIST_PATH)}
            >
              Back
            </button>
            {detail.status === "PENDING" && (
              <>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                  onClick={() => void handleStatus("APPROVED")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  disabled={saving}
                  onClick={() => void handleStatus("REJECTED")}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">
      <InventoryPageHeader
        title="New Stock Adjustment"
        listPath={LIST_PATH}
        listLabel="Adjustments"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Adjustment</h2>
              <p>stock_adjustmenttbl — creates PENDING adjustment for approval</p>
            </header>
            <div className="admin-product-section-grid single-col">
              <ProductFormField label="Inventory Record" required>
                <select
                  value={form.inventoryId}
                  onChange={(e) => onStockSelect(e.target.value)}
                  required
                >
                  <option value="">Select stock record</option>
                  {stockItems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.productName}
                      {s.variantName ? ` (${s.variantName})` : ""} @ {s.warehouseName} —
                      Avail: {s.availableStock}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Adjustment Type" required>
                <select
                  value={form.adjustmentType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, adjustmentType: e.target.value }))
                  }
                >
                  {(options?.adjustmentTypes ?? []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Quantity" required>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, quantity: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Reason" required>
                <textarea
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  placeholder="Why is this adjustment needed?"
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
            {saving ? "Saving..." : "Submit Adjustment"}
          </button>
        </div>
      </form>
    </div>
  );
}
