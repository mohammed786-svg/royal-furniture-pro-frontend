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
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { deleteAddress, fetchAddresses } from "@/services/customers-api";
import type { PaginationMeta } from "@/types/catalog";
import type { AddressItem } from "@/types/customers";

const NEW_PATH = "/my-admin/customers/addresses/new";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function AddressesManager() {
  const router = useRouter();
  const [rows, setRows] = useState<AddressItem[]>([]);
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
      const data = await fetchAddresses({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load addresses"));
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
    (): AdminTableColumn<AddressItem>[] => [
      { key: "customerName", label: "Customer" },
      {
        key: "fullName",
        label: "Name",
        render: (r) => <span className="admin-data-link">{r.fullName}</span>,
      },
      { key: "addressType", label: "Type" },
      { key: "city", label: "City" },
      { key: "pincode", label: "Pincode" },
      {
        key: "isDefault",
        label: "Default",
        render: (r) => (
          <span className={`admin-status-badge ${r.isDefault ? "active" : "inactive"}`}>
            {r.isDefault ? "Yes" : "No"}
          </span>
        ),
      },
      { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
    ],
    [],
  );

  async function handleDelete(row: AddressItem) {
    if (!window.confirm(`Delete address for "${row.fullName}"?`)) return;
    try {
      await deleteAddress(row.id);
      royalToast.success("Address deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Addresses</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Address
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Address List"
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
          onEdit={(row) => router.push(`/my-admin/customers/addresses/${row.id}/edit`)}
          onDelete={handleDelete}
        />
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
