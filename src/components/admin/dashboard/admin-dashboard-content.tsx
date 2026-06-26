"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { AdminIcon } from "@/components/admin/layout/admin-icon";
import { useAdminAuthStore } from "@/lib/admin/auth-store";
import {
  alertBanner,
  dashboardStats,
  orderStatusBreakdown,
  quickLinks,
  recentOrders,
} from "@/lib/admin/dashboard-data";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getJuneCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return {
    cells,
    today: today.getDate(),
    month: today.toLocaleString("default", { month: "long", year: "numeric" }),
  };
}

export function AdminDashboardContent() {
  const user = useAdminAuthStore((s) => s.user);
  const [showAlert, setShowAlert] = useState(true);
  const calendar = getJuneCalendar();

  const donutGradient = orderStatusBreakdown
    .reduce(
      (acc, item, i) => {
        const start = orderStatusBreakdown.slice(0, i).reduce((s, x) => s + x.value, 0);
        const end = start + item.value;
        acc.stops.push(`${item.color} ${start}% ${end}%`);
        return acc;
      },
      { stops: [] as string[] },
    )
    .stops.join(", ");

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

      {showAlert && (
        <div className="admin-alert-banner">
          <div className="admin-alert-avatar">{alertBanner.avatar}</div>
          <p className="flex-1">{alertBanner.message}</p>
          <button
            type="button"
            onClick={() => setShowAlert(false)}
            className="text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
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

      <div className="admin-stats-grid">
        {dashboardStats.map((stat) => (
          <div key={stat.id} className="admin-stat-card">
            <div
              className="admin-stat-icon"
              style={{ background: `${stat.color}18`, color: stat.color }}
            >
              <AdminIcon name={stat.icon} size={22} />
            </div>
            <div className="flex-1">
              <p className="admin-stat-title">{stat.title}</p>
              <p className="admin-stat-value">{stat.value}</p>
              <div className="admin-stat-footer">
                <span>Active : {stat.active.toLocaleString()}</span>
                <span>Inactive : {stat.inactive.toLocaleString()}</span>
              </div>
            </div>
            <span className={`admin-stat-change ${stat.changeType}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      <div className="admin-widgets-grid">
        <div className="admin-widget-card">
          <div className="admin-widget-header">
            <h3>Schedules</h3>
            <button type="button" className="admin-btn admin-btn-primary text-xs">
              <Plus size={14} />
              Add New
            </button>
          </div>
          <p className="mb-3 text-sm font-medium">{calendar.month}</p>
          <div className="admin-calendar-grid">
            {DAYS.map((d) => (
              <div key={d} className="admin-calendar-day header">
                {d}
              </div>
            ))}
            {calendar.cells.map((day, i) => (
              <div
                key={i}
                className={`admin-calendar-day ${day === calendar.today ? "today" : ""}`}
              >
                {day ?? ""}
              </div>
            ))}
          </div>
        </div>

        <div className="admin-widget-card">
          <div className="admin-widget-header">
            <h3>Order Status</h3>
          </div>
          <div className="mb-3 flex gap-4 text-xs text-[var(--admin-muted)]">
            <span>Delivered: 62%</span>
            <span>Shipped: 18%</span>
            <span>Pending: 8%</span>
          </div>
          <div className="admin-donut-chart">
            <div
              className="admin-donut-ring"
              style={{ background: `conic-gradient(${donutGradient})` }}
            />
            <div className="admin-donut-legend">
              {orderStatusBreakdown.map((item) => (
                <div key={item.label} className="admin-donut-legend-item">
                  <span
                    className="admin-donut-dot"
                    style={{ background: item.color }}
                  />
                  {item.label} ({item.value}%)
                </div>
              ))}
            </div>
          </div>
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
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[var(--admin-border)] last:border-0"
                >
                  <td className="py-3 pr-4 font-medium">{order.id}</td>
                  <td className="py-3 pr-4">{order.customer}</td>
                  <td className="py-3 pr-4">{order.amount}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-[#e8f0fe] px-2 py-0.5 text-xs text-[#3D5EE1]">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-[var(--admin-muted)]">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
