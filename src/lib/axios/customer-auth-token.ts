let customerAccessToken: string | null = null;
let customerRefreshToken: string | null = null;

const ACCESS_STORAGE_KEY = "royal-customer-access-token";
const REFRESH_STORAGE_KEY = "royal-customer-refresh-token";

export function setCustomerAuthToken(token: string | null) {
  customerAccessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(ACCESS_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_STORAGE_KEY);
    }
  }
}

export function setCustomerRefreshToken(token: string | null) {
  customerRefreshToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(REFRESH_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_STORAGE_KEY);
    }
  }
}

export function getCustomerAuthToken(): string | null {
  if (customerAccessToken) return customerAccessToken;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(ACCESS_STORAGE_KEY);
    if (stored) customerAccessToken = stored;
  }
  return customerAccessToken;
}

export function getCustomerRefreshToken(): string | null {
  if (customerRefreshToken) return customerRefreshToken;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(REFRESH_STORAGE_KEY);
    if (stored) customerRefreshToken = stored;
  }
  return customerRefreshToken;
}

export function hydrateCustomerAuthToken() {
  if (typeof window === "undefined") return;
  if (!customerAccessToken) {
    customerAccessToken = localStorage.getItem(ACCESS_STORAGE_KEY);
  }
  if (!customerRefreshToken) {
    customerRefreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
  }
}

export function clearCustomerAuthTokens() {
  customerAccessToken = null;
  customerRefreshToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_STORAGE_KEY);
    localStorage.removeItem(REFRESH_STORAGE_KEY);
  }
}
