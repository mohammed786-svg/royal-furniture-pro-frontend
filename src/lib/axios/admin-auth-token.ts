let adminAccessToken: string | null = null;
let adminRefreshToken: string | null = null;

const ACCESS_STORAGE_KEY = "royal-admin-access-token";
const REFRESH_STORAGE_KEY = "royal-admin-refresh-token";

export function setAdminAuthToken(token: string | null) {
  adminAccessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      sessionStorage.setItem(ACCESS_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(ACCESS_STORAGE_KEY);
    }
  }
}

export function setAdminRefreshToken(token: string | null) {
  adminRefreshToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      sessionStorage.setItem(REFRESH_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(REFRESH_STORAGE_KEY);
    }
  }
}

export function getAdminAuthToken(): string | null {
  if (adminAccessToken) return adminAccessToken;
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(ACCESS_STORAGE_KEY);
    if (stored) adminAccessToken = stored;
  }
  return adminAccessToken;
}

export function getAdminRefreshToken(): string | null {
  if (adminRefreshToken) return adminRefreshToken;
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(REFRESH_STORAGE_KEY);
    if (stored) adminRefreshToken = stored;
  }
  return adminRefreshToken;
}

export function hydrateAdminAuthTokens() {
  if (typeof window === "undefined") return;
  if (!adminAccessToken) {
    adminAccessToken = sessionStorage.getItem(ACCESS_STORAGE_KEY);
  }
  if (!adminRefreshToken) {
    adminRefreshToken = sessionStorage.getItem(REFRESH_STORAGE_KEY);
  }
}

export function clearAdminAuthTokens() {
  adminAccessToken = null;
  adminRefreshToken = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(ACCESS_STORAGE_KEY);
    sessionStorage.removeItem(REFRESH_STORAGE_KEY);
  }
}
