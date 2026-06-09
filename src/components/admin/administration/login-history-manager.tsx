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
import {
  fetchAdministrationMetaOptions,
  fetchLoginHistory,
} from "@/services/administration-api";
import type { LoginHistoryItem } from "@/types/admin-users";
import type { PaginationMeta } from "@/types/catalog";

const BASE_PATH = "/admin/administration/login-history";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

function statusTone(status: string): "active" | "inactive" {
  return status.toLowerCase() === "success" ? "active" : "inactive";
}

export function LoginHistoryManager() {
  const router = useRouter();
  const [rows, setRows] = useState<LoginHistoryItem[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("loginAt-desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    void fetchAdministrationMetaOptions()
      .then((opts) => setStatuses(opts.loginStatuses))
      .catch(() => {});
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: sf, sortDir } = parseSort(sortBy);
      const data = await fetchLoginHistory({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        status: statusFilter || undefined,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load login history"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy, statusFilter]);

  useEffect(() => {
    void loadData();
  }, [loadData]);
  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [debouncedSearch, sortBy, statusFilter]);

  const columns = useMemo(
    (): AdminTableColumn<LoginHistoryItem>[] => [
      {
        key: "userEmail",
        label: "User",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.userFullName ||
              r.customerFullName ||
              r.userEmail ||
              r.customerEmail ||
              "—"}
          </button>
        ),
      },
      { key: "loginType", label: "Type" },
      {
        key: "status",
        label: "Status",
        render: (r) => (
          <span className={`admin-status-badge ${statusTone(r.status)}`}>
            {r.status}
          </span>
        ),
      },
      { key: "ipAddress", label: "IP", render: (r) => r.ipAddress ?? "—" },
      { key: "deviceType", label: "Device", render: (r) => r.deviceType ?? "—" },
      { key: "loginAt", label: "Login At", render: (r) => formatDate(r.loginAt) },
    ],
    [router],
  );

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Login History</h3>
      </div>
      <div className="admin-data-card">
        <div className="admin-data-filter-tabs">
          <button
            type="button"
            className={statusFilter === "" ? "active" : ""}
            onClick={() => setStatusFilter("")}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              className={statusFilter === status ? "active" : ""}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <AdminDataToolbar
          title="Login History List"
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
