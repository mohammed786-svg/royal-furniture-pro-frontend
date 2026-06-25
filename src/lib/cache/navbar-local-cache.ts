import { browserCacheConfig } from "@/config/cache/browser.config";
import type { NavbarTreeResponse } from "@/types/navbar";

type StoredNavbar = NavbarTreeResponse & {
  storedAt: number;
};

function storageKey(): string {
  return browserCacheConfig.keys.navbar;
}

function isFresh(entry: StoredNavbar): boolean {
  const ageMs = Date.now() - entry.storedAt;
  return ageMs < browserCacheConfig.ttl.navbar * 1000;
}

export function readNavbarLocalCache(): NavbarTreeResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredNavbar;
    if (!parsed?.items || !parsed.version) return null;
    if (!isFresh(parsed)) return null;
    const { storedAt: _storedAt, ...tree } = parsed;
    return tree;
  } catch {
    return null;
  }
}

/** Returns cached tree even when TTL expired — used as offline/stale fallback. */
export function readNavbarLocalCacheStale(): NavbarTreeResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredNavbar;
    if (!parsed?.items) return null;
    const { storedAt: _storedAt, ...tree } = parsed;
    return tree;
  } catch {
    return null;
  }
}

export function writeNavbarLocalCache(tree: NavbarTreeResponse): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredNavbar = { ...tree, storedAt: Date.now() };
    window.localStorage.setItem(storageKey(), JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function isNavbarCacheStale(tree: NavbarTreeResponse): boolean {
  const cached = readNavbarLocalCache();
  if (!cached) return true;
  return cached.version !== tree.version;
}
