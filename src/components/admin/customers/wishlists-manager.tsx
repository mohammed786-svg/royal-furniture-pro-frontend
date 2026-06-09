"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { deleteWishlist, fetchWishlists } from "@/services/customers-api";
import type { PaginationMeta } from "@/types/catalog";
import type { WishlistItem } from "@/types/customers";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function WishlistsManager() {
  const [rows, setRows] = useState<WishlistItem[]>([]);
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
      const data = await fetchWishlists({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load wishlists"));
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
    (): AdminTableColumn<WishlistItem>[] => [
      {
        key: "productImageUrl",
        label: "Image",
        render: (r) => {
          const src = resolveMediaUrl(r.productImageUrl);
          return src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={r.productName} className="admin-table-thumb" />
          ) : (
            <span className="admin-table-thumb-placeholder">
              {r.productName.charAt(0)}
            </span>
          );
        },
      },
      {
        key: "customerName",
        label: "Customer",
        render: (r) => r.customerName ?? (r.isGuest ? "Guest" : "—"),
      },
      { key: "productName", label: "Product" },
      { key: "productSku", label: "SKU" },
      {
        key: "productSalePrice",
        label: "Price",
        render: (r) => formatCurrency(r.productSalePrice),
      },
      { key: "createdAt", label: "Added", render: (r) => formatDate(r.createdAt) },
    ],
    [],
  );

  async function handleDelete(row: WishlistItem) {
    if (!window.confirm(`Remove "${row.productName}" from wishlist?`)) return;
    try {
      await deleteWishlist(row.id);
      royalToast.success("Wishlist item removed");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Wishlists</h3>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Wishlist Items"
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
          onEdit={() => {}}
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
