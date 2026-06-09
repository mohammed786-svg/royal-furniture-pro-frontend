"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AdminUserDetailPage } from "@/components/admin/administration/admin-user-detail-page";
import { AdminUserFormPage } from "@/components/admin/administration/admin-user-form-page";
import { LoginHistoryDetailPage } from "@/components/admin/administration/login-history-detail-page";
import { PageViewDetailPage } from "@/components/admin/analytics/page-view-detail-page";
import { PageViewFormPage } from "@/components/admin/analytics/page-view-form-page";
import { SearchDetailPage } from "@/components/admin/analytics/search-detail-page";
import { SearchFormPage } from "@/components/admin/analytics/search-form-page";
import { AuditLogDetailPage } from "@/components/admin/audit-logs/audit-log-detail-page";
import { BrandDetailPage } from "@/components/admin/catalog/brand-detail-page";
import { BrandFormPage } from "@/components/admin/catalog/brand-form-page";
import { ProductFormPage } from "@/components/admin/catalog/product-form-page";
import { ReviewDetailPage } from "@/components/admin/catalog/review-detail-page";
import { ReviewFormPage } from "@/components/admin/catalog/review-form-page";
import { TagDetailPage } from "@/components/admin/catalog/tag-detail-page";
import { TagFormPage } from "@/components/admin/catalog/tag-form-page";
import { AddressFormPage } from "@/components/admin/customers/address-form-page";
import { CustomerDetailPage } from "@/components/admin/customers/customer-detail-page";
import { CustomerFormPage } from "@/components/admin/customers/customer-form-page";
import { WalletDetailPage } from "@/components/admin/customers/wallet-detail-page";
import { AdjustmentFormPage } from "@/components/admin/inventory/adjustment-form-page";
import { StockFormPage } from "@/components/admin/inventory/stock-form-page";
import { TransferFormPage } from "@/components/admin/inventory/transfer-form-page";
import { WarehouseFormPage } from "@/components/admin/inventory/warehouse-form-page";
import { BannerDetailPage } from "@/components/admin/marketing/banner-detail-page";
import { BannerFormPage } from "@/components/admin/marketing/banner-form-page";
import { CmsPageDetailPage } from "@/components/admin/marketing/cms-page-detail-page";
import { CmsPageFormPage } from "@/components/admin/marketing/cms-page-form-page";
import { CouponDetailPage } from "@/components/admin/marketing/coupon-detail-page";
import { CouponFormPage } from "@/components/admin/marketing/coupon-form-page";
import { FaqDetailPage } from "@/components/admin/marketing/faq-detail-page";
import { FaqFormPage } from "@/components/admin/marketing/faq-form-page";
import { TestimonialDetailPage } from "@/components/admin/marketing/testimonial-detail-page";
import { TestimonialFormPage } from "@/components/admin/marketing/testimonial-form-page";
import { NotificationDetailPage } from "@/components/admin/notifications/notification-detail-page";
import { NotificationFormPage } from "@/components/admin/notifications/notification-form-page";
import { OrderCreatePage } from "@/components/admin/orders/order-create-page";
import { OrderDetailPage } from "@/components/admin/orders/order-detail-page";
import { OrderStatusFormPage } from "@/components/admin/orders/order-status-form-page";
import { ReturnFormPage } from "@/components/admin/orders/return-form-page";
import { TrackingFormPage } from "@/components/admin/orders/tracking-form-page";
import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { PaymentDetailPage } from "@/components/admin/payments/payment-detail-page";
import { PaymentFormPage } from "@/components/admin/payments/payment-form-page";
import { PaymentVerificationDetailPage } from "@/components/admin/payments/payment-verification-detail-page";
import { PaymentVerificationFormPage } from "@/components/admin/payments/payment-verification-form-page";
import { SettingFormPage } from "@/components/admin/settings/setting-form-page";
import { ShipmentDetailPage } from "@/components/admin/shipping/shipment-detail-page";
import { ShipmentFormPage } from "@/components/admin/shipping/shipment-form-page";
import { ShipmentTrackingDetailPage } from "@/components/admin/shipping/shipment-tracking-detail-page";
import { ShipmentTrackingFormPage } from "@/components/admin/shipping/shipment-tracking-form-page";
import { getAdminPageByHref } from "@/lib/admin/navigation";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function isProductFormRoute(slug: string[]) {
  if (slug[0] !== "catalog" || slug[1] !== "products") return null;
  if (slug[2] === "new" && slug.length === 3) return { mode: "create" as const };
  if (slug.length === 4 && slug[3] === "edit") {
    return { mode: "edit" as const, productId: slug[2] };
  }
  return null;
}

