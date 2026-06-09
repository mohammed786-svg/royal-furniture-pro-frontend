import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Lightweight UI state (modals, drawers, sidebar).
 * Domain state belongs in Redux slices when implemented.
 */
type UiState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: false,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
      }),
      { name: "royal-ui-store" },
    ),
    { name: "UiStore" },
  ),
);
