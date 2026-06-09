"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_PINCODE = "560001";

type DeliveryStore = {
  pincode: string;
  setPincode: (pincode: string) => void;
};

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set) => ({
      pincode: DEFAULT_PINCODE,
      setPincode: (pincode) => set({ pincode: pincode.replace(/\D/g, "").slice(0, 6) }),
    }),
    { name: "royal-delivery-pincode" },
  ),
);

export function isValidPincode(pincode: string) {
  return /^\d{6}$/.test(pincode);
}
