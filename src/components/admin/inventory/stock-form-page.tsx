"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { InventoryPageHeader } from "@/components/admin/inventory/inventory-page-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createStock,
  fetchInventoryOptions,
  fetchStockItem,
  updateStock,
} from "@/services/inventory-api";
import type { InventoryOptions, StockFormValues, StockItem } from "@/types/inventory";

const LIST_PATH = "/admin/inventory/stock";

const emptyForm: StockFormValues = {
  productId: "",
  productVariantId: "",
  warehouseId: "",
  availableStock: 0,
  reservedStock: 0,
  soldStock: 0,
  damagedStock: 0,
  returnedStock: 0,
  reorderLevel: 10,
  isActive: true,
};

function itemToForm(item: StockItem): StockFormValues {
  return {
    productId: item.productId,
    productVariantId: item.productVariantId ?? "",
    warehouseId: item.warehouseId,
    availableStock: item.availableStock,
    reservedStock: item.reservedStock,
    soldStock: item.soldStock,
    damagedStock: item.damagedStock,
    returnedStock: item.returnedStock,
    reorderLevel: item.reorderLevel,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; stockId?: string };

export function StockFormPage({ mode, stockId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<StockFormValues>(emptyForm);
  const [options, setOptions] = useState<InventoryOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const opts = await fetchInventoryOptions();
      setOptions(opts);
      if (mode === "edit" && stockId) {
        setForm(itemToForm(await fetchStockItem(stockId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, stockId, router]);

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

  function validate() {
    const e: Record<string, string> = {};
    if (!form.productId) e.productId = "Product is required";
    if (!form.warehouseId) e.warehouseId = "Warehouse is required";
    if (form.availableStock < 0) e.availableStock = "Cannot be negative";
    if (form.reorderLevel < 0) e.reorderLevel = "Cannot be negative";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, productVariantId: form.productVariantId || undefined };
      if (mode === "edit" && stockId) {
        await updateStock(stockId, payload);
        royalToast.success("Stock updated");
      } else {
        await createStock(payload);
        royalToast.success("Stock record created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
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

  const title = mode === "edit" ? "Edit Stock" : "Add Stock Record";

  return (
    <div className="admin-product-form-page">
      <InventoryPageHeader title={title} listPath={LIST_PATH} listLabel="Stock" />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Product & Warehouse</h2>
              <p>inventorytbl — unique per product + variant + warehouse</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Product" required error={errors.productId}>
                <select
                  value={form.productId}
                  disabled={mode === "edit"}
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
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Variant">
                <select
                  value={form.productVariantId}
                  disabled={mode === "edit"}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, productVariantId: e.target.value }))
                  }
                >
                  <option value="">No variant (base product)</option>
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.variantName} ({v.sku})
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Warehouse" required error={errors.warehouseId}>
                <select
                  value={form.warehouseId}
                  disabled={mode === "edit"}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, warehouseId: e.target.value }))
                  }
                >
                  <option value="">Select warehouse</option>
                  {options.warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code})
                    </option>
                  ))}
                </select>
              </ProductFormField>
            </div>
          </section>
          <section className="admin-product-section-card">
            <header>
              <h2>Stock Levels</h2>
            </header>
            <div className="admin-product-section-grid">
              {(
                [
                  "availableStock",
                  "reservedStock",
                  "soldStock",
                  "damagedStock",
                  "returnedStock",
                  "reorderLevel",
                ] as const
              ).map((field) => (
                <ProductFormField
                  key={field}
                  label={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                  error={errors[field]}
                >
                  <input
                    type="number"
                    min={0}
                    value={form[field]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [field]: Number(e.target.value) }))
                    }
                  />
                </ProductFormField>
              ))}
            </div>
            <label className="admin-inline-check">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              />{" "}
              Active
            </label>
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
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
