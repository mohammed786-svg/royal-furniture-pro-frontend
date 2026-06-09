import type { AdminMenuGroup, AdminPageMeta } from "@/lib/admin/types";

export const ADMIN_BASE = "/admin";

export const adminMenuGroups: AdminMenuGroup[] = [
  {
    id: "main",
    label: "MAIN",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: "LayoutDashboard",
      },
    ],
  },
  {
    id: "catalog",
    label: "CATALOG",
    items: [
      {
        key: "products",
        label: "Products",
        href: "/admin/catalog/products",
        icon: "Sofa",
      },
      {
        key: "categories",
        label: "Categories",
        href: "/admin/catalog/categories",
        icon: "Layers",
      },
      { key: "brands", label: "Brands", href: "/admin/catalog/brands", icon: "Award" },
      {
        key: "reviews",
        label: "Reviews & Ratings",
        href: "/admin/catalog/reviews",
        icon: "Star",
      },
      { key: "tags", label: "Product Tags", href: "/admin/catalog/tags", icon: "Tags" },
    ],
  },
  {
    id: "inventory",
    label: "INVENTORY",
    items: [
      {
        key: "warehouses",
        label: "Warehouses",
        href: "/admin/inventory/warehouses",
        icon: "Warehouse",
      },
      {
        key: "stock",
        label: "Stock Overview",
        href: "/admin/inventory/stock",
        icon: "Package",
      },
      {
        key: "adjustments",
        label: "Stock Adjustments",
        href: "/admin/inventory/adjustments",
        icon: "SlidersHorizontal",
      },
      {
        key: "transfers",
        label: "Stock Transfers",
        href: "/admin/inventory/transfers",
        icon: "ArrowLeftRight",
      },
      {
        key: "alerts",
        label: "Low Stock Alerts",
        href: "/admin/inventory/alerts",
        icon: "AlertTriangle",
      },
    ],
  },
  {
    id: "orders",
    label: "ORDERS",
    items: [
      {
        key: "orders",
        label: "All Orders",
        href: "/admin/orders",
        icon: "ShoppingCart",
      },
      {
        key: "order-status",
        label: "Order Status",
        href: "/admin/orders/status",
        icon: "ListChecks",
      },
      {
        key: "returns",
        label: "Returns & Refunds",
        href: "/admin/orders/returns",
        icon: "RotateCcw",
      },
      {
        key: "tracking",
        label: "Order Tracking",
        href: "/admin/orders/tracking",
        icon: "MapPin",
      },
    ],
  },
  {
    id: "customers",
    label: "CUSTOMERS",
    items: [
      { key: "customers", label: "Customers", href: "/admin/customers", icon: "Users" },
      {
        key: "addresses",
        label: "Addresses",
        href: "/admin/customers/addresses",
        icon: "MapPinned",
      },
      {
        key: "wishlists",
        label: "Wishlists",
        href: "/admin/customers/wishlists",
        icon: "Heart",
      },
      {
        key: "wallet",
        label: "Customer Wallet",
        href: "/admin/customers/wallet",
        icon: "Wallet",
      },
    ],
  },
  {
    id: "marketing",
    label: "MARKETING",
    items: [
      {
        key: "coupons",
        label: "Coupons",
        href: "/admin/marketing/coupons",
        icon: "Ticket",
      },
      {
        key: "banners",
        label: "Banners",
        href: "/admin/marketing/banners",
        icon: "Image",
      },
      {
        key: "cms",
        label: "CMS Pages",
        href: "/admin/marketing/cms",
        icon: "FileText",
      },
      {
        key: "testimonials",
        label: "Testimonials",
        href: "/admin/marketing/testimonials",
        icon: "MessageSquare",
      },
      { key: "faqs", label: "FAQs", href: "/admin/marketing/faqs", icon: "HelpCircle" },
    ],
  },
  {
    id: "payments",
    label: "PAYMENTS",
    items: [
      {
        key: "payments",
        label: "Payments",
        href: "/admin/payments",
        icon: "CreditCard",
      },
      {
        key: "payment-verification",
        label: "Verification",
        href: "/admin/payments/verification",
        icon: "ShieldCheck",
      },
    ],
  },
  {
    id: "shipping",
    label: "SHIPPING",
    items: [
      { key: "shipments", label: "Shipments", href: "/admin/shipping", icon: "Truck" },
      {
        key: "shipment-tracking",
        label: "Tracking",
        href: "/admin/shipping/tracking",
        icon: "Route",
      },
    ],
  },
  {
    id: "analytics",
    label: "ANALYTICS",
    items: [
      {
        key: "sales-analytics",
        label: "Sales Analytics",
        href: "/admin/analytics/sales",
        icon: "TrendingUp",
      },
      {
        key: "page-views",
        label: "Page Views",
        href: "/admin/analytics/page-views",
        icon: "Eye",
      },
      {
        key: "search-reports",
        label: "Search Reports",
        href: "/admin/analytics/search",
        icon: "Search",
      },
    ],
  },
  {
    id: "notifications",
    label: "NOTIFICATIONS",
    items: [
      {
        key: "notifications",
        label: "Notifications",
        href: "/admin/notifications",
        icon: "Bell",
      },
    ],
  },
  {
    id: "settings",
    label: "SETTINGS",
    items: [
      {
        key: "settings",
        label: "Store Settings",
        href: "/admin/settings",
        icon: "Settings",
      },
      {
        key: "audit-logs",
        label: "Audit Logs",
        href: "/admin/settings/audit-logs",
        icon: "ScrollText",
      },
    ],
  },
  {
    id: "administration",
    label: "ADMINISTRATION",
    items: [
      {
        key: "admin-users",
        label: "Admin Users",
        href: "/admin/administration/users",
        icon: "UserCog",
        superAdminOnly: true,
      },
      {
        key: "role-permissions",
        label: "Roles & Permissions",
        href: "/admin/administration/roles",
        icon: "Shield",
        superAdminOnly: true,
      },
      {
        key: "login-history",
        label: "Login History",
        href: "/admin/administration/login-history",
        icon: "History",
        superAdminOnly: true,
      },
    ],
  },
];

