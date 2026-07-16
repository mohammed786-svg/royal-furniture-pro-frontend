import type { AdminMenuGroup, AdminPageMeta } from "@/lib/admin/types";

export const ADMIN_BASE = "/my-admin";

export const adminMenuGroups: AdminMenuGroup[] = [
  {
    id: "main",
    label: "MAIN",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/my-admin/dashboard",
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
        href: "/my-admin/catalog/products",
        icon: "Sofa",
      },
      {
        key: "categories",
        label: "Categories",
        href: "/my-admin/catalog/categories",
        icon: "Layers",
      },
      {
        key: "brands",
        label: "Brands",
        href: "/my-admin/catalog/brands",
        icon: "Award",
      },
      {
        key: "reviews",
        label: "Reviews & Ratings",
        href: "/my-admin/catalog/reviews",
        icon: "Star",
      },
      {
        key: "tags",
        label: "Product Tags",
        href: "/my-admin/catalog/tags",
        icon: "Tags",
      },
    ],
  },
  {
    id: "inventory",
    label: "INVENTORY",
    items: [
      {
        key: "warehouses",
        label: "Warehouses",
        href: "/my-admin/inventory/warehouses",
        icon: "Warehouse",
      },
      {
        key: "stock",
        label: "Stock Overview",
        href: "/my-admin/inventory/stock",
        icon: "Package",
      },
      {
        key: "adjustments",
        label: "Stock Adjustments",
        href: "/my-admin/inventory/adjustments",
        icon: "SlidersHorizontal",
      },
      {
        key: "transfers",
        label: "Stock Transfers",
        href: "/my-admin/inventory/transfers",
        icon: "ArrowLeftRight",
      },
      {
        key: "alerts",
        label: "Low Stock Alerts",
        href: "/my-admin/inventory/alerts",
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
        href: "/my-admin/orders",
        icon: "ShoppingCart",
      },
      {
        key: "order-status",
        label: "Order Status",
        href: "/my-admin/orders/status",
        icon: "ListChecks",
      },
      {
        key: "returns",
        label: "Returns & Refunds",
        href: "/my-admin/orders/returns",
        icon: "RotateCcw",
      },
      {
        key: "tracking",
        label: "Order Tracking",
        href: "/my-admin/orders/tracking",
        icon: "MapPin",
      },
    ],
  },
  {
    id: "shiprocket",
    label: "SHIPROCKET",
    items: [
      {
        key: "shiprocket-orders",
        label: "SR Orders",
        href: "/my-admin/shiprocket/orders",
        icon: "Truck",
      },
      {
        key: "shiprocket-tracking",
        label: "SR Tracking",
        href: "/my-admin/shiprocket/tracking",
        icon: "Route",
      },
      {
        key: "shiprocket-rates",
        label: "SR Rate Calculator",
        href: "/my-admin/shiprocket/rates",
        icon: "IndianRupee",
      },
    ],
  },
  {
    id: "customers",
    label: "CUSTOMERS",
    items: [
      {
        key: "customers",
        label: "Customers",
        href: "/my-admin/customers",
        icon: "Users",
      },
      {
        key: "addresses",
        label: "Addresses",
        href: "/my-admin/customers/addresses",
        icon: "MapPinned",
      },
      {
        key: "wishlists",
        label: "Wishlists",
        href: "/my-admin/customers/wishlists",
        icon: "Heart",
      },
      {
        key: "wallet",
        label: "Customer Wallet",
        href: "/my-admin/customers/wallet",
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
        href: "/my-admin/marketing/coupons",
        icon: "Ticket",
      },
      {
        key: "banners",
        label: "Banners",
        href: "/my-admin/marketing/banners",
        icon: "Image",
      },
      {
        key: "cms",
        label: "CMS Pages",
        href: "/my-admin/marketing/cms",
        icon: "FileText",
      },
      {
        key: "testimonials",
        label: "Testimonials",
        href: "/my-admin/marketing/testimonials",
        icon: "MessageSquare",
      },
      {
        key: "faqs",
        label: "FAQs",
        href: "/my-admin/marketing/faqs",
        icon: "HelpCircle",
      },
    ],
  },
  {
    id: "payments",
    label: "PAYMENTS",
    items: [
      {
        key: "payments",
        label: "Payments",
        href: "/my-admin/payments",
        icon: "CreditCard",
      },
      {
        key: "payment-verification",
        label: "Verification",
        href: "/my-admin/payments/verification",
        icon: "ShieldCheck",
      },
      {
        key: "payment-checkout",
        label: "Checkout Payment",
        href: "/my-admin/payments/checkout",
        icon: "QrCode",
        superAdminOnly: true,
      },
    ],
  },
  {
    id: "shipping",
    label: "SHIPPING",
    items: [
      {
        key: "shipments",
        label: "Shipments",
        href: "/my-admin/shipping",
        icon: "Truck",
      },
      {
        key: "shipment-tracking",
        label: "Tracking",
        href: "/my-admin/shipping/tracking",
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
        href: "/my-admin/analytics/sales",
        icon: "TrendingUp",
      },
      {
        key: "page-views",
        label: "Page Views",
        href: "/my-admin/analytics/page-views",
        icon: "Eye",
      },
      {
        key: "search-reports",
        label: "Search Reports",
        href: "/my-admin/analytics/search",
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
        href: "/my-admin/notifications",
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
        href: "/my-admin/settings",
        icon: "Settings",
      },
      {
        key: "audit-logs",
        label: "Audit Logs",
        href: "/my-admin/settings/audit-logs",
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
        href: "/my-admin/administration/users",
        icon: "UserCog",
        superAdminOnly: true,
      },
      {
        key: "role-permissions",
        label: "Roles & Permissions",
        href: "/my-admin/administration/roles",
        icon: "Shield",
        superAdminOnly: true,
      },
      {
        key: "login-history",
        label: "Login History",
        href: "/my-admin/administration/login-history",
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
  "shiprocket-orders": "Live Shiprocket orders from your account.",
  "shiprocket-tracking": "Track AWB and shipment scans from Shiprocket.",
  "shiprocket-rates": "Calculate courier rates by weight and dimensions.",
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
  "payment-checkout": "Manage checkout QR code and bank details for customers.",
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
        { label: "Dashboard", href: "/my-admin/dashboard" },
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
  "shiprocket-orders",
  "shiprocket-tracking",
  "shiprocket-rates",
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
