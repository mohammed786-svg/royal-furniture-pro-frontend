"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/cache/react-query/keys";
import { queryCacheConfig } from "@/config/cache/react-query.config";
import {
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

function pickListing(
  apiData: StorefrontCategoryListingResponse | undefined,
  local: StorefrontCategoryListingResponse | null,
  stale: StorefrontCategoryListingResponse | null,
): { data: CategoryListingState["data"]; source: CatalogListingDataSource } {
  if (apiData) {
    return { data: mapCategoryListingResponse(apiData), source: "api" };
  }
  if (local?.products) {
    return { data: mapCategoryListingResponse(local), source: "cache" };
  }
  if (stale?.products) {
    return { data: mapCategoryListingResponse(stale), source: "cache" };
  }
  return { data: emptyCategoryListing(), source: "empty" };
}

export function useCategoryListing(
  categorySlug: string,
  subCategorySlug: string,
): CategoryListingState {
  const [localCache, setLocalCache] =
    useState<StorefrontCategoryListingResponse | null>(null);
  const [staleLocal, setStaleLocal] =
    useState<StorefrontCategoryListingResponse | null>(null);

  useEffect(() => {
    setLocalCache(readCategoryListingCache(categorySlug, subCategorySlug));
    setStaleLocal(readCategoryListingCacheStale(categorySlug, subCategorySlug));
  }, [categorySlug, subCategorySlug]);

  const query = useQuery({
    queryKey: queryKeys.categories.listing(categorySlug, subCategorySlug),
    queryFn: () => fetchCategoryListing(categorySlug, subCategorySlug),
    staleTime: queryCacheConfig.staleTime.catalog,
    gcTime: queryCacheConfig.gcTime.catalog,
    placeholderData: () => localCache ?? staleLocal ?? undefined,
  });

  useEffect(() => {
    if (!query.data?.version) return;
    const cached = readCategoryListingCacheStale(categorySlug, subCategorySlug);
    if (!cached || cached.version !== query.data.version) {
      writeCategoryListingCache(categorySlug, subCategorySlug, query.data);
      setLocalCache(query.data);
    }
  }, [query.data, categorySlug, subCategorySlug]);

  const { data, source } = useMemo(
    () => pickListing(query.data, localCache, staleLocal),
    [query.data, localCache, staleLocal],
  );

  const resolvedData = data ?? emptyCategoryListing(categorySlug, subCategorySlug);

  return {
    data: resolvedData,
    source: query.isFetching && source === "cache" ? "cache" : source,
    isLoading: query.isLoading && !localCache && !staleLocal,
    isFetching: query.isFetching,
    isError: query.isError && !data,
  };
}
