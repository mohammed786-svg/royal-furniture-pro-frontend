"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchLoginHistoryRecord } from "@/services/administration-api";
import type { LoginHistoryItem } from "@/types/admin-users";

const LIST_PATH = "/my-admin/administration/login-history";

type Props = { loginHistoryId: string };

export function LoginHistoryDetailPage({ loginHistoryId }: Props) {
  const router = useRouter();
  const [record, setRecord] = useState<LoginHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRecord(await fetchLoginHistoryRecord(loginHistoryId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load login record"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [loginHistoryId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !record) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const isSuccess = record.status.toLowerCase() === "success";
  const displayName = record.userFullName || record.customerFullName || "—";
  const displayEmail = record.userEmail || record.customerEmail || "—";

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={`Login — ${displayName}`}
        listPath={LIST_PATH}
        listLabel="Login History"
        sectionLabel="Administration"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>User Info</h4>
            <p>
              <strong>{displayName}</strong>
            </p>
            <p>Email: {displayEmail}</p>
            <p>User ID: {record.userId ?? "—"}</p>
            <p>Customer ID: {record.customerId ?? "—"}</p>
            <p>Login type: {record.loginType}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Session Details</h4>
            <p>
              Status:{" "}
              <span
                className={`admin-status-badge ${isSuccess ? "active" : "inactive"}`}
              >
                {record.status}
              </span>
            </p>
            {!isSuccess && record.failureReason && (
              <p>Failure reason: {record.failureReason}</p>
            )}
            <p>Login at: {formatDate(record.loginAt)}</p>
            <p>IP: {record.ipAddress ?? "—"}</p>
            <p>Device: {record.deviceType ?? "—"}</p>
            <p>Location: {record.location ?? "—"}</p>
          </div>
          {record.userAgent && (
            <div className="admin-detail-card span-2">
              <h4>User Agent</h4>
              <p>{record.userAgent}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
