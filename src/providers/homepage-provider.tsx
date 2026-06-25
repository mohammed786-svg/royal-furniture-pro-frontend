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

  useEffect(() => {
    setLocalCache(readHomepageLocalCache());
    setStaleLocal(readHomepageLocalCacheStale());
  }, []);

  const query = useQuery({
    queryKey: queryKeys.storefrontHome(),
    queryFn: fetchStorefrontHome,
    staleTime: queryCacheConfig.staleTime.catalog,
    gcTime: queryCacheConfig.gcTime.catalog,
    placeholderData: () => localCache ?? staleLocal ?? undefined,
  });

  useEffect(() => {
    if (!query.data) return;
    const cached = readHomepageLocalCacheStale();
    if (!cached || cached.version !== query.data.version) {
      writeHomepageLocalCache(query.data);
      setLocalCache(query.data);
    }
  }, [query.data]);

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
    isLoading: query.isLoading && !localCache && !staleLocal,
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
