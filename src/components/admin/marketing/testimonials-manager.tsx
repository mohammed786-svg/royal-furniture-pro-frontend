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
import { deleteTestimonial, fetchTestimonials } from "@/services/marketing-api";
import type { PaginationMeta } from "@/types/catalog";
import type { TestimonialItem } from "@/types/marketing";

const NEW_PATH = "/admin/marketing/testimonials/new";
const BASE_PATH = "/admin/marketing/testimonials";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function TestimonialsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<TestimonialItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("displayOrder-asc");
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
      const data = await fetchTestimonials({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load testimonials"));
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
    (): AdminTableColumn<TestimonialItem>[] => [
      {
        key: "customerImage",
        label: "Photo",
        render: (r) => {
          const src = resolveMediaUrl(r.customerImage);
          return src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={r.customerName}
              className="admin-table-thumb rounded-full"
            />
          ) : (
            <span className="admin-table-thumb-placeholder">—</span>
          );
        },
      },
      {
        key: "customerName",
        label: "Customer",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.customerName}
          </button>
        ),
      },
      {
        key: "rating",
        label: "Rating",
        render: (r) => <span className="text-amber-500">{renderStars(r.rating)}</span>,
      },
      {
        key: "productName",
        label: "Product",
        render: (r) => r.productName ?? "—",
      },
      {
        key: "isFeatured",
        label: "Featured",
        render: (r) => (
          <span
            className={`admin-status-badge ${r.isFeatured ? "active" : "inactive"}`}
          >
            {r.isFeatured ? "Yes" : "No"}
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
    ],
    [router],
  );

  async function handleDelete(row: TestimonialItem) {
    if (!window.confirm(`Delete testimonial from "${row.customerName}"?`)) return;
    try {
      await deleteTestimonial(row.id);
      royalToast.success("Testimonial deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Testimonials</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Testimonial
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Testimonial List"
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
            rows={rows.map((r) => ({ ...r, name: r.customerName }))}
            loading={loading}
            subtitle={(r) => r.productName ?? "—"}
            status={(r) => ({
              label: r.isActive ? "Active" : "Inactive",
              tone: r.isActive ? "active" : "inactive",
            })}
            fields={(r) => [
              { label: "Rating", value: renderStars(r.rating) },
              { label: "Featured", value: r.isFeatured ? "Yes" : "No" },
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
