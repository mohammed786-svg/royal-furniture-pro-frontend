"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminDataGrid } from "@/components/admin/data-table/admin-data-grid";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/components/admin/data-table/admin-data-table";
import {
  AdminDataToolbar,
  type ViewMode,
} from "@/components/admin/data-table/admin-data-toolbar";
import { AdminPagination } from "@/components/admin/data-table/admin-pagination";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { deleteNotification, fetchNotifications } from "@/services/notifications-api";
import type { PaginationMeta } from "@/types/catalog";
import type { NotificationItem } from "@/types/notifications";

const NEW_PATH = "/my-admin/notifications/new";
const BASE_PATH = "/my-admin/notifications";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function NotificationsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<NotificationItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: sf, sortDir } = parseSort(sortBy);
      const data = await fetchNotifications({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load notifications"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy]);

  useEffect(() => {
    void loadData();
  }, [loadData]);
  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [debouncedSearch, sortBy]);

  const columns = useMemo(
    (): AdminTableColumn<NotificationItem>[] => [
      {
        key: "title",
        label: "Title",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.title}
          </button>
        ),
      },
      { key: "channel", label: "Channel" },
      { key: "targetType", label: "Target" },
      { key: "templateCode", label: "Template", render: (r) => r.templateCode ?? "—" },
      {
        key: "isActive",
        label: "Status",
        render: (r) => (
          <span className={`admin-status-badge ${r.isActive ? "active" : "inactive"}`}>
            {r.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
    ],
    [router],
  );

  async function handleDelete(row: NotificationItem) {
    if (!window.confirm(`Delete notification "${row.title}"?`)) return;
    try {
      await deleteNotification(row.id);
      royalToast.success("Notification deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Notifications</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Notification
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Notification List"
          search={search}
          viewMode={viewMode}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onViewModeChange={setViewMode}
          onSortChange={setSortBy}
          onRefresh={() => void loadData()}
        />
        {viewMode === "table" ? (
          <AdminDataTable
            columns={columns}
            rows={rows}
            loading={loading}
            selectedIds={new Set()}
            onToggleSelect={() => {}}
            onToggleSelectAll={() => {}}
            onEdit={(row) => router.push(`${BASE_PATH}/${row.id}/edit`)}
            onDelete={handleDelete}
          />
        ) : (
          <AdminDataGrid
            rows={rows.map((r) => ({ ...r, name: r.title }))}
            loading={loading}
            subtitle={(r) => r.channel}
            status={(r) => ({
              label: r.isActive ? "Active" : "Inactive",
              tone: r.isActive ? "active" : "inactive",
            })}
            fields={(r) => [
              { label: "Target", value: r.targetType },
              { label: "Created", value: formatDate(r.createdAt) },
            ]}
            onEdit={(row) => router.push(`${BASE_PATH}/${row.id}/edit`)}
            onDelete={handleDelete}
          />
        )}
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
