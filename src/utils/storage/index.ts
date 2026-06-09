const isBrowser = typeof window !== "undefined";

export const storageKeys = {
  guestSession: "royal_guest_session",
  cartSession: "royal_cart_session",
  theme: "royal_theme",
  auth: "royal_auth",
} as const;

export const localStorageCache = {
  get<T>(key: string): T | null {
    if (!isBrowser) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },
};

export const sessionStorageCache = {
  get<T>(key: string): T | null {
    if (!isBrowser) return null;
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    if (!isBrowser) return;
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    if (!isBrowser) return;
    sessionStorage.removeItem(key);
  },
};
