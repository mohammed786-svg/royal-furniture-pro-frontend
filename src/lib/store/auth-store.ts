"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  name: string;
  mobile: string;
  email?: string;
};

type AuthStore = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      isLoggedIn: () => Boolean(get().user),
    }),
    { name: "royal-auth-store" },
  ),
);
