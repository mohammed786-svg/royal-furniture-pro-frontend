"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchBanner } from "@/services/marketing-api";
import type { BannerItem } from "@/types/marketing";

const LIST_PATH = "/my-admin/marketing/banners";

type Props = { bannerId: string };

export function BannerDetailPage({ bannerId }: Props) {
  const router = useRouter();
  const [banner, setBanner] = useState<BannerItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBanner(await fetchBanner(bannerId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load banner"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [bannerId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !banner) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const imageSrc = resolveMediaUrl(banner.imageUrl);
  const mobileSrc = resolveMediaUrl(banner.mobileImageUrl);

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={banner.title}
        listPath={LIST_PATH}
        listLabel="Banners"
        sectionLabel="Marketing"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${bannerId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Banner
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Banner Info</h4>
            <p>
              <strong>{banner.title}</strong>
            </p>
            {banner.subtitle && <p>{banner.subtitle}</p>}
            <p>Position: {banner.positionName ?? banner.positionCode ?? "—"}</p>
            <p>Category: {banner.categoryName ?? "—"}</p>
            <p>Display order: {banner.displayOrder}</p>
            <p>Status: {banner.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Link & Schedule</h4>
            <p>
              Link URL:{" "}
              {banner.linkUrl ? (
                <a href={banner.linkUrl} target="_blank" rel="noreferrer">
                  {banner.linkUrl}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p>Link type: {banner.linkType ?? "—"}</p>
            <p>Starts: {formatDate(banner.startsAt)}</p>
            <p>Ends: {formatDate(banner.endsAt)}</p>
            <p>Created: {formatDate(banner.createdAt)}</p>
            <p>Updated: {formatDate(banner.updatedAt)}</p>
          </div>
          {(imageSrc || mobileSrc) && (
            <div className="admin-detail-card span-2">
              <h4>Images</h4>
              <div className="flex gap-4 flex-wrap">
                {imageSrc && (
                  <div>
                    <p className="text-xs mb-1">Desktop</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={banner.title}
                      className="admin-detail-logo max-w-md"
                    />
                  </div>
                )}
                {mobileSrc && (
                  <div>
                    <p className="text-xs mb-1">Mobile</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mobileSrc}
                      alt={`${banner.title} mobile`}
                      className="admin-detail-logo max-w-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
