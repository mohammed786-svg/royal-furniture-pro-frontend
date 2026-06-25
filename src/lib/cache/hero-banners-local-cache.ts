import { browserCacheConfig } from "@/config/cache/browser.config";
import type { HeroBannersResponse } from "@/types/hero-banners";

type StoredHeroBanners = HeroBannersResponse & {
  storedAt: number;
};

const POSITION = "HOME_HERO";

function storageKey(): string {
  return `${browserCacheConfig.keys.heroBanners}:${POSITION}`;
}

function isFresh(entry: StoredHeroBanners): boolean {
  const ageMs = Date.now() - entry.storedAt;
  return ageMs < browserCacheConfig.ttl.heroBanners * 1000;
}

export function readHeroBannersLocalCache(): HeroBannersResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredHeroBanners;
    if (!parsed?.items || !parsed.version) return null;
    if (!isFresh(parsed)) return null;
    const { storedAt: _storedAt, ...payload } = parsed;
    return payload;
  } catch {
    return null;
  }
}

export function readHeroBannersLocalCacheStale(): HeroBannersResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredHeroBanners;
    if (!parsed?.items) return null;
    const { storedAt: _storedAt, ...payload } = parsed;
    return payload;
  } catch {
    return null;
  }
}

export function writeHeroBannersLocalCache(payload: HeroBannersResponse): void {
  if (typeof window === "undefined") return;
  try {
    const entry: StoredHeroBanners = { ...payload, storedAt: Date.now() };
    window.localStorage.setItem(storageKey(), JSON.stringify(entry));
  } catch {
    // Ignore quota / private mode errors.
  }
}
