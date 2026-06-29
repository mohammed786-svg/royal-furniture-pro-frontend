"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clearCustomerAuthTokens,
  setCustomerAuthToken,
  setCustomerRefreshToken,
} from "@/lib/axios/customer-auth-token";
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
  refreshToken: string | null;
  isHydrated: boolean;
  setSession: (
    user: StorefrontAuthUser,
    accessToken: string,
    refreshToken?: string | null,
  ) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,

      setSession: (user, accessToken, refreshToken = null) => {
        setCustomerAuthToken(accessToken);
        setCustomerRefreshToken(refreshToken);
        set({
          accessToken,
          refreshToken,
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
        clearCustomerAuthTokens();
        set({ user: null, accessToken: null, refreshToken: null });
      },

      isLoggedIn: () => Boolean(get().accessToken && get().user),
    }),
    {
      name: "royal-auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setCustomerAuthToken(state.accessToken);
        }
        if (state?.refreshToken) {
          setCustomerRefreshToken(state.refreshToken);
        }
        useAuthStore.setState({ isHydrated: true });
      },
    },
  ),
);
