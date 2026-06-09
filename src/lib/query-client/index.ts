import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query";
import { queryCacheConfig } from "@/config/cache/react-query.config";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: queryCacheConfig.staleTime.default,
        gcTime: queryCacheConfig.gcTime.default,
        retry: queryCacheConfig.retry.default,
        refetchOnWindowFocus: queryCacheConfig.refetchOnWindowFocus,
        refetchOnReconnect: queryCacheConfig.refetchOnReconnect,
      },
      mutations: {
        retry: queryCacheConfig.retry.mutation,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
