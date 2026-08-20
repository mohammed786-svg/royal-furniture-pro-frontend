"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/cache/react-query/keys";
import { queryCacheConfig } from "@/config/cache/react-query.config";
import {
  clearCategoryListingCache,
  readCategoryListingCache,
  readCategoryListingCacheStale,
  writeCategoryListingCache,
} from "@/lib/cache/category-listing-local-cache";
import {
  emptyCategoryListing,
  mapCategoryListingResponse,
} from "@/lib/catalog/catalog-utils";
import { fetchCategoryListing } from "@/services/storefront-catalog";
import type {
  CatalogListingDataSource,
  CategoryListingState,
  StorefrontCategoryListingResponse,
} from "@/types/storefront-catalog";

type CacheMode = "checking" | "cache" | "nocache";

function pickListing(
  apiData: StorefrontCategoryListingResponse | undefined,
  local: StorefrontCategoryListingResponse | null,
  stale: StorefrontCategoryListingResponse | null,
  categorySlug: string,
  subCategorySlug: string,
  underSubCategorySlug: string | undefined,
  preferApiOnly: boolean,
): { data: CategoryListingState["data"]; source: CatalogListingDataSource } {
  if (apiData) {
    return { data: mapCategoryListingResponse(apiData), source: "api" };
  }
  if (preferApiOnly) {
    return {
      data: emptyCategoryListing(categorySlug, subCategorySlug, underSubCategorySlug),
      source: "empty",
    };
  }
  if (local?.products) {
    return { data: mapCategoryListingResponse(local), source: "cache" };
  }
  if (stale?.products) {
    return { data: mapCategoryListingResponse(stale), source: "cache" };
  }
  return {
    data: emptyCategoryListing(categorySlug, subCategorySlug, underSubCategorySlug),
    source: "empty",
  };
}

function detectPageReload(): boolean {
  try {
    const nav = performance.getEntriesByType("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload") return true;
    if (
      (performance as Performance & { navigation?: { type?: number } }).navigation
        ?.type === 1
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function useCategoryListing(
  categorySlug: string,
  subCategorySlug: string,
  underSubCategorySlug?: string,
): CategoryListingState {
  const [localCache, setLocalCache] =
    useState<StorefrontCategoryListingResponse | null>(null);
  const [staleLocal, setStaleLocal] =
    useState<StorefrontCategoryListingResponse | null>(null);
  const [cacheMode, setCacheMode] = useState<CacheMode>("checking");

  useEffect(() => {
    const isReload = detectPageReload();
    if (isReload) {
      clearCategoryListingCache(categorySlug, subCategorySlug, underSubCategorySlug);
    }
    setCacheMode(isReload ? "nocache" : "cache");
  }, [categorySlug, subCategorySlug, underSubCategorySlug]);

  useEffect(() => {
    if (cacheMode !== "cache") return;
    setLocalCache(
      readCategoryListingCache(categorySlug, subCategorySlug, underSubCategorySlug),
    );
    setStaleLocal(
      readCategoryListingCacheStale(
        categorySlug,
        subCategorySlug,
        underSubCategorySlug,
      ),
    );
  }, [cacheMode, categorySlug, subCategorySlug, underSubCategorySlug]);

  const query = useQuery({
    queryKey:
      cacheMode === "nocache"
        ? [
            ...queryKeys.categories.listing(
              categorySlug,
              subCategorySlug,
              underSubCategorySlug,
            ),
            "nocache",
          ]
        : queryKeys.categories.listing(
            categorySlug,
            subCategorySlug,
            underSubCategorySlug,
          ),
    queryFn: () =>
      fetchCategoryListing(categorySlug, subCategorySlug, {
        underSubCategorySlug,
        // Always resolve by slug so parent PLP is not served from a stale id-cache entry.
        nocache: cacheMode === "nocache",
      }),
    staleTime: cacheMode === "nocache" ? 0 : queryCacheConfig.staleTime.catalog,
    gcTime: cacheMode === "nocache" ? 0 : queryCacheConfig.gcTime.catalog,
    placeholderData:
      cacheMode === "nocache" ? undefined : () => localCache ?? staleLocal ?? undefined,
    enabled: Boolean(categorySlug && subCategorySlug) && cacheMode !== "checking",
  });

  useEffect(() => {
    if (!query.data?.version || cacheMode === "checking") return;
    if (cacheMode === "nocache") {
      writeCategoryListingCache(
        categorySlug,
        subCategorySlug,
        query.data,
        underSubCategorySlug,
      );
      setLocalCache(query.data);
      setStaleLocal(null);
      return;
    }
    const cached = readCategoryListingCacheStale(
      categorySlug,
      subCategorySlug,
      underSubCategorySlug,
    );
    if (!cached || cached.version !== query.data.version) {
      writeCategoryListingCache(
        categorySlug,
        subCategorySlug,
        query.data,
        underSubCategorySlug,
      );
      setLocalCache(query.data);
    }
  }, [query.data, categorySlug, subCategorySlug, underSubCategorySlug, cacheMode]);

  const { data, source } = useMemo(
    () =>
      pickListing(
        query.data,
        localCache,
        staleLocal,
        categorySlug,
        subCategorySlug,
        underSubCategorySlug,
        cacheMode === "nocache",
      ),
    [
      query.data,
      localCache,
      staleLocal,
      categorySlug,
      subCategorySlug,
      underSubCategorySlug,
      cacheMode,
    ],
  );

  const resolvedData =
    data ?? emptyCategoryListing(categorySlug, subCategorySlug, underSubCategorySlug);

  return {
    data: resolvedData,
    source: query.isFetching && source === "cache" ? "cache" : source,
    isLoading:
      cacheMode === "checking" ||
      (query.isLoading && (cacheMode === "nocache" || (!localCache && !staleLocal))),
    isFetching: query.isFetching,
    isError: query.isError && !data,
  };
}
