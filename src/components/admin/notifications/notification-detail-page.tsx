"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchNotification } from "@/services/notifications-api";
import type { NotificationItem } from "@/types/notifications";

const LIST_PATH = "/admin/notifications";

type Props = { notificationId: string };

function logStatusTone(status: string): "active" | "inactive" {
  const s = status.toUpperCase();
  if (s === "SENT" || s === "DELIVERED" || s === "READ") return "active";
  return "inactive";
}

export function NotificationDetailPage({ notificationId }: Props) {
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setNotification(await fetchNotification(notificationId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load notification"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [notificationId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !notification) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const logs = notification.logs ?? [];

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={notification.title}
        listPath={LIST_PATH}
        listLabel="Notifications"
        sectionLabel="Notifications"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-data-tabs">
          <Link
            href={`${LIST_PATH}/${notificationId}/edit`}
            className="admin-btn admin-btn-primary admin-data-add-btn"
          >
            Edit Notification
          </Link>
        </div>
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Notification Info</h4>
            <p>
              <strong>{notification.title}</strong>
            </p>
            <p>Channel: {notification.channel}</p>
            <p>Target: {notification.targetType}</p>
            <p>Template: {notification.templateCode ?? "—"}</p>
            <p>Status: {notification.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Timestamps</h4>
            <p>Created: {formatDate(notification.createdAt)}</p>
            <p>Updated: {formatDate(notification.updatedAt)}</p>
          </div>
          <div className="admin-detail-card span-2">
            <h4>Message</h4>
            <p>{notification.message}</p>
          </div>
        </div>
        <div className="admin-detail-card span-2 mt-4">
          <h4>Delivery Logs ({logs.length})</h4>
          <div className="admin-data-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Sent At</th>
                  <th>Failure</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No delivery logs yet
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        {log.recipient ||
                          log.customerEmail ||
                          log.userEmail ||
                          log.customerFullName ||
                          log.userFullName ||
                          "—"}
                      </td>
                      <td>{log.channel}</td>
                      <td>
                        <span
                          className={`admin-status-badge ${logStatusTone(log.status)}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td>{formatDate(log.sentAt)}</td>
                      <td>{log.failureReason ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
