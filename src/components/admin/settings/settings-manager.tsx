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
import {
  deleteSetting,
  fetchSettingGroups,
  fetchSettings,
} from "@/services/settings-api";
import type { PaginationMeta } from "@/types/catalog";
import type { SettingItem } from "@/types/settings";

const NEW_PATH = "/admin/settings/new";
const BASE_PATH = "/admin/settings";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "asc" };
}

export function SettingsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<SettingItem[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("settingKey-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    void fetchSettingGroups()
      .then(setGroups)
      .catch(() => {});
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: sf, sortDir } = parseSort(sortBy);
      const data = await fetchSettings({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        group: activeGroup || undefined,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load settings"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy, activeGroup]);

  useEffect(() => {
    void loadData();
  }, [loadData]);
  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [debouncedSearch, sortBy, activeGroup]);

  const columns = useMemo(
    (): AdminTableColumn<SettingItem>[] => [
      {
        key: "settingKey",
        label: "Key",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}/edit`)}
          >
            {r.settingKey}
          </button>
        ),
      },
      {
        key: "settingValue",
        label: "Value",
        render: (r) => (
          <span className="truncate max-w-[200px] inline-block" title={r.settingValue}>
            {r.isEncrypted ? "••••••" : r.settingValue || "—"}
          </span>
        ),
      },
      { key: "settingGroup", label: "Group", render: (r) => r.settingGroup || "—" },
      { key: "valueType", label: "Type" },
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

  async function handleDelete(row: SettingItem) {
    if (!window.confirm(`Delete setting "${row.settingKey}"?`)) return;
    try {
      await deleteSetting(row.id);
      royalToast.success("Setting deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Store Settings</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Setting
        </Link>
      </div>
      <div className="admin-data-card">
        <div className="admin-data-filter-tabs">
          <button
            type="button"
            className={activeGroup === "" ? "active" : ""}
            onClick={() => setActiveGroup("")}
          >
            All Groups
          </button>
          {groups.map((group) => (
            <button
              key={group}
              type="button"
              className={activeGroup === group ? "active" : ""}
              onClick={() => setActiveGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
        <AdminDataToolbar
          title="Settings List"
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
            rows={rows.map((r) => ({ ...r, name: r.settingKey }))}
            loading={loading}
            subtitle={(r) => r.settingGroup || "General"}
            status={(r) => ({
              label: r.isActive ? "Active" : "Inactive",
              tone: r.isActive ? "active" : "inactive",
            })}
            fields={(r) => [
              {
                label: "Value",
                value: r.isEncrypted ? "••••••" : r.settingValue || "—",
              },
              { label: "Type", value: r.valueType },
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
