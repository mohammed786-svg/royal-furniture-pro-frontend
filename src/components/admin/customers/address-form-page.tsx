"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createAddress,
  fetchAddress,
  fetchCustomerOptions,
  fetchCustomers,
  updateAddress,
} from "@/services/customers-api";
import type {
  AddressFormValues,
  AddressItem,
  CustomerItem,
  CustomerOptions,
} from "@/types/customers";

const LIST_PATH = "/my-admin/customers/addresses";

const emptyForm: AddressFormValues = {
  customerId: "",
  addressType: "SHIPPING",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
  isActive: true,
};

function itemToForm(item: AddressItem): AddressFormValues {
  return {
    customerId: item.customerId,
    addressType: item.addressType,
    fullName: item.fullName,
    phone: item.phone,
    addressLine1: item.addressLine1,
    addressLine2: item.addressLine2 ?? "",
    landmark: item.landmark ?? "",
    city: item.city,
    state: item.state,
    pincode: item.pincode,
    country: item.country,
    isDefault: item.isDefault,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; addressId?: string };

export function AddressFormPage({ mode, addressId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<AddressFormValues>(emptyForm);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [options, setOptions] = useState<CustomerOptions | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [opts, custData] = await Promise.all([
        fetchCustomerOptions(),
        fetchCustomers({ pageSize: 200 }),
      ]);
      setOptions(opts);
      setCustomers(custData.items);
      if (mode === "edit" && addressId) {
        setForm(itemToForm(await fetchAddress(addressId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, addressId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = "Customer is required";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && addressId) {
        await updateAddress(addressId, form);
        royalToast.success("Address updated");
      } else {
        await createAddress(form);
        royalToast.success("Address created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Address" : "Add Address";

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
        listLabel="Addresses"
        sectionLabel="Customers"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Address Details</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Customer" required error={errors.customerId}>
                <select
                  value={form.customerId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerId: e.target.value }))
                  }
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Address Type">
                <select
                  value={form.addressType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, addressType: e.target.value }))
                  }
                >
                  {(options?.addressTypes ?? ["SHIPPING", "BILLING", "BOTH"]).map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ),
                  )}
                </select>
              </ProductFormField>
              <ProductFormField label="Full Name">
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField
                label="Address Line 1"
                required
                error={errors.addressLine1}
                className="span-2"
              >
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
              <ProductFormField label="Landmark">
                <input
                  value={form.landmark}
                  onChange={(e) => setForm((p) => ({ ...p, landmark: e.target.value }))}
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
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isDefault: e.target.checked }))
                  }
                />
                Default address
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
