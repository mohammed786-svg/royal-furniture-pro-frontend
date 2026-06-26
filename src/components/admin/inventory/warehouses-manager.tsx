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
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { deleteWarehouse, fetchWarehouses } from "@/services/inventory-api";
import type { PaginationMeta } from "@/types/catalog";
import type { WarehouseItem } from "@/types/inventory";

const NEW_PATH = "/my-admin/inventory/warehouses/new";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

export function WarehousesManager() {
  const router = useRouter();
  const [rows, setRows] = useState<WarehouseItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
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
      const data = await fetchWarehouses({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load warehouses"));
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
    (): AdminTableColumn<WarehouseItem>[] => [
      {
        key: "warehouseCode",
        label: "Code",
        render: (r) => <span className="admin-data-link">{r.warehouseCode}</span>,
      },
      { key: "name", label: "Warehouse" },
      { key: "city", label: "City", render: (r) => r.city ?? "—" },
      { key: "state", label: "State", render: (r) => r.state ?? "—" },
      { key: "contactPhone", label: "Phone", render: (r) => r.contactPhone ?? "—" },
      {
        key: "isPrimary",
        label: "Primary",
        render: (r) => (
          <span className={`admin-status-badge ${r.isPrimary ? "active" : "inactive"}`}>
            {r.isPrimary ? "Yes" : "No"}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (r) => (
          <span className={`admin-status-badge ${r.isActive ? "active" : "inactive"}`}>
            {r.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    [],
  );

  async function handleDelete(row: WarehouseItem) {
    if (!window.confirm(`Delete warehouse "${row.name}"?`)) return;
    try {
      await deleteWarehouse(row.id);
      royalToast.success("Warehouse deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Warehouses</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Warehouse
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Warehouse List"
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
            onEdit={(row) =>
              router.push(`/my-admin/inventory/warehouses/${row.id}/edit`)
            }
            onDelete={handleDelete}
          />
        ) : (
          <AdminDataGrid
            rows={rows}
            loading={loading}
            subtitle={(r) => r.warehouseCode}
            status={(r) => ({
              label: r.isActive ? "Active" : "Inactive",
              tone: r.isActive ? "active" : "inactive",
            })}
            fields={(r) => [
              { label: "City", value: r.city ?? "—" },
              { label: "Phone", value: r.contactPhone ?? "—" },
              { label: "Primary", value: r.isPrimary ? "Yes" : "No" },
            ]}
            onEdit={(row) =>
              router.push(`/my-admin/inventory/warehouses/${row.id}/edit`)
            }
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
