"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/cache/react-query/keys";
import { queryCacheConfig } from "@/config/cache/react-query.config";
import {
  readHomepageLocalCache,
  readHomepageLocalCacheStale,
  writeHomepageLocalCache,
} from "@/lib/cache/homepage-local-cache";
import { resolveHomepageData } from "@/lib/home/homepage-utils";
import { fetchStorefrontHome } from "@/services/storefront-home";
import type {
  HomepageDataSource,
  HomepageState,
  StorefrontHomeResponse,
} from "@/types/storefront-home";

const HomepageContext = createContext<HomepageState | null>(null);

type CacheMode = "checking" | "cache" | "nocache";

function pickSource(
  apiData: StorefrontHomeResponse | undefined,
  localCache: StorefrontHomeResponse | null,
  staleLocal: StorefrontHomeResponse | null,
): HomepageDataSource {
  if (apiData) return "api";
  if (localCache) return "cache";
  if (staleLocal) return "cache";
  return "empty";
}

export function HomepageProvider({ children }: { children: React.ReactNode }) {
  const [localCache, setLocalCache] = useState<StorefrontHomeResponse | null>(null);
  const [staleLocal, setStaleLocal] = useState<StorefrontHomeResponse | null>(null);
  const [cacheMode, setCacheMode] = useState<CacheMode>("checking");

  useEffect(() => {
    // Detect full page reload (Ctrl+R / browser refresh / hard refresh).
    // Best-effort: browsers set PerformanceNavigationTiming.type === 'reload'.
    // If we can't detect reliably, we fall back to allowing cache usage.
    let isReload = false;
    try {
      const nav = performance.getEntriesByType("navigation")?.[0] as
        | PerformanceNavigationTiming
        | undefined;
      isReload = nav?.type === "reload";

      // Fallback for older browsers
      if (!isReload && (performance as any).navigation?.type !== undefined) {
        isReload = (performance as any).navigation.type === 1; // 1 == reload
      }
    } catch {
      isReload = false;
    }

    setCacheMode(isReload ? "nocache" : "cache");
  }, []);

  useEffect(() => {
    if (cacheMode !== "cache") return;
    setLocalCache(readHomepageLocalCache());
    setStaleLocal(readHomepageLocalCacheStale());
  }, [cacheMode]);

  const query = useQuery({
    queryKey:
      cacheMode === "nocache"
        ? [...queryKeys.storefrontHome(), "nocache"]
        : queryKeys.storefrontHome(),
    queryFn: () => fetchStorefrontHome({ nocache: cacheMode === "nocache" }),
    staleTime: cacheMode === "nocache" ? 0 : queryCacheConfig.staleTime.catalog,
    gcTime: cacheMode === "nocache" ? 0 : queryCacheConfig.gcTime.catalog,
    placeholderData: cacheMode === "nocache" ? undefined : () => localCache ?? staleLocal ?? undefined,
    enabled: cacheMode !== "checking",
  });

  useEffect(() => {
    if (!query.data) return;
    if (cacheMode !== "cache") return; // Do not write local cache during hard reload.
    const cached = readHomepageLocalCacheStale();
    if (!cached || cached.version !== query.data.version) {
      writeHomepageLocalCache(query.data);
      setLocalCache(query.data);
    }
  }, [query.data, cacheMode]);

  const source = pickSource(query.data, localCache, staleLocal);
  const useErrorFallback = query.isError && !query.data && !localCache && !staleLocal;

  const data = useMemo(
    () =>
      resolveHomepageData(
        query.data ?? localCache ?? staleLocal ?? undefined,
        useErrorFallback,
      ),
    [query.data, localCache, staleLocal, useErrorFallback],
  );

  const value: HomepageState = {
    data,
    source,
    isLoading:
      query.isLoading && cacheMode !== "nocache" && !localCache && !staleLocal,
    isFetching: query.isFetching,
    isError: query.isError,
  };

  return <HomepageContext.Provider value={value}>{children}</HomepageContext.Provider>;
}

export function useHomepage(): HomepageState {
  const context = useContext(HomepageContext);
  if (!context) {
    throw new Error("useHomepage must be used within HomepageProvider");
  }
  return context;
}
