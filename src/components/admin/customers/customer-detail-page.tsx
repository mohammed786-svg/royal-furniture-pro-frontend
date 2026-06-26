"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchCustomer } from "@/services/customers-api";
import type { CustomerItem } from "@/types/customers";

const LIST_PATH = "/my-admin/customers";

type Props = { customerId: string };

export function CustomerDetailPage({ customerId }: Props) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCustomer(await fetchCustomer(customerId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load customer"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [customerId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !customer) {
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
        title={customer.fullName}
        listPath={LIST_PATH}
        listLabel="Customers"
        sectionLabel="Customers"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`/my-admin/customers/${customerId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Customer
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Contact</h4>
            <p>
              <strong>{customer.fullName}</strong>
            </p>
            <p>{customer.email || "—"}</p>
            <p>{customer.phone || "—"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Account</h4>
            <p>Type: {customer.isGuest ? "Guest" : "Registered"}</p>
            <p>Status: {customer.isActive ? "Active" : "Inactive"}</p>
            <p>Joined: {formatDate(customer.createdAt)}</p>
            {customer.userId && <p>User ID: {customer.userId}</p>}
          </div>
          {customer.profile && (
            <div className="admin-detail-card">
              <h4>Profile</h4>
              <p>Gender: {customer.profile.gender ?? "—"}</p>
              <p>
                DOB:{" "}
                {customer.profile.dateOfBirth
                  ? formatDate(customer.profile.dateOfBirth)
                  : "—"}
              </p>
              <p>Newsletter: {customer.profile.newsletterSubscribed ? "Yes" : "No"}</p>
            </div>
          )}
        </div>
        <div className="admin-inline-actions">
          <Link
            href={`/my-admin/customers/addresses?customerId=${customerId}`}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            View Addresses
          </Link>
          <Link
            href={`/my-admin/customers/wishlists?customerId=${customerId}`}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            View Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}
