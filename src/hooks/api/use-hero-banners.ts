"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/cache/react-query/keys";
import { queryCacheConfig } from "@/config/cache/react-query.config";
import {
  readHeroBannersLocalCache,
  readHeroBannersLocalCacheStale,
  writeHeroBannersLocalCache,
} from "@/lib/cache/hero-banners-local-cache";
import { resolveHeroSlides } from "@/lib/hero/hero-banner-utils";
import { fetchHeroBanners } from "@/services/storefront-hero-banners";
import type {
  HeroBannersDataSource,
  HeroBannersResponse,
  HeroBannersState,
} from "@/types/hero-banners";

function pickSource(
  apiData: HeroBannersResponse | undefined,
  localTree: HeroBannersResponse | null,
  staleLocal: HeroBannersResponse | null,
  isError: boolean,
): { data: HeroBannersResponse | undefined; source: HeroBannersDataSource } {
  if (apiData?.items?.length) {
    return { data: apiData, source: "api" };
  }
  if (!isError && apiData) {
    return { data: apiData, source: "api" };
  }
  if (localTree) {
    return { data: localTree, source: "cache" };
  }
  if (staleLocal) {
    return { data: staleLocal, source: "cache" };
  }
  return { data: apiData, source: "empty" };
}

export function useHeroBanners(position = "HOME_HERO"): HeroBannersState {
  const [localCache, setLocalCache] = useState<HeroBannersResponse | null>(null);
  const [staleLocal, setStaleLocal] = useState<HeroBannersResponse | null>(null);

  useEffect(() => {
    setLocalCache(readHeroBannersLocalCache());
    setStaleLocal(readHeroBannersLocalCacheStale());
  }, []);

  const query = useQuery({
    queryKey: queryKeys.heroBanners(position),
    queryFn: () => fetchHeroBanners(position),
    staleTime: queryCacheConfig.staleTime.catalog,
    gcTime: queryCacheConfig.gcTime.catalog,
    placeholderData: () => localCache ?? staleLocal ?? undefined,
  });

  useEffect(() => {
    if (!query.data) return;
    const cached = readHeroBannersLocalCacheStale();
    if (!cached || cached.version !== query.data.version) {
      writeHeroBannersLocalCache(query.data);
      setLocalCache(query.data);
    }
  }, [query.data]);

  const { data, source } = useMemo(
    () => pickSource(query.data, localCache, staleLocal, query.isError),
    [query.data, localCache, staleLocal, query.isError],
  );

  const slides = useMemo(() => {
    const useErrorFallback = query.isError && !data?.items?.length;
    return resolveHeroSlides(data, useErrorFallback);
  }, [data, query.isError]);

  return {
    slides,
    version: data?.version ?? "empty",
    source: query.isFetching && source === "cache" ? "cache" : source,
    isLoading: query.isLoading && !localCache && !staleLocal,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}
