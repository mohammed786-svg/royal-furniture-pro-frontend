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
  categorySlug: string,
  subCategorySlug: string,
  underSubCategorySlug?: string,
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
  return {
    data: emptyCategoryListing(categorySlug, subCategorySlug, underSubCategorySlug),
    source: "empty",
  };
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

  useEffect(() => {
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
  }, [categorySlug, subCategorySlug, underSubCategorySlug]);

  const query = useQuery({
    queryKey: queryKeys.categories.listing(
      categorySlug,
      subCategorySlug,
      underSubCategorySlug,
    ),
    queryFn: () => {
      const cachedIds = localCache ?? staleLocal;
      return fetchCategoryListing(categorySlug, subCategorySlug, {
        underSubCategorySlug,
        categoryId: cachedIds?.categoryId,
        subCategoryId: cachedIds?.subCategoryId,
        underSubCategoryId: cachedIds?.underSubCategoryId ?? undefined,
      });
    },
    staleTime: queryCacheConfig.staleTime.catalog,
    gcTime: queryCacheConfig.gcTime.catalog,
    placeholderData: () => localCache ?? staleLocal ?? undefined,
  });

  useEffect(() => {
    if (!query.data?.version) return;
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
  }, [query.data, categorySlug, subCategorySlug, underSubCategorySlug]);

  const { data, source } = useMemo(
    () =>
      pickListing(
        query.data,
        localCache,
        staleLocal,
        categorySlug,
        subCategorySlug,
        underSubCategorySlug,
      ),
    [
      query.data,
      localCache,
      staleLocal,
      categorySlug,
      subCategorySlug,
      underSubCategorySlug,
    ],
  );

  const resolvedData =
    data ?? emptyCategoryListing(categorySlug, subCategorySlug, underSubCategorySlug);

  return {
    data: resolvedData,
    source: query.isFetching && source === "cache" ? "cache" : source,
    isLoading: query.isLoading && !localCache && !staleLocal,
    isFetching: query.isFetching,
    isError: query.isError && !data,
  };
}
