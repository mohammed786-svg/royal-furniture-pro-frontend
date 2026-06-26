"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchCatalogMetaOptions } from "@/services/catalog-meta-options";
import { createTag, fetchTag, updateTag } from "@/services/catalog-tags";
import type { CatalogProductOption } from "@/types/catalog-meta";
import type { TagFormValues, TagItem } from "@/types/tags";

const LIST_PATH = "/my-admin/catalog/tags";

const emptyForm: TagFormValues = {
  tagName: "",
  slug: "",
  isActive: true,
  productIds: [],
};

function itemToForm(item: TagItem): TagFormValues {
  return {
    tagName: item.tagName,
    slug: item.slug,
    isActive: item.isActive,
    productIds: item.productIds,
  };
}

type Props = { mode: "create" | "edit"; tagId?: string };

export function TagFormPage({ mode, tagId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<TagFormValues>(emptyForm);
  const [products, setProducts] = useState<CatalogProductOption[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const opts = await fetchCatalogMetaOptions();
      setProducts(opts.products);
      if (mode === "edit" && tagId) {
        setForm(itemToForm(await fetchTag(tagId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load tag"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, tagId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }, [products, productSearch]);

  function toggleProduct(id: string) {
    setForm((p) => ({
      ...p,
      productIds: p.productIds.includes(id)
        ? p.productIds.filter((x) => x !== id)
        : [...p.productIds, id],
    }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.tagName.trim()) e.tagName = "Tag name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && tagId) {
        await updateTag(tagId, form);
        royalToast.success("Tag updated");
      } else {
        await createTag(form);
        royalToast.success("Tag created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Tag" : "Add Tag";

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
        listLabel="Tags"
        sectionLabel="Catalog"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Tag Details</h2>
              <p>product_tagtbl — name, slug and status</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Tag Name" required error={errors.tagName}>
                <input
                  value={form.tagName}
                  onChange={(e) => setForm((p) => ({ ...p, tagName: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="Auto-generated from name"
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
              <h2>Product Mappings</h2>
              <p>
                product_tag_maptbl — assign products to this tag (
                {form.productIds.length} selected)
              </p>
            </header>
            <input
              type="search"
              className="admin-product-search"
              placeholder="Search products by name or SKU..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
            <div className="admin-tag-product-list">
              {filteredProducts.length === 0 ? (
                <p className="admin-data-empty">No products found</p>
              ) : (
                filteredProducts.map((p) => (
                  <label key={p.id} className="admin-tag-product-item">
                    <input
                      type="checkbox"
                      checked={form.productIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                    />
                    <span>{p.name}</span>
                    <small>{p.sku}</small>
                  </label>
                ))
              )}
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
