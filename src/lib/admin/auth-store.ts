"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/lib/admin/types";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { setAdminAuthToken, setAdminRefreshToken, clearAdminAuthTokens } from "@/lib/axios/admin-auth-token";
import {
  adminChangePassword,
  adminLogin,
  adminLogout,
  adminMe,
  adminRefresh,
  adminUpdateProfile,
} from "@/services/admin-auth";

type PersistedAuthState = {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
};

type AdminAuthStore = PersistedAuthState & {
  isHydrated: boolean;
  login: (
    email: string,
    password: string,
    remember?: boolean,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  isLoggedIn: () => boolean;
  updateProfile: (
    data: Pick<AdminUser, "fullName" | "phone" | "avatarUrl">,
  ) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
};

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      isHydrated: false,
      login: async (email, password, remember = false) => {
        try {
          const result = await adminLogin(email, password, remember);
          setAdminAuthToken(result.accessToken);
          setAdminRefreshToken(result.refreshToken ?? null);
          set({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken ?? null,
            rememberMe: remember,
          });
          return { ok: true };
        } catch (err) {
          return {
            ok: false,
            error: getApiErrorMessage(err, "Invalid email or password"),
          };
        }
      },
      logout: async () => {
        try {
          await adminLogout(get().refreshToken);
        } catch {
          // Clear local state even if API fails
        }
        setAdminAuthToken(null);
        setAdminRefreshToken(null);
        set({ user: null, accessToken: null, refreshToken: null, rememberMe: false });
      },
      restoreSession: async () => {
        const { accessToken } = get();
        if (accessToken) {
          setAdminAuthToken(accessToken);
          try {
            const freshUser = await adminMe();
            set({ user: freshUser });
            return true;
          } catch {
            // Access token expired — try refresh cookie within session window.
          }
        }
        try {
          const result = await adminRefresh(get().refreshToken);
          setAdminAuthToken(result.accessToken);
          setAdminRefreshToken(result.refreshToken ?? get().refreshToken);
          set({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken ?? get().refreshToken,
          });
          return true;
        } catch {
          setAdminAuthToken(null);
          setAdminRefreshToken(null);
          set({ user: null, accessToken: null, refreshToken: null, rememberMe: false });
          return false;
        }
      },
      isLoggedIn: () => Boolean(get().user && get().accessToken),
      updateProfile: async (data) => {
        const user = await adminUpdateProfile({
          fullName: data.fullName,
          phone: data.phone,
        });
        set({ user });
      },
      changePassword: async (currentPassword, newPassword) => {
        try {
          await adminChangePassword({ currentPassword, newPassword });
          setAdminAuthToken(null);
          set({ user: null, accessToken: null });
          return { ok: true };
        } catch (err) {
          return {
            ok: false,
            error: getApiErrorMessage(err, "Password change failed"),
          };
        }
      },
    }),
    {
      name: "royal-admin-auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        rememberMe: state.rememberMe,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<PersistedAuthState>;
        return {
          ...current,
          ...saved,
          user: current.user ?? saved.user ?? null,
          accessToken: current.accessToken ?? saved.accessToken ?? null,
          refreshToken: current.refreshToken ?? saved.refreshToken ?? null,
          rememberMe: current.rememberMe ?? saved.rememberMe ?? false,
          isHydrated: current.isHydrated,
        };
      },
    },
  ),
);
