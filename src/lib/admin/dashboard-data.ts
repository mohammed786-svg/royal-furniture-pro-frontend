import type { DashboardStat } from "@/lib/admin/types";

export const dashboardStats: DashboardStat[] = [
  {
    id: "orders",
    title: "Total Orders",
    value: "2,847",
    change: "12.5%",
    changeType: "up",
    active: 2654,
    inactive: 193,
    icon: "ShoppingCart",
    color: "#3D5EE1",
  },
  {
    id: "revenue",
    title: "Total Revenue",
    value: "₹48.2L",
    change: "8.2%",
    changeType: "up",
    active: 4210,
    inactive: 312,
    icon: "IndianRupee",
    color: "#1CBEAA",
  },
  {
    id: "customers",
    title: "Total Customers",
    value: "5,432",
    change: "3.1%",
    changeType: "up",
    active: 5180,
    inactive: 252,
    icon: "Users",
    color: "#FFA726",
  },
  {
    id: "products",
    title: "Active Products",
    value: "1,286",
    change: "1.8%",
    changeType: "down",
    active: 1198,
    inactive: 88,
    icon: "Sofa",
    color: "#E74C3C",
  },
];

export const quickLinks = [
  {
    label: "Add Product",
    href: "/admin/catalog/products/new",
    icon: "Plus",
    color: "#3D5EE1",
  },
  {
    label: "View Orders",
    href: "/admin/orders",
    icon: "ShoppingCart",
    color: "#1CBEAA",
  },
  {
    label: "Stock Check",
    href: "/admin/inventory/stock",
    icon: "Package",
    color: "#FFA726",
  },
  {
    label: "Coupons",
    href: "/admin/marketing/coupons",
    icon: "Ticket",
    color: "#E74C3C",
  },
  { label: "Customers", href: "/admin/customers", icon: "Users", color: "#9C27B0" },
  {
    label: "Reports",
    href: "/admin/analytics/sales",
    icon: "BarChart3",
    color: "#00BCD4",
  },
];

export const recentOrders = [
  {
    id: "RF-28471",
    customer: "Priya Sharma",
    amount: "₹42,999",
    status: "Delivered",
    date: "08 Jun 2026",
  },
  {
    id: "RF-28470",
    customer: "Rahul Verma",
    amount: "₹18,500",
    status: "Shipped",
    date: "08 Jun 2026",
  },
  {
    id: "RF-28469",
    customer: "Anita Desai",
    amount: "₹67,200",
    status: "Processing",
    date: "07 Jun 2026",
  },
  {
    id: "RF-28468",
    customer: "Vikram Patel",
    amount: "₹9,999",
    status: "Pending",
    date: "07 Jun 2026",
  },
];

export const orderStatusBreakdown = [
  { label: "Delivered", value: 62, color: "#1CBEAA" },
  { label: "Shipped", value: 18, color: "#3D5EE1" },
  { label: "Processing", value: 12, color: "#FFA726" },
  { label: "Pending", value: 8, color: "#E74C3C" },
];

export const alertBanner = {
  message: "Order RF-28471 — Priya Sharma has completed payment for Sofa Set 'Milano'.",
  avatar: "PS",
};
