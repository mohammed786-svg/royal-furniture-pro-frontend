"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminBarChart } from "@/components/admin/charts/admin-bar-chart";
import { AdminDonutChart } from "@/components/admin/charts/admin-donut-chart";
import { AdminPeriodTabs } from "@/components/admin/charts/admin-period-tabs";
import { AdminStatCards } from "@/components/admin/charts/admin-stat-cards";
import { AdminConnectionPanel } from "@/components/admin/shared/admin-connection-panel";
import { useAdminAuthStore } from "@/lib/admin/auth-store";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  classifyConnectionIssue,
  type ConnectionIssueKind,
} from "@/lib/connectivity/connection-issue";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchSalesDashboard } from "@/services/analytics-api";
import type { AnalyticsPeriod, SalesDashboard } from "@/types/analytics";

function formatChange(percent: number) {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent}%`;
}

export function SalesAnalyticsPage() {
  const user = useAdminAuthStore((s) => s.user);
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [data, setData] = useState<SalesDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionIssue, setConnectionIssue] = useState<ConnectionIssueKind>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchSalesDashboard(period));
      setConnectionIssue(null);
    } catch (err) {
      const issue = classifyConnectionIssue(err);
      setConnectionIssue(issue);
      royalToast.error(getApiErrorMessage(err, "Failed to load sales analytics"));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void load();
  }, [load]);

  const statCards = useMemo(() => {
    if (!data) return [];
    const { summary } = data;
    return [
      {
        id: "revenue",
        title: "Total Revenue",
        value: formatCurrency(summary.totalRevenue),
        icon: "IndianRupee",
        color: "#3D5EE1",
        change: formatChange(summary.revenueChangePercent),
        changeType:
          summary.revenueChangePercent >= 0 ? ("up" as const) : ("down" as const),
      },
      {
        id: "orders",
        title: "Total Orders",
        value: summary.totalOrders.toLocaleString("en-IN"),
        icon: "ShoppingCart",
        color: "#1CBEAA",
        change: formatChange(summary.ordersChangePercent),
        changeType:
          summary.ordersChangePercent >= 0 ? ("up" as const) : ("down" as const),
      },
      {
        id: "aov",
        title: "Avg Order Value",
        value: formatCurrency(summary.avgOrderValue),
        icon: "TrendingUp",
        color: "#FFA726",
      },
      {
        id: "change",
        title: "Revenue Change",
        value: formatChange(summary.revenueChangePercent),
        icon: "BarChart3",
        color: summary.revenueChangePercent >= 0 ? "#1CBEAA" : "#E74C3C",
        change: `vs previous ${period}`,
        changeType:
          summary.revenueChangePercent >= 0 ? ("up" as const) : ("down" as const),
      },
    ];
  }, [data, period]);

  if (loading && !data) {
    return (
      <div className="admin-product-form-loading">
        <div className="admin-inline-spinner" />
        <p>Loading sales analytics...</p>
      </div>
    );
  }

  if (!loading && !data && connectionIssue) {
    return (
      <div className="admin-analytics-section">
        <AdminConnectionPanel
          kind={connectionIssue}
          onRetry={() => void load()}
          loading={loading}
          title="Sales analytics unavailable"
        />
      </div>
    );
  }

  return (
    <div className="admin-analytics-section">
      {connectionIssue ? (
        <AdminConnectionPanel
          kind={connectionIssue}
          onRetry={() => void load()}
          loading={loading}
          title="Could not refresh sales data"
        />
      ) : null}

      <div className="admin-analytics-toolbar">
        <AdminPeriodTabs value={period} onChange={setPeriod} />
      </div>
      <div className="admin-welcome-banner">
        <div>
          <h2>Sales Overview, {user?.fullName ?? "Admin"}</h2>
          <p>Revenue, orders, and product performance for the selected period.</p>
        </div>
        <p className="relative z-10 text-xs opacity-75">
          Period:{" "}
          {period === "7d"
            ? "Last 7 days"
            : period === "30d"
              ? "Last 30 days"
              : "Last 90 days"}
        </p>
      </div>

      <AdminStatCards items={statCards} />

      <div className="admin-widgets-grid">
        <div className="admin-widget-card span-2">
          <div className="admin-widget-header">
            <h3>Revenue Trend</h3>
          </div>
          <AdminBarChart
            data={data?.revenueTrend ?? []}
            valueFormatter={(v) => formatCurrency(v)}
          />
        </div>

        <div className="admin-widget-card">
          <div className="admin-widget-header">
            <h3>Orders by Status</h3>
          </div>
          <AdminDonutChart segments={data?.ordersByStatus ?? []} showPercentages />
        </div>
      </div>

      <div className="admin-analytics-grid">
        <div className="admin-widget-card">
          <div className="admin-widget-header">
            <h3>Top Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--admin-border)] text-left text-xs text-[var(--admin-muted)]">
                  <th className="pb-2 pr-4">Product</th>
                  <th className="pb-2 pr-4">SKU</th>
                  <th className="pb-2 pr-4">Qty</th>
                  <th className="pb-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topProducts ?? []).map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[var(--admin-border)] last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">{product.name}</td>
                    <td className="py-3 pr-4 text-[var(--admin-muted)]">
                      {product.sku}
                    </td>
                    <td className="py-3 pr-4">{product.quantity}</td>
                    <td className="py-3">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
                {(data?.topProducts ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-[var(--admin-muted)]"
                    >
                      No product data for this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-widget-card">
          <div className="admin-widget-header">
            <h3>Recent Orders</h3>
            <Link
              href="/my-admin/orders"
              className="text-sm text-[var(--admin-primary)] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--admin-border)] text-left text-xs text-[var(--admin-muted)]">
                  <th className="pb-2 pr-4">Order</th>
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders ?? []).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--admin-border)] last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/my-admin/orders/${order.id}`}
                        className="admin-data-link"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{order.customerName}</td>
                    <td className="py-3 pr-4">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-[#e8f0fe] px-2 py-0.5 text-xs text-[#3D5EE1]">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--admin-muted)]">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
                {(data?.recentOrders ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-[var(--admin-muted)]"
                    >
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
