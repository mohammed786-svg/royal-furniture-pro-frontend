"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminBarChart } from "@/components/admin/charts/admin-bar-chart";
import { AdminPeriodTabs } from "@/components/admin/charts/admin-period-tabs";
import { AdminStatCards } from "@/components/admin/charts/admin-stat-cards";
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
import {
  deleteSearch,
  fetchSearchDashboard,
  fetchSearches,
} from "@/services/analytics-api";
import type {
  AnalyticsPeriod,
  SearchDashboard,
  SearchHistoryItem,
} from "@/types/analytics";
import type { PaginationMeta } from "@/types/catalog";

const NEW_PATH = "/my-admin/analytics/search/new";
const BASE_PATH = "/my-admin/analytics/search";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function SearchAnalyticsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [dashboard, setDashboard] = useState<SearchDashboard | null>(null);
  const [rows, setRows] = useState<SearchHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("searchedAt-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      setDashboard(await fetchSearchDashboard(period));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load search dashboard"));
    } finally {
      setLoadingDashboard(false);
    }
  }, [period]);

  const loadTable = useCallback(async () => {
    setLoadingTable(true);
    try {
      const { sortBy: sf, sortDir } = parseSort(sortBy);
      const data = await fetchSearches({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load search history"));
    } finally {
      setLoadingTable(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);
  useEffect(() => {
    void loadTable();
  }, [loadTable]);
  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [debouncedSearch, sortBy]);

  const statCards = useMemo(() => {
    if (!dashboard) return [];
    const { summary } = dashboard;
    return [
      {
        id: "searches",
        title: "Total Searches",
        value: summary.totalSearches.toLocaleString("en-IN"),
        icon: "Search",
        color: "#3D5EE1",
      },
      {
        id: "avg-results",
        title: "Avg Results",
        value: summary.avgResults.toLocaleString("en-IN"),
        icon: "ListChecks",
        color: "#1CBEAA",
      },
      {
        id: "zero-rate",
        title: "Zero Result Rate",
        value: `${summary.zeroResultRate}%`,
        icon: "AlertTriangle",
        color: "#E74C3C",
      },
    ];
  }, [dashboard]);

  const columns = useMemo(
    (): AdminTableColumn<SearchHistoryItem>[] => [
      {
        key: "searchQuery",
        label: "Query",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.searchQuery}
          </button>
        ),
      },
      { key: "resultsCount", label: "Results" },
      { key: "sessionId", label: "Session" },
      {
        key: "searchedAt",
        label: "Searched At",
        render: (r) => formatDate(r.searchedAt),
      },
    ],
    [router],
  );

  async function handleDelete(row: SearchHistoryItem) {
    if (!window.confirm(`Delete search "${row.searchQuery}"?`)) return;
    try {
      await deleteSearch(row.id);
      royalToast.success("Search record deleted");
      await loadTable();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <div className="admin-analytics-section">
      <div className="admin-analytics-toolbar">
        <AdminPeriodTabs value={period} onChange={setPeriod} />
      </div>

      {loadingDashboard && !dashboard ? (
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <AdminStatCards items={statCards} />

          <div className="admin-widgets-grid">
            <div className="admin-widget-card">
              <div className="admin-widget-header">
                <h3>Top Queries</h3>
              </div>
              <AdminBarChart
                data={(dashboard?.topQueries ?? []).map((q) => ({
                  label: q.query,
                  value: q.count,
                }))}
                orientation="horizontal"
                barColor="#3D5EE1"
              />
            </div>

            <div className="admin-widget-card">
              <div className="admin-widget-header">
                <h3>Search Trend</h3>
              </div>
              <AdminBarChart data={dashboard?.searchesTrend ?? []} barColor="#1CBEAA" />
            </div>

            <div className="admin-widget-card">
              <div className="admin-widget-header">
                <h3>Zero-Result Queries</h3>
              </div>
              <AdminBarChart
                data={(dashboard?.zeroResultQueries ?? []).map((q) => ({
                  label: q.query,
                  value: q.count,
                }))}
                orientation="horizontal"
                barColor="#E74C3C"
              />
            </div>
          </div>
        </>
      )}

      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Search History</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Search Record
        </Link>
      </div>

      <div className="admin-data-card">
        <AdminDataToolbar
          title="Search Records"
          search={search}
          viewMode={viewMode}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onViewModeChange={setViewMode}
          onSortChange={setSortBy}
          onRefresh={() => void loadTable()}
        />
        {viewMode === "table" ? (
          <AdminDataTable
            columns={columns}
            rows={rows}
            loading={loadingTable}
            selectedIds={new Set()}
            onToggleSelect={() => {}}
            onToggleSelectAll={() => {}}
            onEdit={(row) => router.push(`${BASE_PATH}/${row.id}/edit`)}
            onDelete={handleDelete}
          />
        ) : (
          <AdminDataGrid
            rows={rows.map((r) => ({ ...r, name: r.searchQuery }))}
            loading={loadingTable}
            subtitle={(r) => `${r.resultsCount} results`}
            fields={(r) => [{ label: "Searched", value: formatDate(r.searchedAt) }]}
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
    </div>
  );
}
