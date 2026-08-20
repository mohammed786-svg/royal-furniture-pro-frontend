"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/cache/react-query/keys";
import { queryCacheConfig } from "@/config/cache/react-query.config";
import {
  clearProductDetailCache,
  readProductDetailCache,
  readProductDetailCacheStale,
  writeProductDetailCache,
} from "@/lib/cache/product-detail-local-cache";
import { mapProductDetailResponse } from "@/lib/catalog/catalog-utils";
import { fetchStorefrontProduct } from "@/services/storefront-catalog";
import type {
  ProductDetailDataSource,
  ProductDetailState,
  StorefrontProductDetailResponse,
} from "@/types/storefront-catalog";

type CacheMode = "checking" | "cache" | "nocache";

function pickProduct(
  apiData: StorefrontProductDetailResponse | undefined,
  local: StorefrontProductDetailResponse | null,
  stale: StorefrontProductDetailResponse | null,
  preferApiOnly: boolean,
): { product: ProductDetailState["product"]; source: ProductDetailDataSource } {
  if (apiData?.slug) {
    return { product: mapProductDetailResponse(apiData), source: "api" };
  }
  if (preferApiOnly) {
    return { product: null, source: "empty" };
  }
  if (local?.slug) {
    return { product: mapProductDetailResponse(local), source: "cache" };
  }
  if (stale?.slug) {
    return { product: mapProductDetailResponse(stale), source: "cache" };
  }
  return { product: null, source: "empty" };
}

function detectPageReload(): boolean {
  try {
    const nav = performance.getEntriesByType("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload") return true;
    if ((performance as Performance & { navigation?: { type?: number } }).navigation?.type === 1) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function useProductDetail(slug: string): ProductDetailState {
  const [localCache, setLocalCache] = useState<StorefrontProductDetailResponse | null>(
    null,
  );
  const [staleLocal, setStaleLocal] = useState<StorefrontProductDetailResponse | null>(
    null,
  );
  const [cacheMode, setCacheMode] = useState<CacheMode>("checking");

  useEffect(() => {
    const isReload = detectPageReload();
    if (isReload && slug) {
      clearProductDetailCache(slug);
    }
    setCacheMode(isReload ? "nocache" : "cache");
  }, [slug]);

  useEffect(() => {
    if (cacheMode !== "cache" || !slug) return;
    setLocalCache(readProductDetailCache(slug));
    setStaleLocal(readProductDetailCacheStale(slug));
  }, [cacheMode, slug]);

  const query = useQuery({
    queryKey:
      cacheMode === "nocache"
        ? [...queryKeys.products.detail(slug), "nocache"]
        : queryKeys.products.detail(slug),
    queryFn: () => fetchStorefrontProduct(slug, { nocache: cacheMode === "nocache" }),
    staleTime: cacheMode === "nocache" ? 0 : queryCacheConfig.staleTime.catalog,
    gcTime: cacheMode === "nocache" ? 0 : queryCacheConfig.gcTime.catalog,
    placeholderData:
      cacheMode === "nocache" ? undefined : () => localCache ?? staleLocal ?? undefined,
    enabled: Boolean(slug) && cacheMode !== "checking",
  });

  useEffect(() => {
    if (!query.data?.version || cacheMode === "checking") return;
    if (cacheMode === "nocache") {
      // Refresh local cache with the fresh payload after a hard reload.
      writeProductDetailCache(slug, query.data);
      setLocalCache(query.data);
      setStaleLocal(null);
      return;
    }
    const cached = readProductDetailCacheStale(slug);
    if (!cached || cached.version !== query.data.version) {
      writeProductDetailCache(slug, query.data);
      setLocalCache(query.data);
    }
  }, [query.data, slug, cacheMode]);

  const { product, source } = useMemo(
    () => pickProduct(query.data, localCache, staleLocal, cacheMode === "nocache"),
    [query.data, localCache, staleLocal, cacheMode],
  );

  return {
    product,
    source: query.isFetching && source === "cache" ? "cache" : source,
    isLoading:
      cacheMode === "checking" ||
      (query.isLoading && (cacheMode === "nocache" || (!localCache && !staleLocal))),
    isFetching: query.isFetching,
    isError: query.isError && !product,
  };
}
