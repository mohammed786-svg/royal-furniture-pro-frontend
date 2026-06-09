"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { CategoryFormModal } from "@/components/admin/catalog/category-form-modal";
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
import {
  createCatalogItem,
  deleteCatalogItem,
  fetchCatalogOptions,
  fetchCategories,
  fetchSubCategories,
  fetchUnderSubCategories,
  updateCatalogItem,
} from "@/services/catalog-categories";
import type {
  CatalogOption,
  CategoryFormValues,
  CategoryItem,
  CategoryLevel,
  PaginationMeta,
  SubCategoryItem,
  SubCategoryOption,
  UnderSubCategoryItem,
} from "@/types/catalog";

const TABS: { key: CategoryLevel; label: string }[] = [
  { key: "categories", label: "Categories" },
  { key: "sub-categories", label: "Sub Categories" },
  { key: "under-sub-categories", label: "Under Sub Categories" },
];

type RowItem = CategoryItem | SubCategoryItem | UnderSubCategoryItem;

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

function itemToForm(item: RowItem, level: CategoryLevel): Partial<CategoryFormValues> {
  const base = {
    name: item.name,
    slug: item.slug,
    imageUrl: item.imageUrl ?? "",
    iconUrl: item.iconUrl ?? "",
    bannerUrl: item.bannerUrl ?? "",
    seoTitle: item.seoTitle ?? "",
    seoDescription: item.seoDescription ?? "",
    seoKeywords: item.seoKeywords ?? "",
    displayOrder: item.displayOrder,
    isVisible: item.isVisible,
    isActive: item.isActive,
    categoryId: "",
    subCategoryId: "",
  };
  if (level === "categories") {
    return { ...base, isFeatured: (item as CategoryItem).isFeatured };
  }
  if (level === "sub-categories") {
    const row = item as SubCategoryItem;
    return { ...base, categoryId: row.categoryId, isFeatured: false };
  }
  const row = item as UnderSubCategoryItem;
  return { ...base, categoryId: row.categoryId, subCategoryId: row.subCategoryId };
}

export function CategoriesManager() {
  const [level, setLevel] = useState<CategoryLevel>("categories");
  const [rows, setRows] = useState<RowItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("display_order-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RowItem | null>(null);
  const [categories, setCategories] = useState<CatalogOption[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadOptions = useCallback(async () => {
    const data = await fetchCatalogOptions();
    setCategories(data.categories);
    setSubCategories(data.subCategories);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: sortField, sortDir } = parseSort(sortBy);
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sortField,
        sortDir,
      };
      if (level === "categories") {
        const data = await fetchCategories(params);
        setRows(data.items);
        setPagination(data.pagination);
      } else if (level === "sub-categories") {
        const data = await fetchSubCategories(params);
        setRows(data.items);
        setPagination(data.pagination);
      } else {
        const data = await fetchUnderSubCategories(params);
        setRows(data.items);
        setPagination(data.pagination);
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load categories"));
    } finally {
      setLoading(false);
    }
  }, [level, pagination.page, pagination.pageSize, debouncedSearch, sortBy]);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
    setSelectedIds(new Set());
  }, [level, debouncedSearch, sortBy]);

  const columns = useMemo((): AdminTableColumn<RowItem>[] => {
    if (level === "categories") {
      return [
        {
          key: "id",
          label: "ID",
          render: (row) => <span className="admin-data-link">#{row.id}</span>,
        },
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        {
          key: "subCategoryCount",
          label: "Sub Categories",
          render: (row) => String((row as CategoryItem).subCategoryCount ?? 0),
        },
        {
          key: "displayOrder",
          label: "Order",
          render: (row) => String(row.displayOrder),
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
      ];
    }
    if (level === "sub-categories") {
      return [
        {
          key: "id",
          label: "ID",
          render: (row) => <span className="admin-data-link">#{row.id}</span>,
        },
        {
          key: "categoryName",
          label: "Category",
          render: (row) => (row as SubCategoryItem).categoryName,
        },
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        {
          key: "underSubCategoryCount",
          label: "Under Sub",
          render: (row) => String((row as SubCategoryItem).underSubCategoryCount ?? 0),
        },
        {
          key: "displayOrder",
          label: "Order",
          render: (row) => String(row.displayOrder),
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
      ];
    }
    return [
      {
        key: "id",
        label: "ID",
        render: (row) => <span className="admin-data-link">#{row.id}</span>,
      },
      {
        key: "categoryName",
        label: "Category",
        render: (row) => (row as UnderSubCategoryItem).categoryName,
      },
      {
        key: "subCategoryName",
        label: "Sub Category",
        render: (row) => (row as UnderSubCategoryItem).subCategoryName,
      },
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      {
        key: "displayOrder",
        label: "Order",
        render: (row) => String(row.displayOrder),
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
    ];
  }, [level]);

  async function handleSave(values: Partial<CategoryFormValues>) {
    if (editing) {
      await updateCatalogItem(level, editing.id, values);
      royalToast.success("Updated successfully");
    } else {
      await createCatalogItem(level, values);
      royalToast.success("Created successfully");
    }
    await loadData();
    await loadOptions();
  }

  async function handleDelete(row: RowItem) {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    try {
      await deleteCatalogItem(level, row.id);
      royalToast.success("Deleted successfully");
      await loadData();
      await loadOptions();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  const tabLabel = TABS.find((t) => t.key === level)?.label ?? "Categories";

  return (
    <>
      <div className="admin-data-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={level === tab.key ? "active" : ""}
            onClick={() => {
              setLevel(tab.key);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
          >
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-data-add-btn"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} />
          Add {tabLabel.replace(/s$/, "")}
        </button>
      </div>

      <div className="admin-data-card">
        <AdminDataToolbar
          title={tabLabel}
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
            onEdit={(row) => {
              setEditing(row);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        ) : (
          <AdminDataGrid
            rows={rows}
            loading={loading}
            imageKey="imageUrl"
            subtitle={(row) => {
              if (level === "sub-categories")
                return (row as SubCategoryItem).categoryName;
              if (level === "under-sub-categories") {
                const r = row as UnderSubCategoryItem;
                return `${r.categoryName} / ${r.subCategoryName}`;
              }
              return row.slug;
            }}
            status={(row) => ({
              label: row.isActive ? "Active" : "Inactive",
              tone: row.isActive ? "active" : "inactive",
            })}
            fields={(row) => [
              { label: "Slug", value: row.slug },
              { label: "Order", value: String(row.displayOrder) },
              {
                label: "Visible",
                value: row.isVisible ? "Yes" : "No",
              },
            ]}
            onEdit={(row) => {
              setEditing(row);
              setModalOpen(true);
            }}
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

      <CategoryFormModal
        open={modalOpen}
        level={level}
        initial={editing ? itemToForm(editing, level) : undefined}
        categories={categories}
        subCategories={subCategories}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
        loading={loading}
      />
    </>
  );
}
