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
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { deleteProduct, fetchProducts } from "@/services/catalog-products";
import type { PaginationMeta } from "@/types/catalog";
import type { ProductListItem } from "@/types/product";

const PRODUCTS_NEW_PATH = "/my-admin/catalog/products/new";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function ProductsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<ProductListItem[]>([]);
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: sortField, sortDir } = parseSort(sortBy);
      const data = await fetchProducts({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sortField,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load products"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
    setSelectedIds(new Set());
  }, [debouncedSearch, sortBy]);

  const columns = useMemo(
    (): AdminTableColumn<ProductListItem>[] => [
      {
        key: "id",
        label: "ID",
        render: (row) => <span className="admin-data-link">#{row.id}</span>,
      },
      {
        key: "primaryImageUrl",
        label: "Image",
        render: (row) => {
          const src = resolveMediaUrl(row.primaryImageUrl);
          return src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={row.name} className="admin-table-thumb" />
          ) : (
            <span className="admin-table-thumb-placeholder">{row.name.charAt(0)}</span>
          );
        },
      },
      { key: "name", label: "Product" },
      { key: "sku", label: "SKU" },
      {
        key: "categoryName",
        label: "Category",
        render: (row) => (
          <span>
            {row.categoryName}
            {row.subCategoryName ? ` / ${row.subCategoryName}` : ""}
            {row.underSubCategoryName ? ` / ${row.underSubCategoryName}` : ""}
          </span>
        ),
      },
      {
        key: "salePrice",
        label: "Price",
        render: (row) => formatPrice(row.salePrice || row.basePrice),
      },
      {
        key: "isActive",
        label: "Status",
        render: (row) => (
          <span
            className={`admin-status-badge ${row.isActive ? "active" : "inactive"}`}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    [],
  );

  function openEdit(row: ProductListItem) {
    router.push(`/my-admin/catalog/products/${row.id}/edit`);
  }

  async function handleDelete(row: ProductListItem) {
    if (!window.confirm(`Delete product "${row.name}"?`)) return;
    try {
      await deleteProduct(row.id);
      royalToast.success("Product deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Products</h3>
        <Link
          href={PRODUCTS_NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="admin-data-card">
        <AdminDataToolbar
          title="Product List"
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
            selectedIds={selectedIds}
            onToggleSelect={(id) => {
              setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              });
            }}
            onToggleSelectAll={() => {
              if (rows.every((r) => selectedIds.has(r.id))) {
                setSelectedIds(new Set());
              } else {
                setSelectedIds(new Set(rows.map((r) => r.id)));
              }
            }}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ) : (
          <AdminDataGrid
            rows={rows}
            loading={loading}
            imageKey="primaryImageUrl"
            subtitle={(row) => row.sku}
            status={(row) => ({
              label: row.isActive ? "Active" : "Inactive",
              tone: row.isActive ? "active" : "inactive",
            })}
            fields={(row) => [
              { label: "Category", value: row.categoryName },
              { label: "Price", value: formatPrice(row.salePrice || row.basePrice) },
              { label: "Brand", value: row.brandName ?? "—" },
            ]}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}

        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
          onPageSizeChange={(pageSize) =>
            setPagination((p) => ({ ...p, pageSize, page: 1 }))
          }
        />
      </div>
    </>
  );
}
