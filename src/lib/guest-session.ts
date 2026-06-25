const STORAGE_KEY = "royal-guest-session";

export function getGuestSessionId(): string {
  if (typeof window === "undefined") return "";
  let session = localStorage.getItem(STORAGE_KEY);
  if (!session) {
    session =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEY, session);
  }
  return session;
}

export const GUEST_SESSION_HEADER = "X-Guest-Session";
