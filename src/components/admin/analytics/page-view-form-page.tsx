"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createPageView,
  fetchPageView,
  updatePageView,
} from "@/services/analytics-api";
import type { PageViewFormValues, PageViewItem } from "@/types/analytics";

const LIST_PATH = "/my-admin/analytics/page-views";

const emptyForm: PageViewFormValues = {
  pageUrl: "",
  pageTitle: "",
  customerId: "",
  sessionId: "",
  categoryId: "",
  subCategoryId: "",
  productId: "",
  referrer: "",
  ipAddress: "",
  viewedAt: "",
};

function itemToForm(item: PageViewItem): PageViewFormValues {
  return {
    pageUrl: item.pageUrl,
    pageTitle: item.pageTitle,
    customerId: item.customerId ?? "",
    sessionId: item.sessionId,
    categoryId: item.categoryId ?? "",
    subCategoryId: item.subCategoryId ?? "",
    productId: item.productId ?? "",
    referrer: item.referrer ?? "",
    ipAddress: item.ipAddress ?? "",
    viewedAt: item.viewedAt ?? "",
  };
}

function formToPayload(form: PageViewFormValues) {
  return {
    pageUrl: form.pageUrl,
    pageTitle: form.pageTitle || undefined,
    customerId: form.customerId || undefined,
    sessionId: form.sessionId || undefined,
    categoryId: form.categoryId || undefined,
    subCategoryId: form.subCategoryId || undefined,
    productId: form.productId || undefined,
    referrer: form.referrer || undefined,
    ipAddress: form.ipAddress || undefined,
    viewedAt: form.viewedAt || undefined,
  };
}

type Props = { mode: "create" | "edit"; pageViewId?: string };

export function PageViewFormPage({ mode, pageViewId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PageViewFormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (mode !== "edit" || !pageViewId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchPageView(pageViewId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load page view"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, pageViewId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.pageUrl.trim()) e.pageUrl = "Page URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (mode === "edit" && pageViewId) {
        await updatePageView(pageViewId, payload);
        royalToast.success("Page view updated");
      } else {
        await createPageView(payload);
        royalToast.success("Page view created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Page View" : "Add Page View";

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
        listLabel="Page Views"
        sectionLabel="Analytics"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Page View Details</h2>
              <p>pageviewtbl — track page visits and sessions</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField
                label="Page URL"
                required
                error={errors.pageUrl}
                className="span-2"
              >
                <input
                  value={form.pageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, pageUrl: e.target.value }))}
                  placeholder="/products/sofa-set"
                />
              </ProductFormField>
              <ProductFormField label="Page Title" className="span-2">
                <input
                  value={form.pageTitle}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pageTitle: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Session ID">
                <input
                  value={form.sessionId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sessionId: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Customer ID">
                <input
                  value={form.customerId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerId: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Product ID">
                <input
                  value={form.productId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, productId: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Category ID">
                <input
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, categoryId: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Sub-Category ID">
                <input
                  value={form.subCategoryId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subCategoryId: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Referrer">
                <input
                  value={form.referrer}
                  onChange={(e) => setForm((p) => ({ ...p, referrer: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="IP Address">
                <input
                  value={form.ipAddress}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, ipAddress: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Viewed At">
                <input
                  type="datetime-local"
                  value={form.viewedAt ? form.viewedAt.slice(0, 16) : ""}
                  onChange={(e) => setForm((p) => ({ ...p, viewedAt: e.target.value }))}
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
