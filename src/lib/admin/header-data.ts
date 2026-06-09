export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "payment" | "inventory" | "system";
};

export type AdminChatMessage = {
  id: string;
  sender: string;
  initials: string;
  message: string;
  time: string;
  unread: boolean;
};

export const adminNotifications: AdminNotification[] = [
  {
    id: "1",
    title: "New Order",
    message: "Order RF-28472 placed by Amit Kumar for ₹24,999",
    time: "2 min ago",
    read: false,
    type: "order",
  },
  {
    id: "2",
    title: "Payment Received",
    message: "Payment confirmed for order RF-28471 — ₹42,999",
    time: "15 min ago",
    read: false,
    type: "payment",
  },
  {
    id: "3",
    title: "Low Stock Alert",
    message: "Milano Sofa Set is down to 3 units in Mumbai warehouse",
    time: "1 hr ago",
    read: false,
    type: "inventory",
  },
  {
    id: "4",
    title: "Return Request",
    message: "Return initiated for order RF-28465 by Neha Gupta",
    time: "3 hrs ago",
    read: true,
    type: "order",
  },
];

export const adminChatMessages: AdminChatMessage[] = [
  {
    id: "1",
    sender: "Support Team",
    initials: "ST",
    message: "Customer query on delivery delay for RF-28468",
    time: "5 min ago",
    unread: true,
  },
  {
    id: "2",
    sender: "Warehouse Ops",
    initials: "WO",
    message: "Stock transfer to Delhi warehouse completed",
    time: "20 min ago",
    unread: true,
  },
  {
    id: "3",
    sender: "Finance",
    initials: "FN",
    message: "Daily payment reconciliation report is ready",
    time: "1 hr ago",
    unread: false,
  },
];
