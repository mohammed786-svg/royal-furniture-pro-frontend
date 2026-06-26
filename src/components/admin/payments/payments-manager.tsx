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
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { deletePayment, fetchPayments } from "@/services/payments-api";
import type { PaginationMeta } from "@/types/catalog";
import type { PaymentItem } from "@/types/payments";

const NEW_PATH = "/my-admin/payments/new";
const BASE_PATH = "/my-admin/payments";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

function statusTone(status: string): "active" | "inactive" {
  const s = status.toUpperCase();
  if (["PAID", "VERIFIED"].includes(s)) return "active";
  return "inactive";
}

export function PaymentsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<PaymentItem[]>([]);
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
      const data = await fetchPayments({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load payments"));
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
    (): AdminTableColumn<PaymentItem>[] => [
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
      { key: "customerName", label: "Customer" },
      { key: "paymentMethod", label: "Method" },
      {
        key: "paymentAmount",
        label: "Amount",
        render: (r) => formatCurrency(r.paymentAmount),
      },
      { key: "currency", label: "Currency" },
      {
        key: "paymentStatus",
        label: "Status",
        render: (r) => (
          <span className={`admin-status-badge ${statusTone(r.paymentStatus)}`}>
            {r.paymentStatus}
          </span>
        ),
      },
      {
        key: "paidAt",
        label: "Paid At",
        render: (r) => formatDate(r.paidAt),
      },
    ],
    [router],
  );

  async function handleDelete(row: PaymentItem) {
    if (!window.confirm(`Delete payment for order "${row.orderNumber}"?`)) return;
    try {
      await deletePayment(row.id);
      royalToast.success("Payment deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Payments</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Payment
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Payment List"
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
            subtitle={(r) => r.customerName}
            status={(r) => ({
              label: r.paymentStatus,
              tone: statusTone(r.paymentStatus),
            })}
            fields={(r) => [
              { label: "Method", value: r.paymentMethod },
              { label: "Amount", value: formatCurrency(r.paymentAmount) },
              { label: "Paid", value: formatDate(r.paidAt) },
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
