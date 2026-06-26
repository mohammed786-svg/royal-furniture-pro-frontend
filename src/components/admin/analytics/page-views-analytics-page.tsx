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
  deletePageView,
  fetchPageViewDashboard,
  fetchPageViews,
} from "@/services/analytics-api";
import type {
  AnalyticsPeriod,
  PageViewDashboard,
  PageViewItem,
} from "@/types/analytics";
import type { PaginationMeta } from "@/types/catalog";

const NEW_PATH = "/my-admin/analytics/page-views/new";
const BASE_PATH = "/my-admin/analytics/page-views";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

export function PageViewsAnalyticsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [dashboard, setDashboard] = useState<PageViewDashboard | null>(null);
  const [rows, setRows] = useState<PageViewItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("viewedAt-desc");
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
      setDashboard(await fetchPageViewDashboard(period));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load page view dashboard"));
    } finally {
      setLoadingDashboard(false);
    }
  }, [period]);

  const loadTable = useCallback(async () => {
    setLoadingTable(true);
    try {
      const { sortBy: sf, sortDir } = parseSort(sortBy);
      const data = await fetchPageViews({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load page views"));
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
        id: "views",
        title: "Total Views",
        value: summary.totalViews.toLocaleString("en-IN"),
        icon: "Eye",
        color: "#3D5EE1",
      },
      {
        id: "sessions",
        title: "Unique Sessions",
        value: summary.uniqueSessions.toLocaleString("en-IN"),
        icon: "Users",
        color: "#1CBEAA",
      },
      {
        id: "referrer",
        title: "Top Referrer",
        value: summary.topReferrer || "Direct",
        icon: "Route",
        color: "#FFA726",
      },
    ];
  }, [dashboard]);

  const columns = useMemo(
    (): AdminTableColumn<PageViewItem>[] => [
      {
        key: "pageUrl",
        label: "Page URL",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.pageUrl}
          </button>
        ),
      },
      { key: "pageTitle", label: "Title" },
      { key: "sessionId", label: "Session" },
      {
        key: "viewedAt",
        label: "Viewed At",
        render: (r) => formatDate(r.viewedAt),
      },
    ],
    [router],
  );

  async function handleDelete(row: PageViewItem) {
    if (!window.confirm(`Delete page view for "${row.pageUrl}"?`)) return;
    try {
      await deletePageView(row.id);
      royalToast.success("Page view deleted");
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
            <div className="admin-widget-card span-2">
              <div className="admin-widget-header">
                <h3>Views Trend</h3>
              </div>
              <AdminBarChart data={dashboard?.viewsTrend ?? []} barColor="#3D5EE1" />
            </div>

            <div className="admin-widget-card">
              <div className="admin-widget-header">
                <h3>Top Pages</h3>
              </div>
              <AdminBarChart
                data={(dashboard?.topPages ?? []).map((p) => ({
                  label: p.pageTitle || p.pageUrl,
                  value: p.views,
                }))}
                orientation="horizontal"
                barColor="#1CBEAA"
              />
            </div>
          </div>
        </>
      )}

      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Page Views</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Page View
        </Link>
      </div>

      <div className="admin-data-card">
        <AdminDataToolbar
          title="Page View Records"
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
            rows={rows.map((r) => ({ ...r, name: r.pageUrl }))}
            loading={loadingTable}
            subtitle={(r) => r.pageTitle || r.sessionId}
            fields={(r) => [{ label: "Viewed", value: formatDate(r.viewedAt) }]}
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
