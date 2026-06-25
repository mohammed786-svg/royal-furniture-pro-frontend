"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setCustomerAuthToken } from "@/lib/axios/customer-auth-token";
import type { StorefrontAuthUser } from "@/types/storefront-commerce";

export type AuthUser = {
  customerId?: string;
  name: string;
  mobile: string;
  email?: string;
};

type AuthStore = {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: StorefrontAuthUser, accessToken: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setSession: (user, accessToken) => {
        setCustomerAuthToken(accessToken);
        set({
          accessToken,
          user: {
            customerId: user.customerId,
            name: user.name,
            mobile: user.mobile,
            email: user.email ?? undefined,
          },
        });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        setCustomerAuthToken(null);
        set({ user: null, accessToken: null });
      },

      isLoggedIn: () => Boolean(get().accessToken && get().user),
    }),
    { name: "royal-auth-store" },
  ),
);
