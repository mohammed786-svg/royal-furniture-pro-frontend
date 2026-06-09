"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getDefaultFiscalYear,
  getFiscalYearOptions,
  type FiscalYear,
} from "@/lib/admin/fiscal-year";

type FiscalYearStore = {
  selected: FiscalYear;
  setFiscalYear: (year: FiscalYear) => void;
  options: FiscalYear[];
};

export const useFiscalYearStore = create<FiscalYearStore>()(
  persist(
    (set) => ({
      selected: getDefaultFiscalYear(),
      options: getFiscalYearOptions(),
      setFiscalYear: (year) => set({ selected: year }),
    }),
    {
      name: "royal-admin-fiscal-year",
      partialize: (state) => ({ selected: state.selected }),
    },
  ),
);
