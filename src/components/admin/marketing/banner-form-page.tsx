"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { fileToDataUrl } from "@/services/catalog-categories";
import {
  createBanner,
  fetchBanner,
  fetchMarketingMetaOptions,
  updateBanner,
} from "@/services/marketing-api";
import type { CatalogOption } from "@/types/catalog";
import type { BannerFormValues, BannerItem, BannerPosition } from "@/types/marketing";

const LIST_PATH = "/admin/marketing/banners";

const emptyForm: BannerFormValues = {
  bannerPositionId: "",
  categoryId: "",
  title: "",
  subtitle: "",
  imageUrl: "",
  mobileImageUrl: "",
  linkUrl: "",
  linkType: "",
  displayOrder: 0,
  startsAt: "",
  endsAt: "",
  isActive: true,
};

function itemToForm(item: BannerItem): BannerFormValues {
  return {
    bannerPositionId: item.bannerPositionId,
    categoryId: item.categoryId ?? "",
    title: item.title,
    subtitle: item.subtitle ?? "",
    imageUrl: item.imageUrl ?? "",
    mobileImageUrl: item.mobileImageUrl ?? "",
    linkUrl: item.linkUrl ?? "",
    linkType: item.linkType ?? "",
    displayOrder: item.displayOrder,
    startsAt: item.startsAt ?? "",
    endsAt: item.endsAt ?? "",
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; bannerId?: string };

export function BannerFormPage({ mode, bannerId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<BannerFormValues>(emptyForm);
  const [positions, setPositions] = useState<BannerPosition[]>([]);
  const [categories, setCategories] = useState<CatalogOption[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadMeta = useCallback(async () => {
    try {
      const meta = await fetchMarketingMetaOptions();
      setPositions(meta.bannerPositions);
      setCategories(meta.categories);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load options"));
    }
  }, []);

  const load = useCallback(async () => {
    if (mode !== "edit" || !bannerId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchBanner(bannerId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load banner"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, bannerId, router]);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);
  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.bannerPositionId) e.bannerPositionId = "Position is required";
    if (!form.title.trim()) e.title = "Title is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleImage(
    file: File | undefined,
    field: "imageUrl" | "mobileImageUrl",
  ) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((p) => ({ ...p, [field]: dataUrl }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || undefined,
      };
      if (mode === "edit" && bannerId) {
        await updateBanner(bannerId, payload);
        royalToast.success("Banner updated");
      } else {
        await createBanner(payload);
        royalToast.success("Banner created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Banner" : "Add Banner";
  const imagePreview = resolveMediaUrl(form.imageUrl);
  const mobilePreview = resolveMediaUrl(form.mobileImageUrl);

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
        listLabel="Banners"
        sectionLabel="Marketing"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Banner Details</h2>
              <p>bannertbl — position, title and schedule</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField
                label="Position"
                required
                error={errors.bannerPositionId}
              >
                <select
                  value={form.bannerPositionId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bannerPositionId: e.target.value }))
                  }
                >
                  <option value="">Select position</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.positionName} ({pos.positionCode})
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Category">
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, categoryId: e.target.value }))
                  }
                >
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Title" required error={errors.title}>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Subtitle">
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Link URL">
                <input
                  value={form.linkUrl}
                  onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </ProductFormField>
              <ProductFormField label="Link Type">
                <input
                  value={form.linkType}
                  onChange={(e) => setForm((p) => ({ ...p, linkType: e.target.value }))}
                  placeholder="e.g. product, category"
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
              <ProductFormField label="Starts At">
                <input
                  type="datetime-local"
                  value={form.startsAt ? form.startsAt.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      startsAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Ends At">
                <input
                  type="datetime-local"
                  value={form.endsAt ? form.endsAt.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      endsAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    }))
                  }
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
              <h2>Images</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Desktop Image">
                <div className="admin-product-image-upload">
                  {imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Banner"
                      className="admin-product-image-preview"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => void handleImage(e.target.files?.[0], "imageUrl")}
                  />
                </div>
              </ProductFormField>
              <ProductFormField label="Mobile Image">
                <div className="admin-product-image-upload">
                  {mobilePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mobilePreview}
                      alt="Mobile banner"
                      className="admin-product-image-preview"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      void handleImage(e.target.files?.[0], "mobileImageUrl")
                    }
                  />
                </div>
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
