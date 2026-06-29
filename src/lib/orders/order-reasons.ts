export const ORDER_REASON_OPTIONS = [
  { code: "CHANGED_MIND", label: "Changed my mind" },
  { code: "ORDERED_MISTAKE", label: "Ordered by mistake" },
  { code: "BETTER_PRICE", label: "Found a better price elsewhere" },
  { code: "SLOW_DELIVERY", label: "Delivery taking too long" },
  { code: "OTHER", label: "Other" },
] as const;

export type OrderReasonCode = (typeof ORDER_REASON_OPTIONS)[number]["code"];

export type OrderActionsInfo = {
  orderId: string;
  orderNumber: string;
  status: string;
  canCancel: boolean;
  canGenerateAwb: boolean;
  canReturn: boolean;
  canExchange: boolean;
  hasAwb: boolean;
  reasons: { code: string; label: string }[];
};
