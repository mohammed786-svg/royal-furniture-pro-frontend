let adminAccessToken: string | null = null;

export function setAdminAuthToken(token: string | null) {
  adminAccessToken = token;
}

export function getAdminAuthToken(): string | null {
  return adminAccessToken;
}
