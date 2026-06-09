"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchFaq } from "@/services/marketing-api";
import type { FaqItem } from "@/types/marketing";

const LIST_PATH = "/admin/marketing/faqs";

type Props = { faqId: string };

export function FaqDetailPage({ faqId }: Props) {
  const router = useRouter();
  const [faq, setFaq] = useState<FaqItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setFaq(await fetchFaq(faqId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load FAQ"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [faqId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !faq) {
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
        title={faq.question}
        listPath={LIST_PATH}
        listLabel="FAQs"
        sectionLabel="Marketing"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${faqId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit FAQ
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>FAQ Info</h4>
            <p>
              Category: <strong>{faq.category}</strong>
            </p>
            <p>Display order: {faq.displayOrder}</p>
            <p>Status: {faq.isActive ? "Active" : "Inactive"}</p>
            <p>Created: {formatDate(faq.createdAt)}</p>
            <p>Updated: {formatDate(faq.updatedAt)}</p>
          </div>
          <div className="admin-detail-card span-2">
            <h4>Question</h4>
            <p>
              <strong>{faq.question}</strong>
            </p>
            <h4 className="mt-4">Answer</h4>
            <p className="whitespace-pre-wrap">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