function isCatalogFormRoute(slug: string[]) {
  if (slug[0] !== "catalog" || slug.length < 3) return null;
  const section = slug[1];

  if (section === "brands") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "brand-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "brand-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "brand-edit" as const, id: slug[2] };
  }

  if (section === "reviews") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "review-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "review-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "review-edit" as const, id: slug[2] };
  }

  if (section === "tags") {
    if (slug[2] === "new" && slug.length === 3) return { type: "tag-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "tag-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "tag-edit" as const, id: slug[2] };
  }

  return null;
}

function isInventoryFormRoute(slug: string[]) {
  if (slug[0] !== "inventory" || slug.length < 3) return null;
  const section = slug[1];
  if (section === "warehouses" && slug[2] === "new")
    return { type: "warehouse-create" as const };
  if (section === "warehouses" && slug.length === 4 && slug[3] === "edit") {
    return { type: "warehouse-edit" as const, id: slug[2] };
  }
  if (section === "stock" && slug[2] === "new")
    return { type: "stock-create" as const };
  if (section === "stock" && slug.length === 4 && slug[3] === "edit") {
    return { type: "stock-edit" as const, id: slug[2] };
  }
  if (section === "adjustments" && slug[2] === "new")
    return { type: "adjustment-create" as const };
  if (section === "adjustments" && slug.length === 3) {
    return { type: "adjustment-view" as const, id: slug[2] };
  }
  if (section === "transfers" && slug[2] === "new")
    return { type: "transfer-create" as const };
  if (section === "transfers" && slug.length === 3) {
    return { type: "transfer-view" as const, id: slug[2] };
  }
  return null;
}

function isOrderFormRoute(slug: string[]) {
  if (slug[0] !== "orders") return null;
  if (slug.length === 1) return { type: "orders-list" as const };
  if (slug[1] === "new" && slug.length === 2) return { type: "order-create" as const };
  if (
    slug.length === 2 &&
    slug[1] !== "status" &&
    slug[1] !== "returns" &&
    slug[1] !== "tracking"
  ) {
    return { type: "order-detail" as const, id: slug[1] };
  }
  if (slug[1] === "status" && slug[2] === "new")
    return { type: "status-create" as const };
  if (slug[1] === "status" && slug.length === 4 && slug[3] === "edit") {
    return { type: "status-edit" as const, id: slug[2] };
  }
  if (slug[1] === "returns" && slug[2] === "new")
    return { type: "return-create" as const };
  if (slug[1] === "tracking" && slug[2] === "new")
    return { type: "tracking-create" as const };
  return null;
}

function isPaymentsFormRoute(slug: string[]) {
  if (slug[0] !== "payments") return null;

  if (slug[1] === "verification") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "payment-verification-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "payment-verification-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "payment-verification-edit" as const, id: slug[2] };
    return null;
  }

  if (slug[1] === "new" && slug.length === 2)
    return { type: "payment-create" as const };
  if (slug.length === 2 && slug[1] !== "new")
    return { type: "payment-detail" as const, id: slug[1] };
  if (slug.length === 3 && slug[2] === "edit")
    return { type: "payment-edit" as const, id: slug[1] };
  return null;
}

function isShippingFormRoute(slug: string[]) {
  if (slug[0] !== "shipping") return null;

  if (slug[1] === "tracking") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "shipment-tracking-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "shipment-tracking-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "shipment-tracking-edit" as const, id: slug[2] };
    return null;
  }

  if (slug[1] === "new" && slug.length === 2)
    return { type: "shipment-create" as const };
  if (slug.length === 2 && slug[1] !== "new")
    return { type: "shipment-detail" as const, id: slug[1] };
  if (slug.length === 3 && slug[2] === "edit")
    return { type: "shipment-edit" as const, id: slug[1] };
  return null;
}

function isMarketingFormRoute(slug: string[]) {
  if (slug[0] !== "marketing" || slug.length < 3) return null;
  const section = slug[1];

  if (section === "coupons") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "coupon-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "coupon-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "coupon-edit" as const, id: slug[2] };
  }

  if (section === "banners") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "banner-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "banner-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "banner-edit" as const, id: slug[2] };
  }

  if (section === "cms") {
    if (slug[2] === "new" && slug.length === 3) return { type: "cms-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "cms-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "cms-edit" as const, id: slug[2] };
  }

  if (section === "testimonials") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "testimonial-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "testimonial-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "testimonial-edit" as const, id: slug[2] };
  }

  if (section === "faqs") {
    if (slug[2] === "new" && slug.length === 3) return { type: "faq-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "faq-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "faq-edit" as const, id: slug[2] };
  }

  return null;
}

