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
import { royalToast } from "@/lib/toast/royal-toast";
import { deleteTag, fetchTags } from "@/services/catalog-tags";
import type { PaginationMeta } from "@/types/catalog";
import type { TagItem } from "@/types/tags";

const NEW_PATH = "/my-admin/catalog/tags/new";
const BASE_PATH = "/my-admin/catalog/tags";

type GridRow = TagItem & { name: string };

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

export function TagsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<TagItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("tagName-asc");
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
      const data = await fetchTags({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load tags"));
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

  const gridRows = useMemo(
    (): GridRow[] => rows.map((r) => ({ ...r, name: r.tagName })),
    [rows],
  );

  const columns = useMemo(
    (): AdminTableColumn<TagItem>[] => [
      {
        key: "tagName",
        label: "Tag",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.tagName}
          </button>
        ),
      },
      { key: "slug", label: "Slug" },
      { key: "productCount", label: "Products" },
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

  async function handleDelete(row: TagItem) {
    if (!window.confirm(`Delete tag "${row.tagName}"?`)) return;
    try {
      await deleteTag(row.id);
      royalToast.success("Tag deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Product Tags</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Tag
        </Link>
      </div>
      <div className="admin-data-card">
        <AdminDataToolbar
          title="Tag List"
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
            rows={gridRows}
            loading={loading}
            subtitle={(r) => r.slug}
            status={(r) => ({
              label: r.isActive ? "Active" : "Inactive",
              tone: r.isActive ? "active" : "inactive",
            })}
            fields={(r) => [{ label: "Products", value: String(r.productCount) }]}
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
