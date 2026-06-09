"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchBrand } from "@/services/catalog-brands";
import type { BrandItem } from "@/types/brands";

const LIST_PATH = "/admin/catalog/brands";

type Props = { brandId: string };

export function BrandDetailPage({ brandId }: Props) {
  const router = useRouter();
  const [brand, setBrand] = useState<BrandItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBrand(await fetchBrand(brandId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load brand"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [brandId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !brand) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const logoSrc = resolveMediaUrl(brand.logoUrl);

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={brand.name}
        listPath={LIST_PATH}
        listLabel="Brands"
        sectionLabel="Catalog"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${brandId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Brand
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Brand Info</h4>
            {logoSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt={brand.name} className="admin-detail-logo" />
            )}
            <p>
              <strong>{brand.name}</strong>
            </p>
            <p>Slug: {brand.slug}</p>
            <p>Display order: {brand.displayOrder}</p>
            <p>Status: {brand.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Links</h4>
            <p>
              Website:{" "}
              {brand.websiteUrl ? (
                <a href={brand.websiteUrl} target="_blank" rel="noreferrer">
                  {brand.websiteUrl}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p>Created: {formatDate(brand.createdAt)}</p>
            <p>Updated: {formatDate(brand.updatedAt)}</p>
          </div>
          {brand.description && (
            <div className="admin-detail-card span-2">
              <h4>Description</h4>
              <p>{brand.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
