"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_PINCODE = "560001";

export type PincodeSource = "default" | "manual" | "address" | "geo";

type DeliveryStore = {
  pincode: string;
  cityLabel: string;
  pincodeSource: PincodeSource;
  isDetecting: boolean;
  setPincode: (pincode: string, source?: PincodeSource, cityLabel?: string) => void;
  applyDetectedPincode: (
    pincode: string,
    source: Exclude<PincodeSource, "default" | "manual">,
    cityLabel?: string,
  ) => void;
  setDetecting: (value: boolean) => void;
};

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set) => ({
      pincode: DEFAULT_PINCODE,
      cityLabel: "",
      pincodeSource: "default",
      isDetecting: false,
      setPincode: (pincode, source = "manual", cityLabel) =>
        set((state) => ({
          pincode: pincode.replace(/\D/g, "").slice(0, 6),
          pincodeSource: source,
          cityLabel: cityLabel ?? state.cityLabel,
        })),
      applyDetectedPincode: (pincode, source, cityLabel) =>
        set({
          pincode: pincode.replace(/\D/g, "").slice(0, 6),
          pincodeSource: source,
          cityLabel: cityLabel ?? "",
        }),
      setDetecting: (isDetecting) => set({ isDetecting }),
    }),
    {
      name: "royal-delivery-pincode",
      partialize: (state) => ({
        pincode: state.pincode,
        cityLabel: state.cityLabel,
        pincodeSource: state.pincodeSource,
      }),
    },
  ),
);

export function isValidPincode(pincode: string) {
  return /^\d{6}$/.test(pincode);
}
