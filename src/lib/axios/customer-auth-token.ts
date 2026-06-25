let customerAccessToken: string | null = null;

const STORAGE_KEY = "royal-customer-access-token";

export function setCustomerAuthToken(token: string | null) {
  customerAccessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export function getCustomerAuthToken(): string | null {
  if (customerAccessToken) return customerAccessToken;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) customerAccessToken = stored;
  }
  return customerAccessToken;
}

export function hydrateCustomerAuthToken() {
  if (typeof window !== "undefined" && !customerAccessToken) {
    customerAccessToken = localStorage.getItem(STORAGE_KEY);
  }
}
