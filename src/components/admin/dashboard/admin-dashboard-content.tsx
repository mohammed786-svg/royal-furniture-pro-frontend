"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { AdminBarChart } from "@/components/admin/charts/admin-bar-chart";
import { AdminDonutChart } from "@/components/admin/charts/admin-donut-chart";
import { AdminPeriodTabs } from "@/components/admin/charts/admin-period-tabs";
import { AdminStatCards } from "@/components/admin/charts/admin-stat-cards";
import { AdminIcon } from "@/components/admin/layout/admin-icon";
import { AdminConnectionPanel } from "@/components/admin/shared/admin-connection-panel";
import { useAdminAuthStore } from "@/lib/admin/auth-store";
import { quickLinks } from "@/lib/admin/dashboard-data";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  classifyConnectionIssue,
  type ConnectionIssueKind,
} from "@/lib/connectivity/connection-issue";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchSalesDashboard } from "@/services/analytics-api";
import type { AnalyticsPeriod, SalesDashboard } from "@/types/analytics";

const DASHBOARD_PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "1 Month" },
];

function periodLabel(period: AnalyticsPeriod) {
  return period === "7d" ? "7 days" : "1 month";
}

function formatChange(percent: number) {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent}%`;
}

function statusClass(status: string) {
  const key = status.toLowerCase();
  if (key.includes("deliver")) return "bg-[#e8f8f5] text-[#1CBEAA]";
  if (key.includes("ship")) return "bg-[#e8f0fe] text-[#3D5EE1]";
  if (key.includes("cancel") || key.includes("return") || key.includes("refund")) {
    return "bg-[#fdecea] text-[#E74C3C]";
  }
  if (key.includes("pending") || key.includes("payment"))
    return "bg-[#f3e5f5] text-[#9C27B0]";
  return "bg-[#fff3e0] text-[#FFA726]";
}

export function AdminDashboardContent() {
  const user = useAdminAuthStore((s) => s.user);
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [data, setData] = useState<SalesDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionIssue, setConnectionIssue] = useState<ConnectionIssueKind>(null);
  const [showAlert, setShowAlert] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchSalesDashboard(period));
      setConnectionIssue(null);
    } catch (err) {
      const issue = classifyConnectionIssue(err);
      setConnectionIssue(issue);
      if (!issue) {
        setData(null);
      }
      royalToast.error(getApiErrorMessage(err, "Failed to load dashboard"));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onOrderEvent = () => {
      void load();
    };
    window.addEventListener("admin-order-notification", onOrderEvent);
    return () => window.removeEventListener("admin-order-notification", onOrderEvent);
  }, [load]);

  const statCards = useMemo(() => {
    if (!data) return [];
    const { summary, catalogStats, orderStats } = data;
    const customers = catalogStats ?? {
      totalCustomers: 0,
      activeCustomers: 0,
      inactiveCustomers: 0,
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      customersChangePercent: 0,
      productsChangePercent: 0,
    };
    const orders = orderStats ?? { totalOrders: 0, activeOrders: 0, inactiveOrders: 0 };

    return [
      {
        id: "orders",
        title: "Total Orders",
        value: orders.totalOrders.toLocaleString("en-IN"),
        icon: "ShoppingCart",
        color: "#3D5EE1",
        change: formatChange(summary.ordersChangePercent),
        changeType:
          summary.ordersChangePercent >= 0 ? ("up" as const) : ("down" as const),
        footer: [
          { label: "Active", value: orders.activeOrders.toLocaleString("en-IN") },
          { label: "Closed", value: orders.inactiveOrders.toLocaleString("en-IN") },
        ],
      },
      {
        id: "revenue",
        title: `Revenue (${periodLabel(period)})`,
        value: formatCurrency(summary.totalRevenue),
        icon: "IndianRupee",
        color: "#1CBEAA",
        change: formatChange(summary.revenueChangePercent),
        changeType:
          summary.revenueChangePercent >= 0 ? ("up" as const) : ("down" as const),
        footer: [
          {
            label: "Orders",
            value: (summary.revenueOrders ?? 0).toLocaleString("en-IN"),
          },
          { label: "AOV", value: formatCurrency(summary.avgOrderValue) },
        ],
      },
      {
        id: "customers",
        title: "Total Customers",
        value: customers.totalCustomers.toLocaleString("en-IN"),
        icon: "Users",
        color: "#FFA726",
        change: formatChange(customers.customersChangePercent),
        changeType:
          customers.customersChangePercent >= 0 ? ("up" as const) : ("down" as const),
        footer: [
          { label: "Active", value: customers.activeCustomers.toLocaleString("en-IN") },
          {
            label: "Inactive",
            value: customers.inactiveCustomers.toLocaleString("en-IN"),
          },
        ],
      },
      {
        id: "products",
        title: "Active Products",
        value: customers.activeProducts.toLocaleString("en-IN"),
        icon: "Sofa",
        color: "#E74C3C",
        change: formatChange(customers.productsChangePercent),
        changeType:
          customers.productsChangePercent >= 0 ? ("up" as const) : ("down" as const),
        footer: [
          { label: "Active", value: customers.activeProducts.toLocaleString("en-IN") },
          {
            label: "Inactive",
            value: customers.inactiveProducts.toLocaleString("en-IN"),
          },
        ],
      },
    ];
  }, [data, period]);

  const statusHighlights = useMemo(() => {
    if (!data?.ordersByStatus.length) return [];
    const total = data.ordersByStatus.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return [];
    return data.ordersByStatus.slice(0, 3).map((item) => ({
      label: item.label,
      pct: Math.round((item.value / total) * 100),
    }));
  }, [data]);

  if (loading && !data) {
    return (
      <div className="admin-product-form-loading">
        <div className="admin-inline-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!loading && !data && connectionIssue) {
    return (
      <>
        <div className="admin-page-header">
          <div>
            <h1>Admin Dashboard</h1>
            <div className="admin-breadcrumb">
              <Link href="/my-admin/dashboard">Dashboard</Link>
              <span>/</span>
              <span>Admin Dashboard</span>
            </div>
          </div>
        </div>
        <AdminConnectionPanel
          kind={connectionIssue}
          onRetry={() => void load()}
          loading={loading}
          title="Dashboard unavailable"
        />
      </>
    );
  }

  const alert = data?.alert;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <div className="admin-breadcrumb">
            <Link href="/my-admin/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Admin Dashboard</span>
          </div>
        </div>
        <div className="admin-page-actions">
          <Link
            href="/my-admin/catalog/products/new"
            className="admin-btn admin-btn-primary"
          >
            <Plus size={16} />
            Add New Product
          </Link>
          <Link href="/my-admin/payments" className="admin-btn admin-btn-outline">
            Payment Details
          </Link>
        </div>
      </div>

      {connectionIssue ? (
        <AdminConnectionPanel
          kind={connectionIssue}
          onRetry={() => void load()}
          loading={loading}
          title="Could not refresh dashboard"
        />
      ) : null}
      {showAlert && alert && (
        <div className="admin-alert-banner">
          <div className="admin-alert-avatar">{alert.avatar}</div>
          <p className="flex-1">
            {alert.message}{" "}
            <Link
              href={`/my-admin/orders/${alert.orderId}`}
              className="font-medium text-[var(--admin-primary)] hover:underline"
            >
              Review order
            </Link>
          </p>
          <button
            type="button"
            onClick={() => setShowAlert(false)}
            className="text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="admin-welcome-banner">
        <div>
          <h2>Welcome Back, {user?.fullName}</h2>
          <p>Have a good day managing Royal Furniture Pro.</p>
        </div>
        <p className="relative z-10 text-xs opacity-75">
          Updated Recently on{" "}
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <AdminStatCards items={statCards} />

      <div className="admin-widget-card admin-dashboard-chart-card">
        <div className="admin-widget-header">
          <div>
            <h3>Revenue Trend</h3>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">
              Confirmed &amp; delivered orders only
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AdminPeriodTabs
              value={period}
              onChange={setPeriod}
              periods={DASHBOARD_PERIODS}
            />
            <Link
              href="/my-admin/analytics/sales"
              className="text-xs text-[var(--admin-primary)] hover:underline"
            >
              Full report
            </Link>
          </div>
        </div>
        <AdminBarChart
          data={data?.revenueTrend ?? []}
          valueFormatter={(v) => formatCurrency(v)}
        />
      </div>

      <div className="admin-dashboard-widgets">
        <div className="admin-widget-card">
          <div className="admin-widget-header">
            <h3>Order Status</h3>
            <span className="text-xs text-[var(--admin-muted)]">
              Last {periodLabel(period)}
            </span>
          </div>
          {statusHighlights.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-4 text-xs text-[var(--admin-muted)]">
              {statusHighlights.map((item) => (
                <span key={item.label}>
                  {item.label}: {item.pct}%
                </span>
              ))}
            </div>
          )}
          <AdminDonutChart segments={data?.ordersByStatus ?? []} />
        </div>

        <div className="admin-widget-card">
          <div className="admin-widget-header">
            <h3>Quick Links</h3>
          </div>
          <div className="admin-quick-links">
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href} className="admin-quick-link">
                <div
                  className="admin-quick-link-icon"
                  style={{ background: link.color }}
                >
                  <AdminIcon name={link.icon} size={18} />
                </div>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-widget-card mt-5">
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
                <th className="pb-2 pr-4">Order ID</th>
                <th className="pb-2 pr-4">Customer</th>
                <th className="pb-2 pr-4">Amount</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders ?? []).length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-[var(--admin-muted)]"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                (data?.recentOrders ?? []).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--admin-border)] last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">
                      <Link
                        href={`/my-admin/orders/${order.id}`}
                        className="text-[var(--admin-primary)] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{order.customerName}</td>
                    <td className="py-3 pr-4">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${statusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--admin-muted)]">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
