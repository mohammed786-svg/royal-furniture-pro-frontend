"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createSetting,
  fetchSetting,
  fetchSettingGroups,
  updateSetting,
} from "@/services/settings-api";
import {
  SETTING_VALUE_TYPES,
  type SettingFormValues,
  type SettingItem,
} from "@/types/settings";

const LIST_PATH = "/admin/settings";

const emptyForm: SettingFormValues = {
  settingKey: "",
  settingValue: "",
  settingGroup: "",
  valueType: "TEXT",
  description: "",
  isActive: true,
};

function itemToForm(item: SettingItem): SettingFormValues {
  return {
    settingKey: item.settingKey,
    settingValue: item.settingValue,
    settingGroup: item.settingGroup,
    valueType: item.valueType,
    description: item.description ?? "",
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; settingId?: string };

export function SettingFormPage({ mode, settingId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<SettingFormValues>(emptyForm);
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    void fetchSettingGroups()
      .then(setGroups)
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    if (mode !== "edit" || !settingId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchSetting(settingId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load setting"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, settingId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.settingKey.trim()) e.settingKey = "Setting key is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && settingId) {
        await updateSetting(settingId, form);
        royalToast.success("Setting updated");
      } else {
        await createSetting(form);
        royalToast.success("Setting created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Setting" : "Add Setting";

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
        listLabel="Settings"
        sectionLabel="Settings"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Setting Details</h2>
              <p>settingtbl — key, value, group and type</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Key" required error={errors.settingKey}>
                <input
                  value={form.settingKey}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, settingKey: e.target.value }))
                  }
                  placeholder="e.g. store.name"
                />
              </ProductFormField>
              <ProductFormField label="Group">
                <input
                  value={form.settingGroup}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, settingGroup: e.target.value }))
                  }
                  list="setting-groups"
                  placeholder="e.g. general"
                />
                <datalist id="setting-groups">
                  {groups.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </ProductFormField>
              <ProductFormField label="Value Type">
                <select
                  value={form.valueType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, valueType: e.target.value }))
                  }
                >
                  {SETTING_VALUE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Value">
                <input
                  value={form.settingValue}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, settingValue: e.target.value }))
                  }
                />
              </ProductFormField>
            </div>
            <ProductFormField label="Description" className="span-2">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </ProductFormField>
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
