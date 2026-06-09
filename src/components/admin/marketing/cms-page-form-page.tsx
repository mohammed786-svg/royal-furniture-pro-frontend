"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { createCmsPage, fetchCmsPage, updateCmsPage } from "@/services/marketing-api";
import type { CmsPageFormValues, CmsPageItem } from "@/types/marketing";

const LIST_PATH = "/admin/marketing/cms";

const emptyForm: CmsPageFormValues = {
  pageCode: "",
  title: "",
  slug: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  isPublished: false,
  isActive: true,
};

function itemToForm(item: CmsPageItem): CmsPageFormValues {
  return {
    pageCode: item.pageCode,
    title: item.title,
    slug: item.slug,
    content: item.content ?? "",
    seoTitle: item.seoTitle ?? "",
    seoDescription: item.seoDescription ?? "",
    seoKeywords: item.seoKeywords ?? "",
    isPublished: item.isPublished,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; pageId?: string };

export function CmsPageFormPage({ mode, pageId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CmsPageFormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (mode !== "edit" || !pageId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchCmsPage(pageId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load CMS page"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, pageId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.pageCode.trim()) e.pageCode = "Page code is required";
    if (!form.title.trim()) e.title = "Title is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && pageId) {
        await updateCmsPage(pageId, form);
        royalToast.success("CMS page updated");
      } else {
        await createCmsPage(form);
        royalToast.success("CMS page created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit CMS Page" : "Add CMS Page";

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
        listLabel="CMS Pages"
        sectionLabel="Marketing"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Page Details</h2>
              <p>cmspagetbl — code, title and content</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Page Code" required error={errors.pageCode}>
                <input
                  value={form.pageCode}
                  onChange={(e) => setForm((p) => ({ ...p, pageCode: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Title" required error={errors.title}>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="Auto-generated from title"
                />
              </ProductFormField>
            </div>
            <ProductFormField label="Content" className="span-2">
              <textarea
                rows={10}
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              />
            </ProductFormField>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isPublished: e.target.checked }))
                  }
                />{" "}
                Published
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
              <h2>SEO</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="SEO Title">
                <input
                  value={form.seoTitle}
                  onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="SEO Keywords">
                <input
                  value={form.seoKeywords}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, seoKeywords: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="SEO Description" className="span-2">
                <textarea
                  rows={3}
                  value={form.seoDescription}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, seoDescription: e.target.value }))
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
