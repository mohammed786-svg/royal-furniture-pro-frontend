import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/**
 * No-op storage for SSR — use with persistConfig on server.
 */
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key: string, value: unknown) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

export const getPersistStorage = () =>
  typeof window === "undefined" ? createNoopStorage() : createWebStorage("local");
