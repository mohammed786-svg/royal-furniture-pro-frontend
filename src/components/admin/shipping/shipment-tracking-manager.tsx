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
import { deleteShipmentTracking, fetchShipmentTracking } from "@/services/shipping-api";
import type { PaginationMeta } from "@/types/catalog";
import type { ShipmentTrackingItem } from "@/types/shipping";

const NEW_PATH = "/my-admin/shipping/tracking/new";
const BASE_PATH = "/my-admin/shipping/tracking";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

export function ShipmentTrackingManager() {
  const router = useRouter();
  const [rows, setRows] = useState<ShipmentTrackingItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("trackedAt-desc");
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
      const data = await fetchShipmentTracking({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load tracking entries"));
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
    (): AdminTableColumn<ShipmentTrackingItem>[] => [
      {
        key: "orderNumber",
        label: "Order",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.orderNumber}
          </button>
        ),
      },
      { key: "awbNumber", label: "AWB", render: (r) => r.awbNumber ?? "—" },
      { key: "statusCode", label: "Code" },
      { key: "statusMessage", label: "Message" },
      { key: "location", label: "Location", render: (r) => r.location ?? "—" },
      { key: "source", label: "Source" },
      {
        key: "trackedAt",
        label: "Tracked At",
        render: (r) => formatDate(r.trackedAt),
      },
    ],
    [router],
  );

  async function handleDelete(row: ShipmentTrackingItem) {
    if (!window.confirm(`Delete tracking entry for order "${row.orderNumber}"?`))
      return;
    try {
      await deleteShipmentTracking(row.id);
      royalToast.success("Tracking entry deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Shipment Tracking</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Tracking
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Tracking List"
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
            rows={rows.map((r) => ({ ...r, name: r.orderNumber }))}
            loading={loading}
            subtitle={(r) => r.statusCode}
            status={(r) => ({ label: r.source, tone: "active" })}
            fields={(r) => [
              { label: "Message", value: r.statusMessage },
              { label: "Location", value: r.location ?? "—" },
              { label: "Tracked", value: formatDate(r.trackedAt) },
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
