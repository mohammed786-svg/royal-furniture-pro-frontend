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
  createTestimonial,
  fetchMarketingMetaOptions,
  fetchTestimonial,
  updateTestimonial,
} from "@/services/marketing-api";
import type { CatalogProductOption } from "@/types/catalog-meta";
import type { TestimonialFormValues, TestimonialItem } from "@/types/marketing";

const LIST_PATH = "/admin/marketing/testimonials";

const emptyForm: TestimonialFormValues = {
  customerName: "",
  customerImage: "",
  location: "",
  rating: 5,
  testimonialText: "",
  productId: "",
  isFeatured: false,
  displayOrder: 0,
  isActive: true,
};

function itemToForm(item: TestimonialItem): TestimonialFormValues {
  return {
    customerName: item.customerName,
    customerImage: item.customerImage ?? "",
    location: item.location ?? "",
    rating: item.rating,
    testimonialText: item.testimonialText,
    productId: item.productId ?? "",
    isFeatured: item.isFeatured,
    displayOrder: item.displayOrder,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; testimonialId?: string };

export function TestimonialFormPage({ mode, testimonialId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<TestimonialFormValues>(emptyForm);
  const [products, setProducts] = useState<CatalogProductOption[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadMeta = useCallback(async () => {
    try {
      const meta = await fetchMarketingMetaOptions();
      setProducts(meta.products);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load options"));
    }
  }, []);

  const load = useCallback(async () => {
    if (mode !== "edit" || !testimonialId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchTestimonial(testimonialId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load testimonial"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, testimonialId, router]);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);
  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "Customer name is required";
    if (!form.testimonialText.trim())
      e.testimonialText = "Testimonial text is required";
    if (form.rating < 1 || form.rating > 5) e.rating = "Rating must be between 1 and 5";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleImage(file?: File) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((p) => ({ ...p, customerImage: dataUrl }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        productId: form.productId || undefined,
      };
      if (mode === "edit" && testimonialId) {
        await updateTestimonial(testimonialId, payload);
        royalToast.success("Testimonial updated");
      } else {
        await createTestimonial(payload);
        royalToast.success("Testimonial created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Testimonial" : "Add Testimonial";
  const imagePreview = resolveMediaUrl(form.customerImage);

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
        listLabel="Testimonials"
        sectionLabel="Marketing"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Testimonial Details</h2>
              <p>testimonialtbl — customer review and rating</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField
                label="Customer Name"
                required
                error={errors.customerName}
              >
                <input
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerName: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Product">
                <select
                  value={form.productId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, productId: e.target.value }))
                  }
                >
                  <option value="">None</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Rating" required error={errors.rating}>
                <select
                  value={form.rating}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, rating: Number(e.target.value) }))
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
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
            </div>
            <ProductFormField
              label="Testimonial Text"
              required
              error={errors.testimonialText}
              className="span-2"
            >
              <textarea
                rows={4}
                value={form.testimonialText}
                onChange={(e) =>
                  setForm((p) => ({ ...p, testimonialText: e.target.value }))
                }
              />
            </ProductFormField>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isFeatured: e.target.checked }))
                  }
                />{" "}
                Featured
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
              <h2>Customer Photo</h2>
            </header>
            <div className="admin-product-image-upload">
              {imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Customer"
                  className="admin-product-image-preview rounded-full"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void handleImage(e.target.files?.[0])}
              />
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
