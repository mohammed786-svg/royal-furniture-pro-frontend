"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartOrderTotal, type CartLineItem } from "@/lib/constants/cart-data";
import type { PaymentMethod } from "@/lib/constants/payment-config";
import type { SavedAddress } from "@/lib/store/address-store";

export type OrderStatus =
  | "payment_verification"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export type PlacedOrder = {
  id: string;
  createdAt: string;
  items: CartLineItem[];
  total: number;
  address: SavedAddress;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentScreenshotName?: string;
  status: OrderStatus;
};

type OrderStore = {
  orders: PlacedOrder[];
  lastOrderId: string | null;
  placeOrder: (payload: Omit<PlacedOrder, "id" | "createdAt" | "status">) => string;
  getOrder: (id: string) => PlacedOrder | undefined;
  findOrdersByMobile: (mobile: string) => PlacedOrder[];
};

function generateOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `RF-${y}${m}${day}-${rand}`;
}

export const ORDER_STATUS_STEPS: {
  status: OrderStatus;
  label: string;
  desc: string;
}[] = [
  {
    status: "payment_verification",
    label: "Payment received",
    desc: "We are verifying your payment",
  },
  { status: "confirmed", label: "Order confirmed", desc: "Your order is confirmed" },
  { status: "processing", label: "Processing", desc: "Items are being prepared" },
  { status: "shipped", label: "Shipped", desc: "On the way to our hub" },
  {
    status: "out_for_delivery",
    label: "Out for delivery",
    desc: "Delivery partner assigned",
  },
  { status: "delivered", label: "Delivered", desc: "Enjoy your new furniture" },
];

export function orderStatusIndex(status: OrderStatus): number {
  return ORDER_STATUS_STEPS.findIndex((s) => s.status === status);
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      lastOrderId: null,

      placeOrder: (payload) => {
        const id = generateOrderId();
        const order: PlacedOrder = {
          ...payload,
          id,
          createdAt: new Date().toISOString(),
          status: "payment_verification",
        };
        set({
          orders: [order, ...get().orders],
          lastOrderId: id,
        });
        return id;
      },

      getOrder: (id) =>
        get().orders.find((o) => o.id.toUpperCase() === id.toUpperCase()),

      findOrdersByMobile: (mobile) => {
        const digits = mobile.replace(/\D/g, "").slice(-10);
        return get().orders.filter((o) => {
          const phone = o.address.phone.replace(/\D/g, "").slice(-10);
          return phone === digits;
        });
      },
    }),
    { name: "royal-order-store" },
  ),
);

export function orderTotalFromItems(items: CartLineItem[]) {
  return cartOrderTotal(items);
}
