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
import { fetchTransfers, updateTransferStatus } from "@/services/inventory-api";
import type { PaginationMeta } from "@/types/catalog";
import type { TransferItem } from "@/types/inventory";

const NEW_PATH = "/my-admin/inventory/transfers/new";

function statusTone(status: string): "active" | "inactive" | "warning" {
  if (status === "COMPLETED") return "active";
  if (status === "CANCELLED") return "inactive";
  return "warning";
}

export function TransfersManager() {
  const router = useRouter();
  const [rows, setRows] = useState<TransferItem[]>([]);
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
      const data = await fetchTransfers({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir: sd,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load transfers"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const columns = useMemo(
    (): AdminTableColumn<TransferItem>[] => [
      { key: "id", label: "ID", render: (r) => `#${r.id}` },
      { key: "productName", label: "Product" },
      { key: "fromWarehouseName", label: "From" },
      { key: "toWarehouseName", label: "To" },
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
    ],
    [],
  );

  async function completeTransfer(row: TransferItem) {
    if (
      !window.confirm(
        `Complete transfer #${row.id}? Stock will move between warehouses.`,
      )
    )
      return;
    try {
      await updateTransferStatus(row.id, "COMPLETED");
      royalToast.success("Transfer completed");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to complete transfer"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Stock Transfers</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> New Transfer
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Transfers"
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
          onEdit={(r) => router.push(`/my-admin/inventory/transfers/${r.id}`)}
          renderRowActions={(row) =>
            row.status === "PENDING" || row.status === "IN_TRANSIT" ? (
              <button type="button" onClick={() => void completeTransfer(row)}>
                Complete
              </button>
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
