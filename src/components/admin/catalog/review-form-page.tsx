"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchCatalogMetaOptions } from "@/services/catalog-meta-options";
import { createReview, fetchReview, updateReview } from "@/services/catalog-reviews";
import type { CatalogCustomerOption, CatalogProductOption } from "@/types/catalog-meta";
import type { ReviewFormValues, ReviewItem } from "@/types/reviews";

const LIST_PATH = "/my-admin/catalog/reviews";

const emptyForm: ReviewFormValues = {
  productId: "",
  customerId: "",
  orderId: "",
  title: "",
  reviewText: "",
  rating: 5,
  isVerifiedPurchase: false,
  isApproved: false,
  isActive: true,
};

function itemToForm(item: ReviewItem): ReviewFormValues {
  return {
    productId: item.productId,
    customerId: item.customerId,
    orderId: item.orderId ?? "",
    title: item.title,
    reviewText: item.reviewText,
    rating: item.rating,
    isVerifiedPurchase: item.isVerifiedPurchase,
    isApproved: item.isApproved,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; reviewId?: string };

export function ReviewFormPage({ mode, reviewId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ReviewFormValues>(emptyForm);
  const [products, setProducts] = useState<CatalogProductOption[]>([]);
  const [customers, setCustomers] = useState<CatalogCustomerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const opts = await fetchCatalogMetaOptions();
      setProducts(opts.products);
      setCustomers(opts.customers);
      if (mode === "edit" && reviewId) {
        setForm(itemToForm(await fetchReview(reviewId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load review"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, reviewId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.productId) e.productId = "Product is required";
    if (!form.customerId) e.customerId = "Customer is required";
    if (form.rating < 1 || form.rating > 5) e.rating = "Rating must be 1–5";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        orderId: form.orderId || undefined,
      };
      if (mode === "edit" && reviewId) {
        await updateReview(reviewId, payload);
        royalToast.success("Review updated");
      } else {
        await createReview(payload);
        royalToast.success("Review created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Review" : "Add Review";

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
        listLabel="Reviews"
        sectionLabel="Catalog"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Review Details</h2>
              <p>product_reviewtbl — product, customer, rating and moderation</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Product" required error={errors.productId}>
                <select
                  value={form.productId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, productId: e.target.value }))
                  }
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Customer" required error={errors.customerId}>
                <select
                  value={form.customerId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerId: e.target.value }))
                  }
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName}
                      {c.email ? ` — ${c.email}` : ""}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Order ID (optional)">
                <input
                  value={form.orderId}
                  onChange={(e) => setForm((p) => ({ ...p, orderId: e.target.value }))}
                  placeholder="Link to ordertbl"
                />
              </ProductFormField>
              <ProductFormField label="Rating (1–5)" required error={errors.rating}>
                <select
                  value={form.rating}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, rating: Number(e.target.value) }))
                  }
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Title" className="span-2">
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </ProductFormField>
            </div>
            <ProductFormField label="Review Text" className="span-2">
              <textarea
                rows={5}
                value={form.reviewText}
                onChange={(e) => setForm((p) => ({ ...p, reviewText: e.target.value }))}
              />
            </ProductFormField>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isVerifiedPurchase}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isVerifiedPurchase: e.target.checked }))
                  }
                />{" "}
                Verified purchase
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.isApproved}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isApproved: e.target.checked }))
                  }
                />{" "}
                Approved
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
