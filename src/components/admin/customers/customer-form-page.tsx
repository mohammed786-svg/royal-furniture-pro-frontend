"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createCustomer,
  fetchCustomer,
  fetchCustomerOptions,
  updateCustomer,
} from "@/services/customers-api";
import type {
  CustomerFormValues,
  CustomerItem,
  CustomerOptions,
} from "@/types/customers";

const LIST_PATH = "/my-admin/customers";

const emptyForm: CustomerFormValues = {
  email: "",
  phone: "",
  fullName: "",
  isGuest: false,
  isActive: true,
  profile: {
    dateOfBirth: "",
    gender: "",
    profileImage: "",
    newsletterSubscribed: false,
  },
};

function itemToForm(item: CustomerItem): CustomerFormValues {
  return {
    email: item.email,
    phone: item.phone,
    fullName: item.fullName,
    isGuest: item.isGuest,
    isActive: item.isActive,
    profile: {
      dateOfBirth: item.profile?.dateOfBirth?.slice(0, 10) ?? "",
      gender: item.profile?.gender ?? "",
      profileImage: item.profile?.profileImage ?? "",
      newsletterSubscribed: item.profile?.newsletterSubscribed ?? false,
    },
  };
}

type Props = { mode: "create" | "edit"; customerId?: string };

export function CustomerFormPage({ mode, customerId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CustomerFormValues>(emptyForm);
  const [options, setOptions] = useState<CustomerOptions | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const opts = await fetchCustomerOptions();
      setOptions(opts);
      if (mode === "edit" && customerId) {
        setForm(itemToForm(await fetchCustomer(customerId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load customer"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, customerId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && customerId) {
        await updateCustomer(customerId, form);
        royalToast.success("Customer updated");
        router.push(`/my-admin/customers/${customerId}`);
      } else {
        const item = await createCustomer(form);
        royalToast.success("Customer created");
        router.push(`/my-admin/customers/${item.id}`);
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Customer" : "Add Customer";

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
        listLabel="Customers"
        sectionLabel="Customers"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Basic Details</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Full Name" required error={errors.fullName}>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </ProductFormField>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isGuest}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isGuest: e.target.checked }))
                  }
                />
                Guest customer
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
          <section className="admin-product-section-card">
            <header>
              <h2>Profile</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Date of Birth">
                <input
                  type="date"
                  value={form.profile.dateOfBirth}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      profile: { ...p.profile, dateOfBirth: e.target.value },
                    }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Gender">
                <select
                  value={form.profile.gender}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      profile: { ...p.profile, gender: e.target.value },
                    }))
                  }
                >
                  <option value="">Select</option>
                  {(options?.genders ?? []).map((g) => (
                    <option key={g} value={g}>
                      {g.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Profile Image URL" className="span-2">
                <input
                  value={form.profile.profileImage}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      profile: { ...p.profile, profileImage: e.target.value },
                    }))
                  }
                />
              </ProductFormField>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.profile.newsletterSubscribed}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      profile: { ...p.profile, newsletterSubscribed: e.target.checked },
                    }))
                  }
                />
                Newsletter subscribed
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
