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
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { resolveOrderStatusBadge } from "@/lib/admin/order-status-badge";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchOrders } from "@/services/orders-api";
import type { PaginationMeta } from "@/types/catalog";
import type { OrderListItem } from "@/types/orders";

const NEW_PATH = "/my-admin/orders/new";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function OrdersManager() {
  const router = useRouter();
  const [rows, setRows] = useState<OrderListItem[]>([]);
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
      const data = await fetchOrders({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load orders"));
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
    (): AdminTableColumn<OrderListItem>[] => [
      {
        key: "orderNumber",
        label: "Order #",
        render: (r) => <span className="admin-data-link">{r.orderNumber}</span>,
      },
      { key: "customerName", label: "Customer" },
      { key: "customerPhone", label: "Phone", render: (r) => r.customerPhone || "—" },
      {
        key: "currentStatus",
        label: "Status",
        render: (r) => (
          <OrderStatusBadge
            statusCode={r.statusCode}
            statusName={r.statusName}
            currentStatus={r.currentStatus}
          />
        ),
      },
      {
        key: "totalAmount",
        label: "Total",
        render: (r) => formatCurrency(r.totalAmount),
      },
      { key: "paymentMethod", label: "Payment" },
      {
        key: "createdAt",
        label: "Date",
        render: (r) => formatDate(r.createdAt),
      },
    ],
    [],
  );

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">All Orders</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Create Order
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Order List"
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
            onEdit={(row) => router.push(`/my-admin/orders/${row.id}`)}
          />
        ) : (
          <AdminDataGrid
            rows={rows.map((r) => ({ ...r, name: r.orderNumber }))}
            loading={loading}
            subtitle={(r) => r.customerName}
            status={(r) => {
              const badge = resolveOrderStatusBadge({
                statusCode: r.statusCode,
                statusName: r.statusName,
                currentStatus: r.currentStatus,
              });
              return { label: badge.label, className: badge.className };
            }}
            fields={(r) => [
              { label: "Total", value: formatCurrency(r.totalAmount) },
              { label: "Payment", value: r.paymentMethod },
              { label: "Date", value: formatDate(r.createdAt) },
            ]}
            onEdit={(row) => router.push(`/my-admin/orders/${row.id}`)}
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
