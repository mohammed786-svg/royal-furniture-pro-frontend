"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AddressType = "home" | "office" | "other";

export type SavedAddress = {
  id: string;
  type: AddressType;
  customLabel?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

export type NewAddressInput = Omit<SavedAddress, "id">;

type AddressStore = {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  addAddress: (input: NewAddressInput) => string;
  updateAddress: (id: string, input: NewAddressInput) => void;
  removeAddress: (id: string) => void;
  setSelectedAddressId: (id: string | null) => void;
  getSelectedAddress: () => SavedAddress | null;
  addressLabel: (addr: SavedAddress) => string;
};

function makeId() {
  return `addr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [],
      selectedAddressId: null,

      addAddress: (input) => {
        const id = makeId();
        const isFirst = get().addresses.length === 0;
        const entry: SavedAddress = {
          ...input,
          id,
          isDefault: input.isDefault ?? isFirst,
        };
        set({
          addresses: [...get().addresses, entry],
          selectedAddressId: get().selectedAddressId ?? id,
        });
        return id;
      },

      updateAddress: (id, input) => {
        set({
          addresses: get().addresses.map((a) => (a.id === id ? { ...input, id } : a)),
        });
      },

      removeAddress: (id) => {
        const remaining = get().addresses.filter((a) => a.id !== id);
        const selected =
          get().selectedAddressId === id
            ? (remaining[0]?.id ?? null)
            : get().selectedAddressId;
        set({ addresses: remaining, selectedAddressId: selected });
      },

      setSelectedAddressId: (id) => set({ selectedAddressId: id }),

      getSelectedAddress: () => {
        const { addresses, selectedAddressId } = get();
        if (!selectedAddressId) return addresses[0] ?? null;
        return addresses.find((a) => a.id === selectedAddressId) ?? null;
      },

      addressLabel: (addr) => {
        if (addr.type === "other" && addr.customLabel?.trim()) {
          return addr.customLabel.trim();
        }
        return addr.type.charAt(0).toUpperCase() + addr.type.slice(1);
      },
    }),
    { name: "royal-address-store" },
  ),
);
