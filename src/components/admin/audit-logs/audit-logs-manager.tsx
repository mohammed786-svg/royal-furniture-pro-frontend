"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/components/admin/data-table/admin-data-table";
import { AdminDataToolbar } from "@/components/admin/data-table/admin-data-toolbar";
import { AdminPagination } from "@/components/admin/data-table/admin-pagination";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchAuditLogs } from "@/services/audit-logs-api";
import type { AuditLogItem } from "@/types/audit-logs";
import type { PaginationMeta } from "@/types/catalog";

const BASE_PATH = "/my-admin/settings/audit-logs";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function AuditLogsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<AuditLogItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionType, setActionType] = useState("");
  const [tableName, setTableName] = useState("");
  const [debouncedActionType, setDebouncedActionType] = useState("");
  const [debouncedTableName, setDebouncedTableName] = useState("");
  const [sortBy, setSortBy] = useState("loggedAt-desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedActionType(actionType), 300);
    return () => clearTimeout(t);
  }, [actionType]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTableName(tableName), 300);
    return () => clearTimeout(t);
  }, [tableName]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: sf, sortDir } = parseSort(sortBy);
      const data = await fetchAuditLogs({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        actionType: debouncedActionType || undefined,
        tableName: debouncedTableName || undefined,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load audit logs"));
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.pageSize,
    debouncedSearch,
    debouncedActionType,
    debouncedTableName,
    sortBy,
  ]);

  useEffect(() => {
    void loadData();
  }, [loadData]);
  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [debouncedSearch, debouncedActionType, debouncedTableName, sortBy]);

  const columns = useMemo(
    (): AdminTableColumn<AuditLogItem>[] => [
      {
        key: "actionType",
        label: "Action",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.actionType}
          </button>
        ),
      },
      { key: "tableName", label: "Table" },
      { key: "recordId", label: "Record ID", render: (r) => r.recordId ?? "—" },
      { key: "userId", label: "User", render: (r) => r.userId ?? "—" },
      { key: "ipAddress", label: "IP", render: (r) => r.ipAddress ?? "—" },
      { key: "loggedAt", label: "Logged At", render: (r) => formatDate(r.loggedAt) },
    ],
    [router],
  );

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Audit Logs</h3>
      </div>
      <div className="admin-data-card">
        <div className="admin-product-section-grid mb-4 px-4 pt-4">
          <label className="admin-form-field">
            <span>Action Type</span>
            <input
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              placeholder="e.g. CREATE, UPDATE, DELETE"
            />
          </label>
          <label className="admin-form-field">
            <span>Table Name</span>
            <input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="e.g. producttbl"
            />
          </label>
        </div>
        <AdminDataToolbar
          title="Audit Log List"
          search={search}
          viewMode="table"
          sortBy={sortBy}
          onSearchChange={setSearch}
          onViewModeChange={() => {}}
          onSortChange={setSortBy}
          onRefresh={() => void loadData()}
        />
        <AdminDataTable
          columns={columns}
          rows={rows}
          loading={loading}
          selectedIds={new Set()}
          onToggleSelect={() => {}}
          onToggleSelectAll={() => {}}
          onEdit={(row) => router.push(`${BASE_PATH}/${row.id}`)}
        />
        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
          onPageSizeChange={(ps) =>
            setPagination((p) => ({ ...p, pageSize: ps, page: 1 }))
          }
        />
      </div>
    </>
  );
}
