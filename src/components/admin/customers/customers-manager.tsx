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
import { deleteCustomer, fetchCustomers } from "@/services/customers-api";
import type { PaginationMeta } from "@/types/catalog";
import type { CustomerItem } from "@/types/customers";

const NEW_PATH = "/admin/customers/new";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function CustomersManager() {
  const router = useRouter();
  const [rows, setRows] = useState<CustomerItem[]>([]);
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
      const data = await fetchCustomers({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load customers"));
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
    (): AdminTableColumn<CustomerItem>[] => [
      {
        key: "fullName",
        label: "Name",
        render: (r) => <span className="admin-data-link">{r.fullName}</span>,
      },
      { key: "email", label: "Email", render: (r) => r.email || "—" },
      { key: "phone", label: "Phone", render: (r) => r.phone || "—" },
      {
        key: "isGuest",
        label: "Type",
        render: (r) => (
          <span className={`admin-status-badge ${r.isGuest ? "inactive" : "active"}`}>
            {r.isGuest ? "Guest" : "Registered"}
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
      { key: "createdAt", label: "Joined", render: (r) => formatDate(r.createdAt) },
    ],
    [],
  );

  async function handleDelete(row: CustomerItem) {
    if (!window.confirm(`Delete customer "${row.fullName}"?`)) return;
    try {
      await deleteCustomer(row.id);
      royalToast.success("Customer deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Customers</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Customer
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Customer List"
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
            onEdit={(row) => router.push(`/admin/customers/${row.id}`)}
            onDelete={handleDelete}
          />
        ) : (
          <AdminDataGrid
            rows={rows.map((r) => ({ ...r, name: r.fullName }))}
            loading={loading}
            subtitle={(r) => r.email || r.phone}
            status={(r) => ({
              label: r.isActive ? "Active" : "Inactive",
              tone: r.isActive ? "active" : "inactive",
            })}
            fields={(r) => [
              { label: "Type", value: r.isGuest ? "Guest" : "Registered" },
              { label: "Joined", value: formatDate(r.createdAt) },
            ]}
            onEdit={(row) => router.push(`/admin/customers/${row.id}`)}
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
