import { resolveOrderStatusBadge } from "@/lib/admin/order-status-badge";

type OrderStatusBadgeProps = {
  statusCode?: string | null;
  statusName?: string | null;
  currentStatus?: string | null;
};

export function OrderStatusBadge({
  statusCode,
  statusName,
  currentStatus,
}: OrderStatusBadgeProps) {
  const badge = resolveOrderStatusBadge({ statusCode, statusName, currentStatus });

  return <span className={badge.className}>{badge.label}</span>;
}
