"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
import { deleteStock, fetchStock } from "@/services/inventory-api";
import type { PaginationMeta } from "@/types/catalog";
import type { StockItem } from "@/types/inventory";

const NEW_PATH = "/my-admin/inventory/stock/new";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function StockManager() {
  const router = useRouter();
  const [rows, setRows] = useState<StockItem[]>([]);
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
      const { sortBy: sf, sortDir } = parseSort(sortBy);
      const data = await fetchStock({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load stock"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const columns = useMemo(
    (): AdminTableColumn<StockItem>[] => [
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
      { key: "productSku", label: "SKU" },
      { key: "warehouseName", label: "Warehouse" },
      { key: "availableStock", label: "Available" },
      { key: "reservedStock", label: "Reserved" },
      { key: "damagedStock", label: "Damaged" },
      { key: "reorderLevel", label: "Reorder At" },
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

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Stock Overview</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Stock Record
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Inventory Stock"
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
          onEdit={(r) => router.push(`/my-admin/inventory/stock/${r.id}/edit`)}
          onDelete={async (r) => {
            if (window.confirm(`Delete stock record for ${r.productName}?`)) {
              try {
                await deleteStock(r.id);
                royalToast.success("Deleted");
                await loadData();
              } catch (e) {
                royalToast.error(getApiErrorMessage(e, "Delete failed"));
              }
            }
          }}
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
