"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { InventoryPageHeader } from "@/components/admin/inventory/inventory-page-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createTransfer,
  fetchInventoryOptions,
  fetchTransfer,
  updateTransferStatus,
} from "@/services/inventory-api";
import type {
  InventoryOptions,
  TransferFormValues,
  TransferItem,
} from "@/types/inventory";

const LIST_PATH = "/my-admin/inventory/transfers";

const emptyForm: TransferFormValues = {
  productId: "",
  productVariantId: "",
  fromWarehouseId: "",
  toWarehouseId: "",
  quantity: 1,
  notes: "",
};

type Props = { mode: "create" | "view"; transferId?: string };

export function TransferFormPage({ mode, transferId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<TransferFormValues>(emptyForm);
  const [detail, setDetail] = useState<TransferItem | null>(null);
  const [options, setOptions] = useState<InventoryOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOptions(await fetchInventoryOptions());
      if (mode === "view" && transferId) {
        setDetail(await fetchTransfer(transferId));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, transferId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const variants = useMemo(
    () =>
      options?.variants.filter(
        (v) => !form.productId || v.productId === form.productId,
      ) ?? [],
    [options, form.productId],
  );

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (
      !form.productId ||
      !form.fromWarehouseId ||
      !form.toWarehouseId ||
      form.quantity < 1
    ) {
      royalToast.error("Fill all required fields");
      return;
    }
    if (form.fromWarehouseId === form.toWarehouseId) {
      royalToast.error("Source and destination warehouses must differ");
      return;
    }
    setSaving(true);
    try {
      await createTransfer({
        ...form,
        productVariantId: form.productVariantId || undefined,
      } as TransferFormValues);
      royalToast.success("Transfer created");
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  async function completeTransfer() {
    if (!transferId || !window.confirm("Complete this transfer?")) return;
    setSaving(true);
    try {
      await updateTransferStatus(transferId, "COMPLETED");
      royalToast.success("Transfer completed");
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed"));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !options) {
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
          title={`Transfer #${detail.id}`}
          listPath={LIST_PATH}
          listLabel="Transfers"
        />
        <div className="admin-product-form-card">
          <div className="admin-product-form-body">
            <section className="admin-product-section-card">
              <div className="admin-inventory-detail-grid">
                <div>
                  <span>Product</span>
                  <strong>{detail.productName}</strong>
                </div>
                <div>
                  <span>From</span>
                  <strong>{detail.fromWarehouseName}</strong>
                </div>
                <div>
                  <span>To</span>
                  <strong>{detail.toWarehouseName}</strong>
                </div>
                <div>
                  <span>Quantity</span>
                  <strong>{detail.quantity}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{detail.status}</strong>
                </div>
                <div className="span-2">
                  <span>Notes</span>
                  <strong>{detail.notes || "—"}</strong>
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
            {(detail.status === "PENDING" || detail.status === "IN_TRANSIT") && (
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                disabled={saving}
                onClick={() => void completeTransfer()}
              >
                Complete Transfer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">
      <InventoryPageHeader
        title="New Stock Transfer"
        listPath={LIST_PATH}
        listLabel="Transfers"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Transfer Details</h2>
              <p>stock_transfertbl — move stock between warehouses</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Product" required>
                <select
                  value={form.productId}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      productId: e.target.value,
                      productVariantId: "",
                    }))
                  }
                >
                  <option value="">Select product</option>
                  {options.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Variant">
                <select
                  value={form.productVariantId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, productVariantId: e.target.value }))
                  }
                >
                  <option value="">No variant</option>
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.variantName}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="From Warehouse" required>
                <select
                  value={form.fromWarehouseId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fromWarehouseId: e.target.value }))
                  }
                >
                  <option value="">Select source</option>
                  {options.warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="To Warehouse" required>
                <select
                  value={form.toWarehouseId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, toWarehouseId: e.target.value }))
                  }
                >
                  <option value="">Select destination</option>
                  {options.warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
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
              <ProductFormField label="Notes" className="span-2">
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
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
            {saving ? "Saving..." : "Create Transfer"}
          </button>
        </div>
      </form>
    </div>
  );
}
