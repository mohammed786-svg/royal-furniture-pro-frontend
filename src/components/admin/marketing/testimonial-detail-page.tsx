"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchTestimonial } from "@/services/marketing-api";
import type { TestimonialItem } from "@/types/marketing";

const LIST_PATH = "/my-admin/marketing/testimonials";

type Props = { testimonialId: string };

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function TestimonialDetailPage({ testimonialId }: Props) {
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<TestimonialItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTestimonial(await fetchTestimonial(testimonialId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load testimonial"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [testimonialId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !testimonial) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const imageSrc = resolveMediaUrl(testimonial.customerImage);

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={testimonial.customerName}
        listPath={LIST_PATH}
        listLabel="Testimonials"
        sectionLabel="Marketing"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${testimonialId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Testimonial
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Customer Info</h4>
            {imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={testimonial.customerName}
                className="admin-detail-logo rounded-full w-16 h-16 object-cover"
              />
            )}
            <p>
              <strong>{testimonial.customerName}</strong>
            </p>
            <p>Location: {testimonial.location ?? "—"}</p>
            <p>
              Rating:{" "}
              <span className="text-amber-500">{renderStars(testimonial.rating)}</span>
            </p>
            <p>Featured: {testimonial.isFeatured ? "Yes" : "No"}</p>
            <p>Status: {testimonial.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Product & Meta</h4>
            <p>Product: {testimonial.productName ?? "—"}</p>
            <p>Display order: {testimonial.displayOrder}</p>
            <p>Created: {formatDate(testimonial.createdAt)}</p>
            <p>Updated: {formatDate(testimonial.updatedAt)}</p>
          </div>
          <div className="admin-detail-card span-2">
            <h4>Testimonial</h4>
            <p className="italic">&ldquo;{testimonial.testimonialText}&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
