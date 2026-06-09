"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchAuditLog } from "@/services/audit-logs-api";
import type { AuditLogItem } from "@/types/audit-logs";

const LIST_PATH = "/admin/settings/audit-logs";

type Props = { auditLogId: string };

function JsonBlock({ label, data }: { label: string; data: Record<string, unknown> }) {
  const hasData = Object.keys(data).length > 0;
  return (
    <div className="admin-detail-card">
      <h4>{label}</h4>
      {hasData ? (
        <pre
          className="text-xs overflow-auto p-3 rounded"
          style={{
            background: "var(--admin-surface-muted, #f4f4f5)",
            maxHeight: "320px",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-muted">No data</p>
      )}
    </div>
  );
}

export function AuditLogDetailPage({ auditLogId }: Props) {
  const router = useRouter();
  const [log, setLog] = useState<AuditLogItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLog(await fetchAuditLog(auditLogId));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load audit log"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [auditLogId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !log) {
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
        title={`${log.actionType} — ${log.tableName}`}
        listPath={LIST_PATH}
        listLabel="Audit Logs"
        sectionLabel="Settings"
      />
      <div className="admin-data-card admin-order-detail">
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Event Info</h4>
            <p>
              Action: <strong>{log.actionType}</strong>
            </p>
            <p>Table: {log.tableName}</p>
            <p>Record ID: {log.recordId ?? "—"}</p>
            <p>User ID: {log.userId ?? "—"}</p>
            <p>Customer ID: {log.customerId ?? "—"}</p>
            <p>Logged: {formatDate(log.loggedAt)}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Context</h4>
            <p>IP: {log.ipAddress ?? "—"}</p>
            <p>User Agent: {log.userAgent ?? "—"}</p>
            <p>Remarks: {log.remarks ?? "—"}</p>
            <p>Created: {formatDate(log.createdAt)}</p>
          </div>
          <JsonBlock label="Old Values" data={log.oldValues} />
          <JsonBlock label="New Values" data={log.newValues} />
        </div>
      </div>
    </div>
  );
}
