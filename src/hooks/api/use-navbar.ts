"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/cache/react-query/keys";
import { queryCacheConfig } from "@/config/cache/react-query.config";
import {
  readNavbarLocalCache,
  readNavbarLocalCacheStale,
  writeNavbarLocalCache,
} from "@/lib/cache/navbar-local-cache";
import { buildNavbarLookups, staticNavbarFallback } from "@/lib/navbar/navbar-utils";
import { fetchNavbarTree } from "@/services/storefront-navbar";
import type { NavbarDataSource, NavbarState, NavbarTreeResponse } from "@/types/navbar";

function pickTree(
  apiTree: NavbarTreeResponse | undefined,
  localTree: NavbarTreeResponse | null,
  staleLocal: NavbarTreeResponse | null,
): { tree: NavbarTreeResponse; source: NavbarDataSource } {
  if (apiTree?.items?.length) {
    return { tree: apiTree, source: "api" };
  }
  if (localTree?.items?.length) {
    return { tree: localTree, source: "cache" };
  }
  if (staleLocal?.items?.length) {
    return { tree: staleLocal, source: "cache" };
  }
  return { tree: staticNavbarFallback(), source: "static" };
}

export function useNavbar(): NavbarState {
  const [localTree, setLocalTree] = useState<NavbarTreeResponse | null>(null);
  const [staleLocal, setStaleLocal] = useState<NavbarTreeResponse | null>(null);

  useEffect(() => {
    setLocalTree(readNavbarLocalCache());
    setStaleLocal(readNavbarLocalCacheStale());
  }, []);

  const query = useQuery({
    queryKey: queryKeys.navbar(),
    queryFn: fetchNavbarTree,
    staleTime: queryCacheConfig.staleTime.catalog,
    gcTime: queryCacheConfig.gcTime.catalog,
    placeholderData: () => localTree ?? staleLocal ?? undefined,
  });

  useEffect(() => {
    if (!query.data?.items?.length) return;
    const cached = readNavbarLocalCacheStale();
    if (!cached || cached.version !== query.data.version) {
      writeNavbarLocalCache(query.data);
      setLocalTree(query.data);
    }
  }, [query.data]);

  const { tree, source } = useMemo(
    () => pickTree(query.data, localTree, staleLocal),
    [query.data, localTree, staleLocal],
  );

  const lookups = useMemo(() => buildNavbarLookups(tree.items), [tree.items]);

  return {
    items: tree.items,
    menusByLabel: lookups.menusByLabel,
    categoryLabels: lookups.categoryLabels,
    labelBySlug: lookups.labelBySlug,
    version: tree.version,
    source: query.isFetching && source === "cache" ? "cache" : source,
    isLoading: query.isLoading && !localTree && !staleLocal,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}