function isAnalyticsFormRoute(slug: string[]) {
  if (slug[0] !== "analytics" || slug.length < 3) return null;
  const section = slug[1];

  if (section === "page-views") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "page-view-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "page-view-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "page-view-edit" as const, id: slug[2] };
  }

  if (section === "search") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "search-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "search-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "search-edit" as const, id: slug[2] };
  }

  return null;
}

function isSettingsFormRoute(slug: string[]) {
  if (slug[0] !== "settings") return null;

  if (slug[1] === "audit-logs") {
    if (slug.length === 3) return { type: "audit-log-detail" as const, id: slug[2] };
    return null;
  }

  if (slug.length === 1) return null;
  if (slug[1] === "new" && slug.length === 2)
    return { type: "setting-create" as const };
  if (slug.length === 3 && slug[2] === "edit")
    return { type: "setting-edit" as const, id: slug[1] };
  return null;
}

function isAdministrationFormRoute(slug: string[]) {
  if (slug[0] !== "administration" || slug.length < 2) return null;
  const section = slug[1];

  if (section === "users") {
    if (slug[2] === "new" && slug.length === 3)
      return { type: "admin-user-create" as const };
    if (slug.length === 3 && slug[2] !== "new")
      return { type: "admin-user-detail" as const, id: slug[2] };
    if (slug.length === 4 && slug[3] === "edit")
      return { type: "admin-user-edit" as const, id: slug[2] };
  }

  if (section === "login-history" && slug.length === 3) {
    return { type: "login-history-detail" as const, id: slug[2] };
  }

  return null;
}

function isNotificationsFormRoute(slug: string[]) {
  if (slug[0] !== "notifications" || slug.length < 2) return null;
  if (slug[1] === "new" && slug.length === 2)
    return { type: "notification-create" as const };
  if (slug.length === 2 && slug[1] !== "new")
    return { type: "notification-detail" as const, id: slug[1] };
  if (slug.length === 3 && slug[2] === "edit")
    return { type: "notification-edit" as const, id: slug[1] };
  return null;
}

function isCustomerFormRoute(slug: string[]) {
  if (slug[0] !== "customers") return null;
  if (slug[1] === "new" && slug.length === 2)
    return { type: "customer-create" as const };
  if (slug.length === 2 && !["addresses", "wishlists", "wallet"].includes(slug[1])) {
    return { type: "customer-detail" as const, id: slug[1] };
  }
  if (slug.length === 3 && slug[2] === "edit") {
    return { type: "customer-edit" as const, id: slug[1] };
  }
  if (slug[1] === "addresses" && slug[2] === "new")
    return { type: "address-create" as const };
  if (slug[1] === "addresses" && slug.length === 4 && slug[3] === "edit") {
    return { type: "address-edit" as const, id: slug[2] };
  }
  if (slug[1] === "wallet" && slug.length === 3) {
    return { type: "wallet-detail" as const, id: slug[2] };
  }
  return null;
}

