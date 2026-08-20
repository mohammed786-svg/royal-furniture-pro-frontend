import { browserCacheConfig } from "@/config/cache/browser.config";
import type { StorefrontCategoryListingResponse } from "@/types/storefront-catalog";

type StoredListing = StorefrontCategoryListingResponse & {
  storedAt: number;
};

function storageKey(
  categorySlug: string,
  subCategorySlug: string,
  underSubCategorySlug?: string,
  sort?: string,
): string {
  const under = underSubCategorySlug ? `/${underSubCategorySlug}` : "";
  const sortKey = sort && sort !== "Recommended" ? `:sort:${sort}` : "";
  return `${browserCacheConfig.prefix}:plp:${categorySlug}/${subCategorySlug}${under}${sortKey}`;
}

function isFresh(entry: StoredListing): boolean {
  return Date.now() - entry.storedAt < browserCacheConfig.ttl.category * 1000;
}

export function readCategoryListingCache(
  categorySlug: string,
  subCategorySlug: string,
  underSubCategorySlug?: string,
  sort?: string,
): StorefrontCategoryListingResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(
      storageKey(categorySlug, subCategorySlug, underSubCategorySlug, sort),
    );
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
  underSubCategorySlug?: string,
  sort?: string,
): StorefrontCategoryListingResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(
      storageKey(categorySlug, subCategorySlug, underSubCategorySlug, sort),
    );
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
  underSubCategorySlug?: string,
  sort?: string,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredListing = { ...data, storedAt: Date.now() };
    window.localStorage.setItem(
      storageKey(categorySlug, subCategorySlug, underSubCategorySlug, sort),
      JSON.stringify(payload),
    );
  } catch {
    // Ignore storage errors.
  }
}

export function clearCategoryListingCache(
  categorySlug: string,
  subCategorySlug: string,
  underSubCategorySlug?: string,
  sort?: string,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(
      storageKey(categorySlug, subCategorySlug, underSubCategorySlug, sort),
    );
  } catch {
    // Ignore storage errors.
  }
}