const pageDescriptions: Record<string, string> = {
  dashboard: "Overview of sales, orders, inventory, and store performance.",
  products: "Manage product catalog, variants, specifications, and media.",
  categories: "Organize categories, sub-categories, and navigation hierarchy.",
  brands: "Manage furniture brands and manufacturer details.",
  reviews: "Moderate customer reviews, ratings, and Q&A.",
  tags: "Manage product tags and tag mappings.",
  warehouses: "Configure warehouse locations and fulfillment centers.",
  stock: "Monitor real-time inventory levels across warehouses.",
  adjustments: "Record stock adjustments and corrections.",
  transfers: "Transfer stock between warehouses.",
  alerts: "View low stock and out-of-stock alerts.",
  orders: "View and manage all customer orders.",
  "order-status": "Configure order status workflow.",
  returns: "Process returns, refunds, and exchanges.",
  tracking: "Track order fulfillment and delivery status.",
  customers: "Manage registered and guest customers.",
  addresses: "View customer delivery addresses.",
  wishlists: "Monitor customer wishlist activity.",
  wallet: "Manage customer wallet balances and transactions.",
  coupons: "Create and manage discount coupons.",
  banners: "Manage homepage and promotional banners.",
  cms: "Edit static CMS pages and content blocks.",
  testimonials: "Manage customer testimonials.",
  faqs: "Manage frequently asked questions.",
  payments: "View payment transactions and statuses.",
  "payment-verification": "Verify and reconcile payments.",
  shipments: "Manage shipments and dispatch.",
  "shipment-tracking": "Track shipment status and updates.",
  "sales-analytics": "Sales trends, revenue, and conversion metrics.",
  "page-views": "Page view analytics and traffic sources.",
  "search-reports": "Customer search behavior and popular queries.",
  notifications: "Send and manage customer notifications.",
  settings: "Store configuration, tax, shipping, and general settings.",
  "audit-logs": "View system audit trail and admin actions.",
  "admin-users": "Manage admin accounts and access.",
  "role-permissions": "Configure admin roles and sidebar permissions.",
  "login-history": "View admin login history and sessions.",
};

function sectionLabel(id: string): string {
  const group = adminMenuGroups.find((g) => g.id === id);
  return group?.label ?? "Admin";
}

export function getAllAdminPages(): AdminPageMeta[] {
  return adminMenuGroups.flatMap((group) =>
    group.items.map((item) => ({
      key: item.key,
      title: item.label,
      description: pageDescriptions[item.key] ?? `Manage ${item.label.toLowerCase()}.`,
      section: sectionLabel(group.id),
      href: item.href,
      superAdminOnly: item.superAdminOnly,
      breadcrumbs: [
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: sectionLabel(group.id) },
        { label: item.label },
      ],
    })),
  );
}

export function getAdminPageByHref(href: string): AdminPageMeta | undefined {
  return getAllAdminPages().find((p) => p.href === href);
}

export function getAdminPageByKey(key: string): AdminPageMeta | undefined {
  return getAllAdminPages().find((p) => p.key === key);
}

export function getAllMenuKeys(): string[] {
  return adminMenuGroups.flatMap((g) => g.items.map((i) => i.key));
}

export const defaultAdminAllowedMenus = [
  "dashboard",
  "products",
  "categories",
  "brands",
  "reviews",
  "tags",
  "warehouses",
  "stock",
  "adjustments",
  "transfers",
  "alerts",
  "orders",
  "order-status",
  "returns",
  "tracking",
  "customers",
  "addresses",
  "wishlists",
  "wallet",
  "coupons",
  "banners",
  "cms",
  "testimonials",
  "faqs",
  "payments",
  "payment-verification",
  "shipments",
  "shipment-tracking",
  "sales-analytics",
  "page-views",
  "search-reports",
  "notifications",
  "settings",
  "audit-logs",
  "admin-users",
  "login-history",
];
