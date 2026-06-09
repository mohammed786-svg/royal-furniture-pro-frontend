/**
 * TanStack Query cache strategy — tune per domain when implementing APIs.
 */
export const queryCacheConfig = {
  staleTime: {
    default: 60 * 1000,
    static: 24 * 60 * 60 * 1000,
    catalog: 5 * 60 * 1000,
    inventory: 30 * 1000,
    cart: 2 * 60 * 1000,
    user: 10 * 60 * 1000,
    dashboard: 60 * 1000,
  },
  gcTime: {
    default: 5 * 60 * 1000,
    static: 7 * 24 * 60 * 60 * 1000,
    catalog: 30 * 60 * 1000,
    session: 24 * 60 * 60 * 1000,
  },
  retry: {
    default: 2,
    mutation: 0,
    critical: 3,
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
} as const;
