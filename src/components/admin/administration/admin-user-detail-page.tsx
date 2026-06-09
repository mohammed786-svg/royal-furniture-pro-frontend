"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchAdminUser } from "@/services/administration-api";
import type { AdminUserItem } from "@/types/admin-users";

const LIST_PATH = "/admin/administration/users";

type Props = { userId: string };

export function AdminUserDetailPage({ userId }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUserItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUser(await fetchAdminUser(userId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load admin user"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !user) {
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
        title={user.fullName}
        listPath={LIST_PATH}
        listLabel="Admin Users"
        sectionLabel="Administration"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${userId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Admin User
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Account Info</h4>
            <p>
              <strong>{user.fullName}</strong>
            </p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone ?? "—"}</p>
            <p>
              Role: {user.roleName} ({user.roleCode})
            </p>
            <p>Status: {user.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Activity</h4>
            <p>Login count: {user.loginCount}</p>
            <p>Last login: {formatDate(user.lastLoginAt)}</p>
            <p>Created: {formatDate(user.createdAt)}</p>
            <p>Updated: {formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
