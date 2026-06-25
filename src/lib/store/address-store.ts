"use client";

import { create } from "zustand";
import {
  createStorefrontAddress,
  deleteStorefrontAddress,
  fetchStorefrontAddresses,
  updateStorefrontAddress,
} from "@/services/storefront-commerce";

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
  loading: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addAddress: (input: NewAddressInput) => Promise<string>;
  updateAddress: (id: string, input: NewAddressInput) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setSelectedAddressId: (id: string | null) => void;
  getSelectedAddress: () => SavedAddress | null;
  addressLabel: (addr: SavedAddress) => string;
};

export const useAddressStore = create<AddressStore>()((set, get) => ({
  addresses: [],
  selectedAddressId: null,
  loading: false,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    set({ loading: true });
    try {
      const data = await fetchStorefrontAddresses();
      set({
        addresses: data.items,
        selectedAddressId: data.selectedAddressId,
        loading: false,
        hydrated: true,
      });
    } catch {
      set({ loading: false, hydrated: true });
    }
  },

  addAddress: async (input) => {
    const { item } = await createStorefrontAddress(input);
    const addresses = [...get().addresses, item];
    set({
      addresses,
      selectedAddressId: get().selectedAddressId ?? item.id,
    });
    return item.id;
  },

  updateAddress: async (id, input) => {
    const { item } = await updateStorefrontAddress(id, input);
    set({
      addresses: get().addresses.map((a) => (a.id === id ? item : a)),
    });
  },

  removeAddress: async (id) => {
    await deleteStorefrontAddress(id);
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
    if (addr.type === "other" && addr.customLabel) return addr.customLabel;
    return addr.type.charAt(0).toUpperCase() + addr.type.slice(1);
  },
}));
