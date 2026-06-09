"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { createBrand, fetchBrand, updateBrand } from "@/services/catalog-brands";
import { fileToDataUrl } from "@/services/catalog-categories";
import type { BrandFormValues, BrandItem } from "@/types/brands";

const LIST_PATH = "/admin/catalog/brands";

const emptyForm: BrandFormValues = {
  name: "",
  slug: "",
  logoUrl: "",
  description: "",
  websiteUrl: "",
  displayOrder: 0,
  isActive: true,
};

function itemToForm(item: BrandItem): BrandFormValues {
  return {
    name: item.name,
    slug: item.slug,
    logoUrl: item.logoUrl ?? "",
    description: item.description ?? "",
    websiteUrl: item.websiteUrl ?? "",
    displayOrder: item.displayOrder,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; brandId?: string };

export function BrandFormPage({ mode, brandId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<BrandFormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (mode !== "edit" || !brandId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchBrand(brandId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load brand"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, brandId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Brand name is required";
    if (form.websiteUrl && !/^https?:\/\/.+/.test(form.websiteUrl)) {
      e.websiteUrl = "Website must start with http:// or https://";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogo(file?: File) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((p) => ({ ...p, logoUrl: dataUrl }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && brandId) {
        await updateBrand(brandId, form);
        royalToast.success("Brand updated");
      } else {
        await createBrand(form);
        royalToast.success("Brand created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Brand" : "Add Brand";
  const logoPreview = resolveMediaUrl(form.logoUrl);

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
        listLabel="Brands"
        sectionLabel="Catalog"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Brand Details</h2>
              <p>brandtbl — name, slug, logo and status</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Brand Name" required error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="Auto-generated from name"
                />
              </ProductFormField>
              <ProductFormField label="Display Order">
                <input
                  type="number"
                  min={0}
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Website URL" error={errors.websiteUrl}>
                <input
                  value={form.websiteUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, websiteUrl: e.target.value }))
                  }
                  placeholder="https://..."
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
          <section className="admin-product-section-card">
            <header>
              <h2>Logo</h2>
            </header>
            <div className="admin-product-image-upload">
              {logoPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt="Brand logo"
                  className="admin-product-image-preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void handleLogo(e.target.files?.[0])}
              />
            </div>
          </section>
          <section className="admin-product-section-card">
            <header>
              <h2>Description</h2>
            </header>
            <ProductFormField label="Description" className="span-2">
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </ProductFormField>
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
