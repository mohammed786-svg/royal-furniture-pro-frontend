export type AdminOrderNotificationPayload = {
  action: string;
  orderId: string;
  orderNumber: string;
  status?: string;
  statusName?: string;
  totalAmount?: number;
  customerName?: string;
  timestamp?: string;
  fromStatus?: string;
  toStatus?: string;
  requestType?: string;
};

export const ORDER_NOTIFICATION_ACTIONS: Record<
  string,
  { label: string; tone: "new" | "update" | "cancel" | "return" | "awb" }
> = {
  created: { label: "New order", tone: "new" },
  updated: { label: "Order updated", tone: "update" },
  cancelled: { label: "Order cancelled", tone: "cancel" },
  return: { label: "Return requested", tone: "return" },
  awb_generated: { label: "AWB generated", tone: "awb" },
};

export function getOrderNotificationMeta(payload: AdminOrderNotificationPayload) {
  const base = ORDER_NOTIFICATION_ACTIONS[payload.action] ?? {
    label: "Order update",
    tone: "update" as const,
  };

  if (payload.action === "return" && payload.requestType === "EXCHANGE") {
    return { label: "Exchange requested", tone: "return" as const };
  }

  if (payload.action === "updated" && payload.toStatus) {
    return {
      label: `Status → ${payload.statusName || payload.toStatus}`,
      tone: base.tone,
    };
  }

  return base;
}
