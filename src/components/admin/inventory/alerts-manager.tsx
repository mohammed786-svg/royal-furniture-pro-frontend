"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/components/admin/data-table/admin-data-table";
import {
  AdminDataToolbar,
  type ViewMode,
} from "@/components/admin/data-table/admin-data-toolbar";
import { AdminPagination } from "@/components/admin/data-table/admin-pagination";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchAlerts } from "@/services/inventory-api";
import type { PaginationMeta } from "@/types/catalog";
import type { AlertItem } from "@/types/inventory";

export function AlertsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<AlertItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAlerts({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load alerts"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const columns = useMemo(
    (): AdminTableColumn<AlertItem>[] => [
      {
        key: "productName",
        label: "Product",
        render: (r) => (
          <span>
            {r.productName}
            {r.variantName ? ` (${r.variantName})` : ""}
          </span>
        ),
      },
      { key: "warehouseName", label: "Warehouse" },
      { key: "availableStock", label: "Available" },
      { key: "reorderLevel", label: "Reorder Level" },
      {
        key: "shortage",
        label: "Shortage",
        render: (r) => (
          <span
            className={`admin-status-badge ${r.availableStock === 0 ? "inactive" : "warning"}`}
          >
            {r.shortage > 0 ? `-${r.shortage}` : "Low"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (r) => (
          <div className="admin-inline-actions">
            <Link
              href={`/admin/inventory/stock/${r.id}/edit`}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              Update Stock
            </Link>
            <Link
              href="/admin/inventory/adjustments/new"
              className="admin-btn admin-btn-primary admin-btn-sm"
            >
              Adjust
            </Link>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Low Stock Alerts</h3>
        <span className="admin-field-hint">
          Items where available stock ≤ reorder level
        </span>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Alerts"
          search={search}
          viewMode={viewMode}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onViewModeChange={setViewMode}
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
          onEdit={(r) => router.push(`/admin/inventory/stock/${r.id}/edit`)}
        />
        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={(p) => setPagination((s) => ({ ...s, page: p }))}
          onPageSizeChange={(ps) =>
            setPagination((s) => ({ ...s, pageSize: ps, page: 1 }))
          }
        />
      </div>
    </>
  );
}
