"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { InventoryPageHeader } from "@/components/admin/inventory/inventory-page-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createWarehouse,
  fetchWarehouse,
  updateWarehouse,
} from "@/services/inventory-api";
import type { WarehouseFormValues, WarehouseItem } from "@/types/inventory";

const LIST_PATH = "/admin/inventory/warehouses";

const emptyForm: WarehouseFormValues = {
  warehouseCode: "",
  name: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  contactPhone: "",
  contactEmail: "",
  isPrimary: false,
  isActive: true,
};

function itemToForm(item: WarehouseItem): WarehouseFormValues {
  return {
    warehouseCode: item.warehouseCode,
    name: item.name,
    addressLine1: item.addressLine1 ?? "",
    addressLine2: item.addressLine2 ?? "",
    city: item.city ?? "",
    state: item.state ?? "",
    pincode: item.pincode ?? "",
    country: item.country ?? "India",
    contactPhone: item.contactPhone ?? "",
    contactEmail: item.contactEmail ?? "",
    isPrimary: item.isPrimary,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; warehouseId?: string };

export function WarehouseFormPage({ mode, warehouseId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<WarehouseFormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (mode !== "edit" || !warehouseId) return;
    setLoading(true);
    try {
      const item = await fetchWarehouse(warehouseId);
      setForm(itemToForm(item));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load warehouse"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, warehouseId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.warehouseCode.trim()) e.warehouseCode = "Warehouse code is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      e.contactEmail = "Invalid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && warehouseId) {
        await updateWarehouse(warehouseId, form);
        royalToast.success("Warehouse updated");
      } else {
        await createWarehouse(form);
        royalToast.success("Warehouse created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Warehouse" : "Add Warehouse";

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
      <InventoryPageHeader title={title} listPath={LIST_PATH} listLabel="Warehouses" />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Basic Details</h2>
              <p>warehousetbl — code, name and status flags</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField
                label="Warehouse Code"
                required
                error={errors.warehouseCode}
              >
                <input
                  value={form.warehouseCode}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      warehouseCode: e.target.value.toUpperCase(),
                    }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Name" required error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </ProductFormField>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isPrimary}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isPrimary: e.target.checked }))
                  }
                />{" "}
                Primary warehouse
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isActive: e.target.checked }))
                  }
                />{" "}
                Active
              </label>
            </div>
          </section>
          <section className="admin-product-section-card">
            <header>
              <h2>Address</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Address Line 1" className="span-2">
                <input
                  value={form.addressLine1}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, addressLine1: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Address Line 2" className="span-2">
                <input
                  value={form.addressLine2}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, addressLine2: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="City">
                <input
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="State">
                <input
                  value={form.state}
                  onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Pincode">
                <input
                  value={form.pincode}
                  onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Country">
                <input
                  value={form.country}
                  onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                />
              </ProductFormField>
            </div>
          </section>
          <section className="admin-product-section-card">
            <header>
              <h2>Contact</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Phone">
                <input
                  value={form.contactPhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactPhone: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Email" error={errors.contactEmail}>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactEmail: e.target.value }))
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
