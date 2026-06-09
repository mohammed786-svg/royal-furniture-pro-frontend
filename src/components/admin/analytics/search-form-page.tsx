"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { createSearch, fetchSearch, updateSearch } from "@/services/analytics-api";
import type { SearchHistoryFormValues, SearchHistoryItem } from "@/types/analytics";

const LIST_PATH = "/admin/analytics/search";

const emptyForm: SearchHistoryFormValues = {
  searchQuery: "",
  customerId: "",
  sessionId: "",
  resultsCount: 0,
  clickedProductId: "",
  ipAddress: "",
  searchedAt: "",
};

function itemToForm(item: SearchHistoryItem): SearchHistoryFormValues {
  return {
    searchQuery: item.searchQuery,
    customerId: item.customerId ?? "",
    sessionId: item.sessionId,
    resultsCount: item.resultsCount,
    clickedProductId: item.clickedProductId ?? "",
    ipAddress: item.ipAddress ?? "",
    searchedAt: item.searchedAt ?? "",
  };
}

function formToPayload(form: SearchHistoryFormValues) {
  return {
    searchQuery: form.searchQuery,
    customerId: form.customerId || undefined,
    sessionId: form.sessionId || undefined,
    resultsCount: form.resultsCount,
    clickedProductId: form.clickedProductId || undefined,
    ipAddress: form.ipAddress || undefined,
    searchedAt: form.searchedAt || undefined,
  };
}

type Props = { mode: "create" | "edit"; searchId?: string };

export function SearchFormPage({ mode, searchId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<SearchHistoryFormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (mode !== "edit" || !searchId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchSearch(searchId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load search record"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, searchId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.searchQuery.trim()) e.searchQuery = "Search query is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (mode === "edit" && searchId) {
        await updateSearch(searchId, payload);
        royalToast.success("Search record updated");
      } else {
        await createSearch(payload);
        royalToast.success("Search record created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Search Record" : "Add Search Record";

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
        listLabel="Search Reports"
        sectionLabel="Analytics"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Search Details</h2>
              <p>searchhistorytbl — customer search behavior</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField
                label="Search Query"
                required
                error={errors.searchQuery}
                className="span-2"
              >
                <input
                  value={form.searchQuery}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, searchQuery: e.target.value }))
                  }
                  placeholder="e.g. leather sofa"
                />
              </ProductFormField>
              <ProductFormField label="Results Count">
                <input
                  type="number"
                  min={0}
                  value={form.resultsCount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, resultsCount: Number(e.target.value) }))
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
              <ProductFormField label="Clicked Product ID">
                <input
                  value={form.clickedProductId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, clickedProductId: e.target.value }))
                  }
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
              <ProductFormField label="Searched At">
                <input
                  type="datetime-local"
                  value={form.searchedAt ? form.searchedAt.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, searchedAt: e.target.value }))
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
