"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  fetchShiprocketOrders,
  type ShiprocketOrderListItem,
} from "@/services/shiprocket-api";
import type { PaginationMeta } from "@/types/catalog";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

function formatTotal(total: ShiprocketOrderListItem["total"]) {
  if (total == null || total === "") return "—";
  const amount = Number(total);
  if (Number.isFinite(amount)) return formatCurrency(amount);
  return String(total);
}

export function ShiprocketOrdersManager() {
  const router = useRouter();
  const [rows, setRows] = useState<ShiprocketOrderListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("id-desc");
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
      const data = await fetchShiprocketOrders({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load Shiprocket orders"));
      setRows([]);
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
    (): AdminTableColumn<ShiprocketOrderListItem>[] => [
      {
        key: "srOrderId",
        label: "SR Order ID",
        render: (r) => <span className="admin-data-link">{r.srOrderId || "—"}</span>,
      },
      {
        key: "channelOrderId",
        label: "Channel Order",
        render: (r) => r.channelOrderId || "—",
      },
      {
        key: "status",
        label: "Status",
        render: (r) => <span className="admin-status-badge active">{r.status}</span>,
      },
      { key: "paymentMethod", label: "Payment" },
      {
        key: "total",
        label: "Total",
        render: (r) => formatTotal(r.total),
      },
      {
        key: "createdAt",
        label: "Created",
        render: (r) => {
          const parsed = Date.parse(r.createdAt);
          return Number.isFinite(parsed) ? formatDate(r.createdAt) : r.createdAt;
        },
      },
    ],
    [],
  );

  const openOrder = (row: ShiprocketOrderListItem) => {
    if (row.srOrderId) {
      router.push(`/my-admin/shiprocket/orders/${row.srOrderId}`);
    }
  };

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Shiprocket Orders</h3>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Order List (live from Shiprocket)"
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
            onEdit={openOrder}
          />
        ) : (
          <AdminDataGrid
            rows={rows.map((r) => ({ ...r, name: r.srOrderId || r.channelOrderId }))}
            loading={loading}
            subtitle={(r) => r.channelOrderId || "—"}
            status={(r) => ({ label: r.status, tone: "active" })}
            fields={(r) => [
              { label: "Payment", value: r.paymentMethod },
              { label: "Total", value: formatTotal(r.total) },
              {
                label: "Created",
                value: Number.isFinite(Date.parse(r.createdAt))
                  ? formatDate(r.createdAt)
                  : r.createdAt,
              },
            ]}
            onEdit={openOrder}
            onDelete={() => {}}
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