export default function AdminDynamicPage({ params }: PageProps) {
  const { slug } = use(params);

  const inventoryRoute = isInventoryFormRoute(slug);
  if (inventoryRoute?.type === "warehouse-create")
    return <WarehouseFormPage mode="create" />;
  if (inventoryRoute?.type === "warehouse-edit") {
    return <WarehouseFormPage mode="edit" warehouseId={inventoryRoute.id} />;
  }
  if (inventoryRoute?.type === "stock-create") return <StockFormPage mode="create" />;
  if (inventoryRoute?.type === "stock-edit") {
    return <StockFormPage mode="edit" stockId={inventoryRoute.id} />;
  }
  if (inventoryRoute?.type === "adjustment-create")
    return <AdjustmentFormPage mode="create" />;
  if (inventoryRoute?.type === "adjustment-view") {
    return <AdjustmentFormPage mode="view" adjustmentId={inventoryRoute.id} />;
  }
  if (inventoryRoute?.type === "transfer-create")
    return <TransferFormPage mode="create" />;
  if (inventoryRoute?.type === "transfer-view") {
    return <TransferFormPage mode="view" transferId={inventoryRoute.id} />;
  }

  const productRoute = isProductFormRoute(slug);
  if (productRoute?.mode === "create") {
    return <ProductFormPage mode="create" />;
  }
  if (productRoute?.mode === "edit" && productRoute.productId) {
    return <ProductFormPage mode="edit" productId={productRoute.productId} />;
  }

  const catalogRoute = isCatalogFormRoute(slug);
  if (catalogRoute?.type === "brand-create") return <BrandFormPage mode="create" />;
  if (catalogRoute?.type === "brand-edit")
    return <BrandFormPage mode="edit" brandId={catalogRoute.id} />;
  if (catalogRoute?.type === "brand-detail")
    return <BrandDetailPage brandId={catalogRoute.id} />;
  if (catalogRoute?.type === "review-create") return <ReviewFormPage mode="create" />;
  if (catalogRoute?.type === "review-edit")
    return <ReviewFormPage mode="edit" reviewId={catalogRoute.id} />;
  if (catalogRoute?.type === "review-detail")
    return <ReviewDetailPage reviewId={catalogRoute.id} />;
  if (catalogRoute?.type === "tag-create") return <TagFormPage mode="create" />;
  if (catalogRoute?.type === "tag-edit")
    return <TagFormPage mode="edit" tagId={catalogRoute.id} />;
  if (catalogRoute?.type === "tag-detail")
    return <TagDetailPage tagId={catalogRoute.id} />;

  const orderRoute = isOrderFormRoute(slug);
  if (orderRoute?.type === "order-create") return <OrderCreatePage />;
  if (orderRoute?.type === "order-detail")
    return <OrderDetailPage orderId={orderRoute.id} />;
  if (orderRoute?.type === "status-create")
    return <OrderStatusFormPage mode="create" />;
  if (orderRoute?.type === "status-edit") {
    return <OrderStatusFormPage mode="edit" statusId={orderRoute.id} />;
  }
  if (orderRoute?.type === "return-create") return <ReturnFormPage />;
  if (orderRoute?.type === "tracking-create") return <TrackingFormPage />;

  const customerRoute = isCustomerFormRoute(slug);
  if (customerRoute?.type === "customer-create")
    return <CustomerFormPage mode="create" />;
  if (customerRoute?.type === "customer-detail") {
    return <CustomerDetailPage customerId={customerRoute.id} />;
  }
  if (customerRoute?.type === "customer-edit") {
    return <CustomerFormPage mode="edit" customerId={customerRoute.id} />;
  }
  if (customerRoute?.type === "address-create")
    return <AddressFormPage mode="create" />;
  if (customerRoute?.type === "address-edit") {
    return <AddressFormPage mode="edit" addressId={customerRoute.id} />;
  }
  if (customerRoute?.type === "wallet-detail") {
    return <WalletDetailPage walletId={customerRoute.id} />;
  }

  const paymentsRoute = isPaymentsFormRoute(slug);
  if (paymentsRoute?.type === "payment-create")
    return <PaymentFormPage mode="create" />;
  if (paymentsRoute?.type === "payment-edit")
    return <PaymentFormPage mode="edit" paymentId={paymentsRoute.id} />;
  if (paymentsRoute?.type === "payment-detail")
    return <PaymentDetailPage paymentId={paymentsRoute.id} />;
  if (paymentsRoute?.type === "payment-verification-create")
    return <PaymentVerificationFormPage mode="create" />;
  if (paymentsRoute?.type === "payment-verification-edit") {
    return (
      <PaymentVerificationFormPage mode="edit" verificationId={paymentsRoute.id} />
    );
  }
  if (paymentsRoute?.type === "payment-verification-detail") {
    return <PaymentVerificationDetailPage verificationId={paymentsRoute.id} />;
  }

  const shippingRoute = isShippingFormRoute(slug);
  if (shippingRoute?.type === "shipment-create")
    return <ShipmentFormPage mode="create" />;
  if (shippingRoute?.type === "shipment-edit")
    return <ShipmentFormPage mode="edit" shipmentId={shippingRoute.id} />;
  if (shippingRoute?.type === "shipment-detail")
    return <ShipmentDetailPage shipmentId={shippingRoute.id} />;
  if (shippingRoute?.type === "shipment-tracking-create")
    return <ShipmentTrackingFormPage mode="create" />;
  if (shippingRoute?.type === "shipment-tracking-edit") {
    return <ShipmentTrackingFormPage mode="edit" trackingId={shippingRoute.id} />;
  }
  if (shippingRoute?.type === "shipment-tracking-detail") {
    return <ShipmentTrackingDetailPage trackingId={shippingRoute.id} />;
  }

  const marketingRoute = isMarketingFormRoute(slug);
  if (marketingRoute?.type === "coupon-create") return <CouponFormPage mode="create" />;
  if (marketingRoute?.type === "coupon-edit")
    return <CouponFormPage mode="edit" couponId={marketingRoute.id} />;
  if (marketingRoute?.type === "coupon-detail")
    return <CouponDetailPage couponId={marketingRoute.id} />;
  if (marketingRoute?.type === "banner-create") return <BannerFormPage mode="create" />;
  if (marketingRoute?.type === "banner-edit")
    return <BannerFormPage mode="edit" bannerId={marketingRoute.id} />;
  if (marketingRoute?.type === "banner-detail")
    return <BannerDetailPage bannerId={marketingRoute.id} />;
  if (marketingRoute?.type === "cms-create") return <CmsPageFormPage mode="create" />;
  if (marketingRoute?.type === "cms-edit")
    return <CmsPageFormPage mode="edit" pageId={marketingRoute.id} />;
  if (marketingRoute?.type === "cms-detail")
    return <CmsPageDetailPage pageId={marketingRoute.id} />;
  if (marketingRoute?.type === "testimonial-create")
    return <TestimonialFormPage mode="create" />;
  if (marketingRoute?.type === "testimonial-edit") {
    return <TestimonialFormPage mode="edit" testimonialId={marketingRoute.id} />;
  }
  if (marketingRoute?.type === "testimonial-detail") {
    return <TestimonialDetailPage testimonialId={marketingRoute.id} />;
  }
  if (marketingRoute?.type === "faq-create") return <FaqFormPage mode="create" />;
  if (marketingRoute?.type === "faq-edit")
    return <FaqFormPage mode="edit" faqId={marketingRoute.id} />;
  if (marketingRoute?.type === "faq-detail")
    return <FaqDetailPage faqId={marketingRoute.id} />;

  const analyticsRoute = isAnalyticsFormRoute(slug);
  if (analyticsRoute?.type === "page-view-create")
    return <PageViewFormPage mode="create" />;
  if (analyticsRoute?.type === "page-view-edit") {
    return <PageViewFormPage mode="edit" pageViewId={analyticsRoute.id} />;
  }
  if (analyticsRoute?.type === "page-view-detail") {
    return <PageViewDetailPage pageViewId={analyticsRoute.id} />;
  }
  if (analyticsRoute?.type === "search-create") return <SearchFormPage mode="create" />;
  if (analyticsRoute?.type === "search-edit") {
    return <SearchFormPage mode="edit" searchId={analyticsRoute.id} />;
  }
  if (analyticsRoute?.type === "search-detail") {
    return <SearchDetailPage searchId={analyticsRoute.id} />;
  }

  const settingsRoute = isSettingsFormRoute(slug);
  if (settingsRoute?.type === "setting-create")
    return <SettingFormPage mode="create" />;
  if (settingsRoute?.type === "setting-edit") {
    return <SettingFormPage mode="edit" settingId={settingsRoute.id} />;
  }
  if (settingsRoute?.type === "audit-log-detail") {
    return <AuditLogDetailPage auditLogId={settingsRoute.id} />;
  }

  const administrationRoute = isAdministrationFormRoute(slug);
  if (administrationRoute?.type === "admin-user-create")
    return <AdminUserFormPage mode="create" />;
  if (administrationRoute?.type === "admin-user-edit") {
    return <AdminUserFormPage mode="edit" userId={administrationRoute.id} />;
  }
  if (administrationRoute?.type === "admin-user-detail") {
    return <AdminUserDetailPage userId={administrationRoute.id} />;
  }
  if (administrationRoute?.type === "login-history-detail") {
    return <LoginHistoryDetailPage loginHistoryId={administrationRoute.id} />;
  }

  const notificationsRoute = isNotificationsFormRoute(slug);
  if (notificationsRoute?.type === "notification-create")
    return <NotificationFormPage mode="create" />;
  if (notificationsRoute?.type === "notification-edit") {
    return <NotificationFormPage mode="edit" notificationId={notificationsRoute.id} />;
  }
  if (notificationsRoute?.type === "notification-detail") {
    return <NotificationDetailPage notificationId={notificationsRoute.id} />;
  }

  const href = `/admin/${slug.join("/")}`;
  const page = getAdminPageByHref(href);

  if (!page || page.key === "dashboard") {
    notFound();
  }

  return <AdminPageShell page={page} />;
}
