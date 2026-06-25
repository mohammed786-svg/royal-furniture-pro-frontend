import { browserCacheConfig } from "@/config/cache/browser.config";
import type { StorefrontProductDetailResponse } from "@/types/storefront-catalog";

type StoredProduct = StorefrontProductDetailResponse & {
  storedAt: number;
};

function storageKey(slug: string): string {
  return `${browserCacheConfig.prefix}:product:${slug}`;
}

function isFresh(entry: StoredProduct): boolean {
  return Date.now() - entry.storedAt < browserCacheConfig.ttl.product * 1000;
}

export function readProductDetailCache(
  slug: string,
): StorefrontProductDetailResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProduct;
    if (!parsed?.version) return null;
    if (!isFresh(parsed)) return null;
    const { storedAt: _storedAt, ...data } = parsed;
    return data;
  } catch {
    return null;
  }
}

export function readProductDetailCacheStale(
  slug: string,
): StorefrontProductDetailResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProduct;
    const { storedAt: _storedAt, ...data } = parsed;
    return data;
  } catch {
    return null;
  }
}

export function writeProductDetailCache(
  slug: string,
  data: StorefrontProductDetailResponse,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredProduct = { ...data, storedAt: Date.now() };
    window.localStorage.setItem(storageKey(slug), JSON.stringify(payload));
  } catch {
    // Ignore storage errors.
  }
}
