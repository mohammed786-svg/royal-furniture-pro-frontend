"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchCmsPage } from "@/services/marketing-api";
import type { CmsPageItem } from "@/types/marketing";

const LIST_PATH = "/admin/marketing/cms";

type Props = { pageId: string };

export function CmsPageDetailPage({ pageId }: Props) {
  const router = useRouter();
  const [page, setPage] = useState<CmsPageItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPage(await fetchCmsPage(pageId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load CMS page"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [pageId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !page) {
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
        title={page.title}
        listPath={LIST_PATH}
        listLabel="CMS Pages"
        sectionLabel="Marketing"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${pageId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Page
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Page Info</h4>
            <p>
              <strong>{page.title}</strong>
            </p>
            <p>Code: {page.pageCode}</p>
            <p>Slug: /{page.slug}</p>
            <p>Published: {page.isPublished ? "Yes" : "No"}</p>
            <p>Status: {page.isActive ? "Active" : "Inactive"}</p>
            {page.publishedAt && <p>Published at: {formatDate(page.publishedAt)}</p>}
          </div>
          <div className="admin-detail-card">
            <h4>SEO</h4>
            <p>Title: {page.seoTitle ?? "—"}</p>
            <p>Keywords: {page.seoKeywords ?? "—"}</p>
            <p>Description: {page.seoDescription ?? "—"}</p>
            <p>Created: {formatDate(page.createdAt)}</p>
            <p>Updated: {formatDate(page.updatedAt)}</p>
          </div>
          {page.content && (
            <div className="admin-detail-card span-2">
              <h4>Content</h4>
              <div className="whitespace-pre-wrap">{page.content}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
