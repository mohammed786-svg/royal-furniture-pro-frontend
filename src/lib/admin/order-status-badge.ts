export type OrderStatusBadgeVariant =
  | "pending"
  | "payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded"
  | "default";

type OrderStatusInput = {
  statusCode?: string | null;
  statusName?: string | null;
  currentStatus?: string | null;
};

const CODE_VARIANTS: Record<string, OrderStatusBadgeVariant> = {
  PENDING: "pending",
  PAYMENT_PENDING: "payment",
  PAYMENT_VERIFIED: "payment",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  PACKED: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  RETURNED: "returned",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

function inferVariantFromLabel(label: string): OrderStatusBadgeVariant {
  const key = label.toLowerCase();
  if (key.includes("cancel")) return "cancelled";
  if (key.includes("return")) return "returned";
  if (key.includes("refund")) return "refunded";
  if (key.includes("deliver")) return "delivered";
  if (key.includes("ship")) return "shipped";
  if (key.includes("payment")) return "payment";
  if (key.includes("confirm")) return "confirmed";
  if (key.includes("process") || key.includes("pack")) return "processing";
  if (key.includes("pending")) return "pending";
  return "default";
}

export function resolveOrderStatusBadge(order: OrderStatusInput): {
  label: string;
  variant: OrderStatusBadgeVariant;
  className: string;
} {
  const code = (order.statusCode || order.currentStatus || "").trim().toUpperCase();
  const label = (order.statusName || order.currentStatus || code || "Unknown").trim();
  const variant = CODE_VARIANTS[code] ?? inferVariantFromLabel(label);

  return {
    label,
    variant,
    className: `admin-order-status-badge admin-order-status-badge--${variant}`,
  };
}
