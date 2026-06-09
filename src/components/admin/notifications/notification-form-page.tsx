"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createNotification,
  fetchNotification,
  fetchNotificationMetaOptions,
  updateNotification,
} from "@/services/notifications-api";
import type { NotificationFormValues, NotificationItem } from "@/types/notifications";

const LIST_PATH = "/admin/notifications";

const emptyForm: NotificationFormValues = {
  title: "",
  message: "",
  channel: "EMAIL",
  templateCode: "",
  targetType: "ALL",
  isActive: true,
};

function itemToForm(item: NotificationItem): NotificationFormValues {
  return {
    title: item.title,
    message: item.message,
    channel: item.channel,
    templateCode: item.templateCode ?? "",
    targetType: item.targetType,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; notificationId?: string };

export function NotificationFormPage({ mode, notificationId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<NotificationFormValues>(emptyForm);
  const [channels, setChannels] = useState<string[]>([]);
  const [targetTypes, setTargetTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    void fetchNotificationMetaOptions()
      .then((opts) => {
        setChannels(opts.channels);
        setTargetTypes(opts.targetTypes);
      })
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    if (mode !== "edit" || !notificationId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchNotification(notificationId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load notification"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, notificationId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (!form.channel) e.channel = "Channel is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && notificationId) {
        await updateNotification(notificationId, form);
        royalToast.success("Notification updated");
      } else {
        await createNotification(form);
        royalToast.success("Notification created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Notification" : "Add Notification";

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
        listLabel="Notifications"
        sectionLabel="Notifications"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Notification Details</h2>
              <p>notificationtbl — title, message, channel and target</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Title" required error={errors.title}>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Channel" required error={errors.channel}>
                <select
                  value={form.channel}
                  onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))}
                >
                  {channels.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Target Type">
                <select
                  value={form.targetType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, targetType: e.target.value }))
                  }
                >
                  {targetTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Template Code">
                <input
                  value={form.templateCode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, templateCode: e.target.value }))
                  }
                  placeholder="Optional template identifier"
                />
              </ProductFormField>
            </div>
            <ProductFormField
              label="Message"
              required
              error={errors.message}
              className="span-2"
            >
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
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
