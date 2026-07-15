"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  Mail,
  MapPin,
  Pencil,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import {
  AdminInfoCard,
  AdminInfoRow,
  AdminQuickActions,
  AdminRecordChip,
  AdminRecordHero,
  AdminRecordMetrics,
  AdminRecordPanel,
  AdminRecordTabs,
} from "@/components/admin/shared/admin-record-detail";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  fetchAddresses,
  fetchCustomer,
  fetchWishlists,
} from "@/services/customers-api";
import { fetchOrders } from "@/services/orders-api";
import type { CustomerItem } from "@/types/customers";
import type { OrderListItem } from "@/types/orders";

const LIST_PATH = "/my-admin/customers";

const TABS = [
  { id: "Overview", label: "Overview", icon: LayoutDashboard },
  { id: "Orders", label: "Orders", icon: ShoppingBag },
] as const;

type Tab = (typeof TABS)[number]["id"];

type Props = { customerId: string };

function customerInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function CustomerDetailPage({ customerId }: Props) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerItem | null>(null);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [deliveredSpend, setDeliveredSpend] = useState(0);
  const [deliveredOrderCount, setDeliveredOrderCount] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [addressCount, setAddressCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [tab, setTab] = useState<Tab>("Overview");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [detail, orderRes, deliveredRes, addressRes, wishlistRes] =
        await Promise.all([
          fetchCustomer(customerId),
          fetchOrders({
            customerId,
            pageSize: 8,
            sortBy: "createdAt",
            sortDir: "desc",
          }),
          fetchOrders({
            customerId,
            currentStatus: "DELIVERED",
            pageSize: 500,
            sortBy: "createdAt",
            sortDir: "desc",
          }),
          fetchAddresses({ customerId, pageSize: 1 }),
          fetchWishlists({ customerId, pageSize: 1 }),
        ]);
      setCustomer(detail);
      setOrders(orderRes.items);
      setOrderTotal(orderRes.pagination.total);
      setDeliveredOrderCount(deliveredRes.pagination.total);
      setDeliveredSpend(
        deliveredRes.items.reduce((sum, order) => sum + order.totalAmount, 0),
      );
      setAddressCount(addressRes.pagination.total);
      setWishlistCount(wishlistRes.pagination.total);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load customer"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [customerId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !customer) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading customer...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      href: `/my-admin/customers/${customerId}/edit`,
      label: "Edit profile",
      description: "Update name, phone, and account settings",
      icon: Pencil,
    },
    {
      href: `/my-admin/customers/addresses?customerId=${customerId}`,
      label: "Saved addresses",
      description: `${addressCount} address${addressCount === 1 ? "" : "es"} on file`,
      icon: MapPin,
    },
    {
      href: `/my-admin/customers/wishlists?customerId=${customerId}`,
      label: "Wishlist",
      description: `${wishlistCount} saved item${wishlistCount === 1 ? "" : "s"}`,
      icon: Heart,
    },
    {
      href: `/my-admin/customers/wallet?customerId=${customerId}`,
      label: "Wallet",
      description: "View balance and transactions",
      icon: Wallet,
    },
  ];

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={customer.fullName}
        listPath={LIST_PATH}
        listLabel="Customers"
        sectionLabel="Customers"
      />

      <div className="admin-data-card admin-record-detail">
        <AdminRecordHero
          eyebrow="Customer profile"
          title={
            <span className="admin-customer-hero-row">
              <span className="admin-customer-avatar" aria-hidden>
                {customerInitials(customer.fullName)}
              </span>
              {customer.fullName}
            </span>
          }
          subtitle={customer.email || customer.phone || "No contact email or phone"}
          badge={
            <span
              className={`admin-status-badge ${customer.isActive ? "active" : "inactive"}`}
            >
              {customer.isActive ? "Active" : "Inactive"}
            </span>
          }
          chips={
            <>
              <AdminRecordChip tone={customer.isGuest ? "muted" : "success"}>
                {customer.isGuest ? "Guest" : "Registered"}
              </AdminRecordChip>
              {customer.profile?.newsletterSubscribed && (
                <AdminRecordChip tone="warning">Newsletter</AdminRecordChip>
              )}
              <AdminRecordChip tone="muted">
                Member since {formatDate(customer.createdAt)}
              </AdminRecordChip>
            </>
          }
          actions={
            <Link
              href={`/my-admin/customers/${customerId}/edit`}
              className="admin-btn admin-btn-primary"
            >
              <Pencil size={16} />
              Edit customer
            </Link>
          }
        />

        <AdminRecordMetrics
          items={[
            {
              label: "Orders",
              value: orderTotal,
              hint: "All time",
              tone: "info",
            },
            {
              label: "Delivered spend",
              value: formatCurrency(deliveredSpend),
              hint: `${deliveredOrderCount} delivered · excludes cancelled/returned/refunded`,
              tone: "success",
            },
            {
              label: "Addresses",
              value: addressCount,
            },
            {
              label: "Wishlist",
              value: wishlistCount,
            },
          ]}
        />

        <AdminRecordTabs
          tabs={[...TABS]}
          active={tab}
          onChange={(id) => setTab(id as Tab)}
        />

        {tab === "Overview" && (
          <AdminRecordPanel>
            <div className="admin-record-grid admin-record-grid--3">
              <AdminInfoCard title="Contact" icon={User}>
                <AdminInfoRow label="Name" value={customer.fullName} strong />
                <AdminInfoRow
                  label="Email"
                  value={
                    customer.email ? (
                      <a href={`mailto:${customer.email}`} className="admin-data-link">
                        {customer.email}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <AdminInfoRow
                  label="Phone"
                  value={
                    customer.phone ? (
                      <a href={`tel:${customer.phone}`} className="admin-data-link">
                        {customer.phone}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
              </AdminInfoCard>

              <AdminInfoCard title="Account" icon={LayoutDashboard}>
                <AdminInfoRow
                  label="Type"
                  value={customer.isGuest ? "Guest checkout" : "Registered user"}
                />
                <AdminInfoRow
                  label="Status"
                  value={customer.isActive ? "Active" : "Inactive"}
                  strong
                />
                <AdminInfoRow label="Joined" value={formatDate(customer.createdAt)} />
                {customer.userId && (
                  <AdminInfoRow label="User ID" value={customer.userId} />
                )}
              </AdminInfoCard>

              {customer.profile ? (
                <AdminInfoCard title="Profile" icon={Mail}>
                  <AdminInfoRow label="Gender" value={customer.profile.gender ?? "—"} />
                  <AdminInfoRow
                    label="Date of birth"
                    value={
                      customer.profile.dateOfBirth
                        ? formatDate(customer.profile.dateOfBirth)
                        : "—"
                    }
                  />
                  <AdminInfoRow
                    label="Newsletter"
                    value={
                      customer.profile.newsletterSubscribed
                        ? "Subscribed"
                        : "Not subscribed"
                    }
                  />
                </AdminInfoCard>
              ) : (
                <AdminInfoCard title="Profile" icon={Mail}>
                  <p className="admin-info-card__address">
                    No extended profile details yet.
                  </p>
                </AdminInfoCard>
              )}
            </div>

            <h3 className="admin-record-section-title admin-record-section-title--spaced">
              Quick actions
            </h3>
            <AdminQuickActions items={quickActions} />

            {orders.length > 0 && (
              <>
                <h3 className="admin-record-section-title admin-record-section-title--spaced">
                  Recent orders
                </h3>
                <div className="admin-data-table-wrap">
                  <table className="admin-data-table admin-data-table--comfortable">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td>{order.orderNumber}</td>
                          <td>
                            <OrderStatusBadge
                              statusCode={order.statusCode}
                              statusName={order.statusName}
                              currentStatus={order.currentStatus}
                            />
                          </td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <Link
                              href={`/my-admin/orders/${order.id}`}
                              className="admin-data-link"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </AdminRecordPanel>
        )}

        {tab === "Orders" && (
          <AdminRecordPanel>
            <div className="admin-record-table-head">
              <h3>Order history</h3>
              <span>
                {orderTotal} order{orderTotal === 1 ? "" : "s"} total
              </span>
            </div>
            {orders.length === 0 ? (
              <div className="admin-record-empty">
                This customer has not placed any orders yet.
              </div>
            ) : (
              <div className="admin-data-table-wrap">
                <table className="admin-data-table admin-data-table--comfortable">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Placed</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.orderNumber}</strong>
                        </td>
                        <td>{order.paymentMethod}</td>
                        <td>
                          <OrderStatusBadge
                            statusCode={order.statusCode}
                            statusName={order.statusName}
                            currentStatus={order.currentStatus}
                          />
                        </td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <Link
                            href={`/my-admin/orders/${order.id}`}
                            className="admin-btn admin-btn-outline admin-btn-sm"
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {orderTotal > orders.length && (
              <p className="admin-record-empty" style={{ paddingTop: "1rem" }}>
                Showing latest {orders.length} of {orderTotal} orders.
              </p>
            )}
          </AdminRecordPanel>
        )}
      </div>
    </div>
  );
}
