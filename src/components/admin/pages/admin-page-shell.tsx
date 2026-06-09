"use client";

import Link from "next/link";
import { AdminUsersManager } from "@/components/admin/administration/admin-users-manager";
import { LoginHistoryManager } from "@/components/admin/administration/login-history-manager";
import { PageViewsAnalyticsPage } from "@/components/admin/analytics/page-views-analytics-page";
import { SalesAnalyticsPage } from "@/components/admin/analytics/sales-analytics-page";
import { SearchAnalyticsPage } from "@/components/admin/analytics/search-analytics-page";
import { AuditLogsManager } from "@/components/admin/audit-logs/audit-logs-manager";
import { BrandsManager } from "@/components/admin/catalog/brands-manager";
import { CategoriesManager } from "@/components/admin/catalog/categories-manager";
import { ProductsManager } from "@/components/admin/catalog/products-manager";
import { ReviewsManager } from "@/components/admin/catalog/reviews-manager";
import { TagsManager } from "@/components/admin/catalog/tags-manager";
import { AddressesManager } from "@/components/admin/customers/addresses-manager";
import { CustomersManager } from "@/components/admin/customers/customers-manager";
import { WalletManager } from "@/components/admin/customers/wallet-manager";
import { WishlistsManager } from "@/components/admin/customers/wishlists-manager";
import { AdjustmentsManager } from "@/components/admin/inventory/adjustments-manager";
import { AlertsManager } from "@/components/admin/inventory/alerts-manager";
import { StockManager } from "@/components/admin/inventory/stock-manager";
import { TransfersManager } from "@/components/admin/inventory/transfers-manager";
import { WarehousesManager } from "@/components/admin/inventory/warehouses-manager";
import { BannersManager } from "@/components/admin/marketing/banners-manager";
import { CmsPagesManager } from "@/components/admin/marketing/cms-pages-manager";
import { CouponsManager } from "@/components/admin/marketing/coupons-manager";
import { FaqsManager } from "@/components/admin/marketing/faqs-manager";
import { TestimonialsManager } from "@/components/admin/marketing/testimonials-manager";
import { NotificationsManager } from "@/components/admin/notifications/notifications-manager";
import { OrderStatusManager } from "@/components/admin/orders/order-status-manager";
import { OrderTrackingManager } from "@/components/admin/orders/order-tracking-manager";
import { OrdersManager } from "@/components/admin/orders/orders-manager";
import { ReturnsManager } from "@/components/admin/orders/returns-manager";
import { PaymentVerificationsManager } from "@/components/admin/payments/payment-verifications-manager";
import { PaymentsManager } from "@/components/admin/payments/payments-manager";
import { SettingsManager } from "@/components/admin/settings/settings-manager";
import { ShipmentTrackingManager } from "@/components/admin/shipping/shipment-tracking-manager";
import { ShipmentsManager } from "@/components/admin/shipping/shipments-manager";
import { RolePermissionsManager } from "@/components/admin/super-admin/role-permissions-manager";
import type { AdminPageMeta } from "@/lib/admin/types";

type AdminPageShellProps = {
  page: AdminPageMeta;
};

export function AdminPageShell({ page }: AdminPageShellProps) {
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>{page.title}</h1>
          <div className="admin-breadcrumb">
            {page.breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {page.key === "role-permissions" ? (
        <RolePermissionsManager />
      ) : page.key === "categories" ? (
        <CategoriesManager />
      ) : page.key === "products" ? (
        <ProductsManager />
      ) : page.key === "brands" ? (
        <BrandsManager />
      ) : page.key === "reviews" ? (
        <ReviewsManager />
      ) : page.key === "tags" ? (
        <TagsManager />
      ) : page.key === "warehouses" ? (
        <WarehousesManager />
      ) : page.key === "stock" ? (
        <StockManager />
      ) : page.key === "adjustments" ? (
        <AdjustmentsManager />
      ) : page.key === "transfers" ? (
        <TransfersManager />
      ) : page.key === "alerts" ? (
        <AlertsManager />
      ) : page.key === "orders" ? (
        <OrdersManager />
      ) : page.key === "order-status" ? (
        <OrderStatusManager />
      ) : page.key === "returns" ? (
        <ReturnsManager />
      ) : page.key === "tracking" ? (
        <OrderTrackingManager />
      ) : page.key === "customers" ? (
        <CustomersManager />
      ) : page.key === "addresses" ? (
        <AddressesManager />
      ) : page.key === "wishlists" ? (
        <WishlistsManager />
      ) : page.key === "wallet" ? (
        <WalletManager />
      ) : page.key === "payments" ? (
        <PaymentsManager />
      ) : page.key === "payment-verification" ? (
        <PaymentVerificationsManager />
      ) : page.key === "shipments" ? (
        <ShipmentsManager />
      ) : page.key === "shipment-tracking" ? (
        <ShipmentTrackingManager />
      ) : page.key === "coupons" ? (
        <CouponsManager />
      ) : page.key === "banners" ? (
        <BannersManager />
      ) : page.key === "cms" ? (
        <CmsPagesManager />
      ) : page.key === "testimonials" ? (
        <TestimonialsManager />
      ) : page.key === "faqs" ? (
        <FaqsManager />
      ) : page.key === "sales-analytics" ? (
        <SalesAnalyticsPage />
      ) : page.key === "page-views" ? (
        <PageViewsAnalyticsPage />
      ) : page.key === "search-reports" ? (
        <SearchAnalyticsPage />
      ) : page.key === "settings" ? (
        <SettingsManager />
      ) : page.key === "audit-logs" ? (
        <AuditLogsManager />
      ) : page.key === "admin-users" ? (
        <AdminUsersManager />
      ) : page.key === "login-history" ? (
        <LoginHistoryManager />
      ) : page.key === "notifications" ? (
        <NotificationsManager />
      ) : (
        <div className="admin-page-placeholder">
          <h2>{page.title}</h2>
          <p>{page.description}</p>
          <p className="mt-4 text-xs">
            Module: <strong>{page.section}</strong> — Backend API integration coming
            soon. Schema tables are ready in PostgreSQL.
          </p>
        </div>
      )}
    </>
  );
}
