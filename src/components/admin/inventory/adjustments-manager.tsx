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
import { fetchAdjustments, updateAdjustmentStatus } from "@/services/inventory-api";
import type { PaginationMeta } from "@/types/catalog";
import type { AdjustmentItem } from "@/types/inventory";

const NEW_PATH = "/my-admin/inventory/adjustments/new";

function statusTone(status: string): "active" | "inactive" | "warning" {
  if (status === "APPROVED") return "active";
  if (status === "REJECTED") return "inactive";
  return "warning";
}

export function AdjustmentsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<AdjustmentItem[]>([]);
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
      const [sf, sd] = sortBy.split("-") as [string, "asc" | "desc"];
      const data = await fetchAdjustments({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir: sd,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load adjustments"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const columns = useMemo(
    (): AdminTableColumn<AdjustmentItem>[] => [
      { key: "id", label: "ID", render: (r) => `#${r.id}` },
      { key: "productName", label: "Product" },
      { key: "warehouseName", label: "Warehouse" },
      { key: "adjustmentType", label: "Type" },
      { key: "quantity", label: "Qty" },
      {
        key: "status",
        label: "Status",
        render: (r) => (
          <span className={`admin-status-badge ${statusTone(r.status)}`}>
            {r.status}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Created",
        render: (r) => r.createdAt?.slice(0, 10) ?? "—",
      },
    ],
    [],
  );

  async function handleAction(row: AdjustmentItem, status: "APPROVED" | "REJECTED") {
    if (!window.confirm(`${status} adjustment #${row.id}?`)) return;
    try {
      await updateAdjustmentStatus(row.id, status);
      royalToast.success(`Adjustment ${status.toLowerCase()}`);
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Action failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Stock Adjustments</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> New Adjustment
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Adjustments"
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
          onEdit={(r) => router.push(`/my-admin/inventory/adjustments/${r.id}`)}
          renderRowActions={(row) =>
            row.status === "PENDING" ? (
              <>
                <button
                  type="button"
                  onClick={() => void handleAction(row, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => void handleAction(row, "REJECTED")}
                >
                  Reject
                </button>
              </>
            ) : null
          }
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
