"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createAdminUser,
  fetchAdministrationMetaOptions,
  fetchAdminUser,
  updateAdminUser,
} from "@/services/administration-api";
import type {
  AdminRoleOption,
  AdminUserFormValues,
  AdminUserItem,
} from "@/types/admin-users";

const LIST_PATH = "/my-admin/administration/users";

const emptyForm: AdminUserFormValues = {
  email: "",
  fullName: "",
  phone: "",
  roleId: "",
  password: "",
  isActive: true,
};

function itemToForm(item: AdminUserItem): AdminUserFormValues {
  return {
    email: item.email,
    fullName: item.fullName,
    phone: item.phone ?? "",
    roleId: item.roleId,
    password: "",
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; userId?: string };

export function AdminUserFormPage({ mode, userId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<AdminUserFormValues>(emptyForm);
  const [roles, setRoles] = useState<AdminRoleOption[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    void fetchAdministrationMetaOptions()
      .then((opts) => setRoles(opts.roles))
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    if (mode !== "edit" || !userId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchAdminUser(userId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load admin user"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, userId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.roleId) e.roleId = "Role is required";
    if (mode === "create" && !form.password) e.password = "Password is required";
    if (form.password && form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Partial<AdminUserFormValues> = {
        email: form.email,
        fullName: form.fullName,
        phone: form.phone || undefined,
        roleId: form.roleId,
        isActive: form.isActive,
      };
      if (form.password) payload.password = form.password;

      if (mode === "edit" && userId) {
        await updateAdminUser(userId, payload);
        royalToast.success("Admin user updated");
      } else {
        await createAdminUser(payload);
        royalToast.success("Admin user created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Admin User" : "Add Admin User";

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
        listLabel="Admin Users"
        sectionLabel="Administration"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Account Details</h2>
              <p>admintbl — email, name, role and status</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Full Name" required error={errors.fullName}>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Email" required error={errors.email}>
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
              <ProductFormField label="Role" required error={errors.roleId}>
                <select
                  value={form.roleId}
                  onChange={(e) => setForm((p) => ({ ...p, roleId: e.target.value }))}
                >
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField
                label={mode === "create" ? "Password" : "New Password (optional)"}
                required={mode === "create"}
                error={errors.password}
              >
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder={mode === "edit" ? "Leave blank to keep current" : ""}
                />
              </ProductFormField>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
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
