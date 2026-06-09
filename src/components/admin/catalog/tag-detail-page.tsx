"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchCatalogMetaOptions } from "@/services/catalog-meta-options";
import { fetchTag } from "@/services/catalog-tags";
import type { CatalogProductOption } from "@/types/catalog-meta";
import type { TagItem } from "@/types/tags";

const LIST_PATH = "/admin/catalog/tags";

type Props = { tagId: string };

export function TagDetailPage({ tagId }: Props) {
  const router = useRouter();
  const [tag, setTag] = useState<TagItem | null>(null);
  const [products, setProducts] = useState<CatalogProductOption[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tagData, opts] = await Promise.all([
        fetchTag(tagId),
        fetchCatalogMetaOptions(),
      ]);
      setTag(tagData);
      setProducts(opts.products);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load tag"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [tagId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !tag) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const mappedProducts = products.filter((p) => tag.productIds.includes(p.id));

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={tag.tagName}
        listPath={LIST_PATH}
        listLabel="Tags"
        sectionLabel="Catalog"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${tagId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Tag
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Tag Info</h4>
            <p>
              <strong>{tag.tagName}</strong>
            </p>
            <p>Slug: {tag.slug}</p>
            <p>Status: {tag.isActive ? "Active" : "Inactive"}</p>
            <p>Products mapped: {tag.productCount}</p>
            <p>Created: {formatDate(tag.createdAt)}</p>
            <p>Updated: {formatDate(tag.updatedAt)}</p>
          </div>
          <div className="admin-detail-card span-2">
            <h4>Mapped Products</h4>
            {mappedProducts.length === 0 ? (
              <p>No products assigned to this tag.</p>
            ) : (
              <ul className="admin-tag-mapped-list">
                {mappedProducts.map((p) => (
                  <li key={p.id}>
                    <Link href={`/admin/catalog/products/${p.id}/edit`}>{p.name}</Link>
                    <span> ({p.sku})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
