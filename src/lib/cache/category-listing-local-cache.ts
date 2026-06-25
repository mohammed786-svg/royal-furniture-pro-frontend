import { browserCacheConfig } from "@/config/cache/browser.config";
import type { StorefrontCategoryListingResponse } from "@/types/storefront-catalog";

type StoredListing = StorefrontCategoryListingResponse & {
  storedAt: number;
};

function storageKey(categorySlug: string, subCategorySlug: string): string {
  return `${browserCacheConfig.prefix}:plp:${categorySlug}/${subCategorySlug}`;
}

function isFresh(entry: StoredListing): boolean {
  return Date.now() - entry.storedAt < browserCacheConfig.ttl.category * 1000;
}

export function readCategoryListingCache(
  categorySlug: string,
  subCategorySlug: string,
): StorefrontCategoryListingResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(categorySlug, subCategorySlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredListing;
    if (!parsed?.version) return null;
    if (!isFresh(parsed)) return null;
    const { storedAt: _storedAt, ...data } = parsed;
    return data;
  } catch {
    return null;
  }
}

export function readCategoryListingCacheStale(
  categorySlug: string,
  subCategorySlug: string,
): StorefrontCategoryListingResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(categorySlug, subCategorySlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredListing;
    const { storedAt: _storedAt, ...data } = parsed;
    return data;
  } catch {
    return null;
  }
}

export function writeCategoryListingCache(
  categorySlug: string,
  subCategorySlug: string,
  data: StorefrontCategoryListingResponse,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredListing = { ...data, storedAt: Date.now() };
    window.localStorage.setItem(
      storageKey(categorySlug, subCategorySlug),
      JSON.stringify(payload),
    );
  } catch {
    // Ignore storage errors.
  }
}
