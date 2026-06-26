"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/cache/react-query/keys";
import { queryCacheConfig } from "@/config/cache/react-query.config";
import {
  clearNavbarLocalCache,
  readNavbarLocalCache,
  readNavbarLocalCacheStale,
  writeNavbarLocalCache,
} from "@/lib/cache/navbar-local-cache";
import { buildNavbarLookups, emptyNavbarTree } from "@/lib/navbar/navbar-utils";
import { fetchNavbarTree } from "@/services/storefront-navbar";
import type { NavbarDataSource, NavbarState, NavbarTreeResponse } from "@/types/navbar";

const NAVBAR_EMPTY_MESSAGE = "No categories available";

function readBootstrapCache(): NavbarTreeResponse | null {
  return readNavbarLocalCache() ?? readNavbarLocalCacheStale();
}

function resolveNavbarTree(
  data: NavbarTreeResponse | undefined,
  bootstrap: NavbarTreeResponse | null,
  isSuccess: boolean,
): { tree: NavbarTreeResponse; source: NavbarDataSource } {
  if (data !== undefined) {
    if (isSuccess) {
      return {
        tree: data,
        source: data.items.length > 0 ? "api" : "empty",
      };
    }
    if (data.items.length > 0) {
      return { tree: data, source: "cache" };
    }
  }

  if (bootstrap?.items?.length) {
    return { tree: bootstrap, source: "cache" };
  }

  return { tree: emptyNavbarTree(), source: "empty" };
}

export function useNavbar(): NavbarState {
  const [bootstrap, setBootstrap] = useState<NavbarTreeResponse | null>(null);

  useEffect(() => {
    setBootstrap(readBootstrapCache());
  }, []);

  const query = useQuery({
    queryKey: queryKeys.navbar(),
    queryFn: fetchNavbarTree,
    staleTime: 0,
    gcTime: queryCacheConfig.gcTime.catalog,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (previousData) => {
      if (previousData !== undefined) return previousData;
      const local = readNavbarLocalCache();
      if (local?.items?.length) return local;
      const stale = readNavbarLocalCacheStale();
      if (stale?.items?.length) return stale;
      return undefined;
    },
  });

  useEffect(() => {
    if (!query.isSuccess || query.data === undefined) return;

    if (!query.data.items.length) {
      clearNavbarLocalCache();
      setBootstrap(null);
      return;
    }

    writeNavbarLocalCache(query.data);
    setBootstrap(query.data);
  }, [query.data, query.isSuccess]);

  const { tree, source } = useMemo(
    () => resolveNavbarTree(query.data, bootstrap, query.isSuccess),
    [query.data, bootstrap, query.isSuccess],
  );

  const lookups = useMemo(() => buildNavbarLookups(tree.items), [tree.items]);

  const hasItems = tree.items.length > 0;
  const isEmpty =
    query.isSuccess && query.data !== undefined && query.data.items.length === 0;
  const isLoading = query.isPending && !hasItems;
  const isRefreshing = query.isFetching && hasItems;

  return {
    items: tree.items,
    menusByLabel: lookups.menusByLabel,
    categoryLabels: lookups.categoryLabels,
    labelBySlug: lookups.labelBySlug,
    version: tree.version,
    source: isRefreshing && source === "api" ? "cache" : source,
    isLoading,
    isFetching: query.isFetching,
    isRefreshing,
    isEmpty,
    isError: query.isError,
    emptyMessage: NAVBAR_EMPTY_MESSAGE,
  };
}
