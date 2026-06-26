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
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { deleteBanner, fetchBanners } from "@/services/marketing-api";
import type { PaginationMeta } from "@/types/catalog";
import type { BannerItem } from "@/types/marketing";

const NEW_PATH = "/my-admin/marketing/banners/new";
const BASE_PATH = "/my-admin/marketing/banners";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

export function BannersManager() {
  const router = useRouter();
  const [rows, setRows] = useState<BannerItem[]>([]);
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
      const data = await fetchBanners({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load banners"));
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
    (): AdminTableColumn<BannerItem>[] => [
      {
        key: "imageUrl",
        label: "Image",
        render: (r) => {
          const src = resolveMediaUrl(r.imageUrl);
          return src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={r.title} className="admin-table-thumb" />
          ) : (
            <span className="admin-table-thumb-placeholder">—</span>
          );
        },
      },
      {
        key: "title",
        label: "Title",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.title}
          </button>
        ),
      },
      {
        key: "positionName",
        label: "Position",
        render: (r) => r.positionName ?? r.positionCode ?? "—",
      },
      { key: "displayOrder", label: "Order" },
      {
        key: "startsAt",
        label: "Schedule",
        render: (r) => (
          <span className="text-xs">
            {formatDate(r.startsAt)} — {formatDate(r.endsAt)}
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

  async function handleDelete(row: BannerItem) {
    if (!window.confirm(`Delete banner "${row.title}"?`)) return;
    try {
      await deleteBanner(row.id);
      royalToast.success("Banner deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Banners</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Banner
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Banner List"
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
            rows={rows.map((r) => ({ ...r, name: r.title }))}
            loading={loading}
            subtitle={(r) => r.positionName ?? r.positionCode ?? "—"}
            status={(r) => ({
              label: r.isActive ? "Active" : "Inactive",
              tone: r.isActive ? "active" : "inactive",
            })}
            fields={(r) => [
              { label: "Order", value: String(r.displayOrder) },
              { label: "Category", value: r.categoryName ?? "—" },
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
