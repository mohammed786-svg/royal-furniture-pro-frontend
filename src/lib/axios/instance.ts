import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { getApiErrorMessage, isApiEnvelope } from "@/lib/api/api-error";
import type { EncryptedApiEnvelope } from "@/lib/api/types";
import { getAdminAuthToken } from "@/lib/axios/admin-auth-token";
import { refreshCustomerAuthSession } from "@/lib/axios/customer-auth-refresh";
import {
  getCustomerAuthToken,
  getCustomerRefreshToken,
  hydrateCustomerAuthToken,
  setCustomerAuthToken,
  setCustomerRefreshToken,
} from "@/lib/axios/customer-auth-token";
import {
  decryptPayload,
  encryptPayload,
  isCryptoEnabled,
} from "@/lib/crypto/payload-crypto";
import { env } from "@/lib/env";
import { getGuestSessionId, GUEST_SESSION_HEADER } from "@/lib/guest-session";
import { royalToast } from "@/lib/toast/royal-toast";

export type TokenRefreshHandler = () => Promise<string | null>;

let refreshHandler: TokenRefreshHandler | null = null;
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);

function isStorefrontCommerceRequest(url: string | undefined): boolean {
  return Boolean(url?.includes("/storefront/"));
}

function isAuthLoginRequest(url: string | undefined): boolean {
  return Boolean(
    url?.includes("/auth/admin/login/") || url?.includes("/storefront/auth/"),
  );
}

function isAuthRefreshRequest(url: string | undefined): boolean {
  return Boolean(
    url?.includes("/auth/admin/refresh/") || url?.includes("/storefront/auth/refresh"),
  );
}

function isStorefrontProtectedRequest(url: string | undefined): boolean {
  return Boolean(
    url?.includes("/storefront/orders") ||
    url?.includes("/storefront/wishlist") ||
    url?.includes("/storefront/addresses") ||
    url?.includes("/storefront/checkout") ||
    url?.includes("/storefront/auth/me"),
  );
}

function notifyUnauthorized(error: AxiosError): void {
  royalToast.unauthorized(
    getApiErrorMessage(error, "Unauthorized access. Please sign in again."),
  );
}

export function setTokenRefreshHandler(handler: TokenRefreshHandler) {
  refreshHandler = handler;
}

function processRefreshQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

function isEncryptedEnvelope(data: unknown): data is EncryptedApiEnvelope {
  return (
    data !== null &&
    typeof data === "object" &&
    "payload" in data &&
    typeof (data as EncryptedApiEnvelope).payload === "string"
  );
}

async function decryptResponseData(data: unknown): Promise<unknown> {
  if (!isCryptoEnabled() || !isEncryptedEnvelope(data)) {
    return data;
  }
  return decryptPayload(data.payload);
}

async function handleCustomerTokenRefresh(
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  client: AxiosInstance,
) {
  const refreshToken = getCustomerRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error("Customer session expired"));
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push((token) => {
        if (!token) {
          reject(new Error("Token refresh failed"));
          return;
        }
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(client(originalRequest));
      });
    });
  }

  isRefreshing = true;
  originalRequest._retry = true;

  try {
    const result = await refreshCustomerAuthSession(refreshToken);
    const { useAuthStore } = await import("@/lib/store/auth-store");
    useAuthStore
      .getState()
      .setSession(result.user, result.accessToken, result.refreshToken ?? refreshToken);
    const newToken = result.accessToken;
    setCustomerAuthToken(newToken);
    if (result.refreshToken) {
      setCustomerRefreshToken(result.refreshToken);
    }
    processRefreshQueue(newToken);
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return client(originalRequest);
  } catch (error) {
    processRefreshQueue(null);
    const { useAuthStore } = await import("@/lib/store/auth-store");
    useAuthStore.getState().logout();
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}

async function handleTokenRefresh(
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  client: AxiosInstance,
) {
  if (isStorefrontCommerceRequest(originalRequest.url)) {
    return handleCustomerTokenRefresh(originalRequest, client);
  }

  if (!refreshHandler) {
    return Promise.reject(new Error("Token refresh handler not configured"));
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push((token) => {
        if (!token) {
          reject(new Error("Token refresh failed"));
          return;
        }
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(client(originalRequest));
      });
    });
  }

  isRefreshing = true;
  originalRequest._retry = true;

  try {
    const newToken = await refreshHandler();
    processRefreshQueue(newToken);
    if (!newToken) {
      return Promise.reject(new Error("Token refresh returned empty"));
    }
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return client(originalRequest);
  } catch (error) {
    processRefreshQueue(null);
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}

export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: env.apiUrl || undefined,
    timeout: 30_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      hydrateCustomerAuthToken();
      const url = config.url;
      const customerToken = getCustomerAuthToken();
      const adminToken = getAdminAuthToken();
      const token =
        isStorefrontCommerceRequest(url) && customerToken
          ? customerToken
          : (adminToken ?? customerToken);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (isStorefrontCommerceRequest(url)) {
        const guestSession = getGuestSessionId();
        if (guestSession) {
          config.headers[GUEST_SESSION_HEADER] = guestSession;
        }
      }

      const method = (config.method ?? "get").toLowerCase();
      if (
        isCryptoEnabled() &&
        MUTATING_METHODS.has(method) &&
        config.data &&
        typeof config.data === "object" &&
        !isEncryptedEnvelope(config.data)
      ) {
        config.data = await encryptPayload(config.data);
        config.headers["X-Payload-Encrypted"] = "1";
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    async (response) => {
      response.data = await decryptResponseData(response.data);
      return response;
    },
    async (error: AxiosError) => {
      if (error.response?.data) {
        error.response.data = await decryptResponseData(error.response.data);
        if (isApiEnvelope(error.response.data) && !error.response.data.success) {
          error.message = error.response.data.message;
        }
      }

      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      const requestUrl = originalRequest?.url;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isAuthLoginRequest(requestUrl) &&
        !isAuthRefreshRequest(requestUrl)
      ) {
        return handleTokenRefresh(originalRequest, instance);
      }

      if (error.response?.status === 401 && !isAuthLoginRequest(requestUrl)) {
        hydrateCustomerAuthToken();
        const optionalGuestEndpoint = !isStorefrontProtectedRequest(requestUrl);
        const hasCustomerToken = Boolean(getCustomerAuthToken());
        if (!optionalGuestEndpoint || hasCustomerToken) {
          notifyUnauthorized(error);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

export const apiClient = createAxiosInstance();
