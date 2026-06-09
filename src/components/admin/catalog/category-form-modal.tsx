"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { fileToDataUrl } from "@/services/catalog-categories";
import type {
  CatalogOption,
  CategoryFormValues,
  CategoryLevel,
  SubCategoryOption,
} from "@/types/catalog";

type CategoryFormModalProps = {
  open: boolean;
  level: CategoryLevel;
  initial?: Partial<CategoryFormValues>;
  categories: CatalogOption[];
  subCategories: SubCategoryOption[];
  onClose: () => void;
  onSubmit: (values: Partial<CategoryFormValues>) => Promise<void>;
  loading?: boolean;
};

const emptyForm: CategoryFormValues = {
  name: "",
  slug: "",
  imageUrl: "",
  iconUrl: "",
  bannerUrl: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  displayOrder: 0,
  isVisible: true,
  isFeatured: false,
  isActive: true,
  categoryId: "",
  subCategoryId: "",
};

export function CategoryFormModal({
  open,
  level,
  initial,
  categories,
  subCategories,
  onClose,
  onSubmit,
  loading,
}: CategoryFormModalProps) {
  const [form, setForm] = useState<CategoryFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm({ ...emptyForm, ...initial });
    setError("");
  }, [open, initial]);

  if (!open) return null;

  const title =
    level === "categories"
      ? initial?.name
        ? "Edit Category"
        : "Add Category"
      : level === "sub-categories"
        ? initial?.name
          ? "Edit Sub Category"
          : "Add Sub Category"
        : initial?.name
          ? "Edit Under Sub Category"
          : "Add Under Sub Category";

  async function handleImage(field: "imageUrl" | "iconUrl" | "bannerUrl", file?: File) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((prev) => ({ ...prev, [field]: dataUrl }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const filteredSubCategories = subCategories.filter(
    (item) => !form.categoryId || item.categoryId === form.categoryId,
  );

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="admin-modal-body">
          {error && <p className="admin-form-error">{error}</p>}

          {(level === "sub-categories" || level === "under-sub-categories") && (
            <div className="admin-form-group">
              <label>Category</label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    categoryId: e.target.value,
                    subCategoryId: "",
                  }))
                }
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {level === "under-sub-categories" && (
            <div className="admin-form-group">
              <label>Sub Category</label>
              <select
                value={form.subCategoryId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, subCategoryId: e.target.value }))
                }
                required
              >
                <option value="">Select sub category</option>
                {filteredSubCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="admin-form-row-2">
            <div className="admin-form-group">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="auto-generated if empty"
              />
            </div>
          </div>

          <div className="admin-form-row-2">
            <div className="admin-form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))
                }
              />
            </div>
            <div className="admin-form-group admin-form-checks">
              <label>
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isVisible: e.target.checked }))
                  }
                />
                Visible in navigation
              </label>
              {level === "categories" && (
                <label>
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, isFeatured: e.target.checked }))
                    }
                  />
                  Featured
                </label>
              )}
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
          </div>

          <div className="admin-form-group">
            <label>Category Image</label>
            <div className="admin-image-upload">
              {form.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveMediaUrl(form.imageUrl) ?? form.imageUrl}
                  alt="Preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage("imageUrl", e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="admin-form-row-2">
            <div className="admin-form-group">
              <label>SEO Title</label>
              <input
                value={form.seoTitle}
                onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
              />
            </div>
            <div className="admin-form-group">
              <label>SEO Keywords</label>
              <input
                value={form.seoKeywords}
                onChange={(e) =>
                  setForm((p) => ({ ...p, seoKeywords: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>SEO Description</label>
            <textarea
              rows={3}
              value={form.seoDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, seoDescription: e.target.value }))
              }
            />
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
