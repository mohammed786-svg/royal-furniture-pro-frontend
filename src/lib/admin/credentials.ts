import { DEMO_ADMIN_USERS } from "@/lib/admin/demo-users";

const PASSWORDS_STORAGE_KEY = "royal-admin-passwords";

function getStoredPasswords(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function getAdminPassword(email: string): string {
  const key = email.toLowerCase();
  const stored = getStoredPasswords();
  if (stored[key]) return stored[key];
  return DEMO_ADMIN_USERS[key]?.password ?? "";
}

export function setAdminPassword(email: string, password: string): void {
  if (typeof window === "undefined") return;
  const key = email.toLowerCase();
  const stored = getStoredPasswords();
  stored[key] = password;
  localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(stored));
}

export function verifyAdminPassword(email: string, password: string): boolean {
  return getAdminPassword(email) === password;
}
