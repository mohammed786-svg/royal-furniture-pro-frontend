import { browserCacheConfig } from "@/config/cache/browser.config";
import type { StorefrontHomeResponse } from "@/types/storefront-home";

type StoredHomepage = StorefrontHomeResponse & {
  storedAt: number;
};

function storageKey(): string {
  return browserCacheConfig.keys.storefrontHome;
}

function isFresh(entry: StoredHomepage): boolean {
  return Date.now() - entry.storedAt < browserCacheConfig.ttl.storefrontHome * 1000;
}

export function readHomepageLocalCache(): StorefrontHomeResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredHomepage;
    if (!parsed?.version) return null;
    if (!isFresh(parsed)) return null;
    const { storedAt: _storedAt, ...data } = parsed;
    return data;
  } catch {
    return null;
  }
}

export function readHomepageLocalCacheStale(): StorefrontHomeResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredHomepage;
    const { storedAt: _storedAt, ...data } = parsed;
    return data;
  } catch {
    return null;
  }
}

export function writeHomepageLocalCache(data: StorefrontHomeResponse): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredHomepage = { ...data, storedAt: Date.now() };
    window.localStorage.setItem(storageKey(), JSON.stringify(payload));
  } catch {
    // Ignore storage errors.
  }
}
