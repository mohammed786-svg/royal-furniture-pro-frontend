"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/cache/react-query/keys";
import { queryCacheConfig } from "@/config/cache/react-query.config";
import {
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

function pickProduct(
  apiData: StorefrontProductDetailResponse | undefined,
  local: StorefrontProductDetailResponse | null,
  stale: StorefrontProductDetailResponse | null,
): { product: ProductDetailState["product"]; source: ProductDetailDataSource } {
  if (apiData?.slug) {
    return { product: mapProductDetailResponse(apiData), source: "api" };
  }
  if (local?.slug) {
    return { product: mapProductDetailResponse(local), source: "cache" };
  }
  if (stale?.slug) {
    return { product: mapProductDetailResponse(stale), source: "cache" };
  }
  return { product: null, source: "empty" };
}

export function useProductDetail(slug: string): ProductDetailState {
  const [localCache, setLocalCache] = useState<StorefrontProductDetailResponse | null>(
    null,
  );
  const [staleLocal, setStaleLocal] = useState<StorefrontProductDetailResponse | null>(
    null,
  );

  useEffect(() => {
    setLocalCache(readProductDetailCache(slug));
    setStaleLocal(readProductDetailCacheStale(slug));
  }, [slug]);

  const query = useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => fetchStorefrontProduct(slug),
    staleTime: queryCacheConfig.staleTime.catalog,
    gcTime: queryCacheConfig.gcTime.catalog,
    placeholderData: () => localCache ?? staleLocal ?? undefined,
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (!query.data?.version) return;
    const cached = readProductDetailCacheStale(slug);
    if (!cached || cached.version !== query.data.version) {
      writeProductDetailCache(slug, query.data);
      setLocalCache(query.data);
    }
  }, [query.data, slug]);

  const { product, source } = useMemo(
    () => pickProduct(query.data, localCache, staleLocal),
    [query.data, localCache, staleLocal],
  );

  return {
    product,
    source: query.isFetching && source === "cache" ? "cache" : source,
    isLoading: query.isLoading && !localCache && !staleLocal,
    isFetching: query.isFetching,
    isError: query.isError && !product,
  };
}
