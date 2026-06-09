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
import {
  deletePaymentVerification,
  fetchPaymentVerifications,
} from "@/services/payments-api";
import type { PaginationMeta } from "@/types/catalog";
import type { PaymentVerificationItem } from "@/types/payments";

const NEW_PATH = "/admin/payments/verification/new";
const BASE_PATH = "/admin/payments/verification";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

function statusTone(status: string): "active" | "inactive" {
  const s = status.toUpperCase();
  if (s === "APPROVED") return "active";
  return "inactive";
}

export function PaymentVerificationsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<PaymentVerificationItem[]>([]);
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
      const data = await fetchPaymentVerifications({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load verifications"));
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
    (): AdminTableColumn<PaymentVerificationItem>[] => [
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
      { key: "utrNumber", label: "UTR" },
      {
        key: "paymentAmount",
        label: "Amount",
        render: (r) => formatCurrency(r.paymentAmount),
      },
      {
        key: "verificationStatus",
        label: "Status",
        render: (r) => (
          <span className={`admin-status-badge ${statusTone(r.verificationStatus)}`}>
            {r.verificationStatus}
          </span>
        ),
      },
      {
        key: "verificationTime",
        label: "Verified",
        render: (r) => formatDate(r.verificationTime),
      },
    ],
    [router],
  );

  async function handleDelete(row: PaymentVerificationItem) {
    if (!window.confirm(`Delete verification for order "${row.orderNumber}"?`)) return;
    try {
      await deletePaymentVerification(row.id);
      royalToast.success("Verification deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Payment Verification</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Verification
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Verification List"
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
            subtitle={(r) => r.utrNumber}
            status={(r) => ({
              label: r.verificationStatus,
              tone: statusTone(r.verificationStatus),
            })}
            fields={(r) => [
              { label: "Customer", value: r.customerName },
              { label: "Amount", value: formatCurrency(r.paymentAmount) },
              { label: "Verified", value: formatDate(r.verificationTime) },
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
