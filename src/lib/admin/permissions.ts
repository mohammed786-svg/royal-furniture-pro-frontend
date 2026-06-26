import { adminMenuGroups, getAllMenuKeys } from "@/lib/admin/navigation";
import type { AdminMenuGroup, AdminUser } from "@/lib/admin/types";

const PERMISSIONS_STORAGE_KEY = "royal-admin-menu-permissions";

const ALWAYS_ALLOWED_PREFIXES = ["/my-admin/profile"];

export function isAlwaysAllowedHref(href: string): boolean {
  return ALWAYS_ALLOWED_PREFIXES.some(
    (prefix) => href === prefix || href.startsWith(`${prefix}/`),
  );
}

export function isSuperAdmin(user: AdminUser | null): boolean {
  return user?.role === "SUPER_ADMIN";
}

export function canAccessMenu(user: AdminUser | null, menuKey: string): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return user.allowedMenus.includes(menuKey);
}

function matchesMenuHref(href: string, menuHref: string): boolean {
  return href === menuHref || href.startsWith(`${menuHref}/`);
}

export function canAccessHref(user: AdminUser | null, href: string): boolean {
  if (!user) return false;
  if (isAlwaysAllowedHref(href)) return true;
  for (const group of adminMenuGroups) {
    for (const item of group.items) {
      if (matchesMenuHref(href, item.href)) {
        if (item.superAdminOnly && !isSuperAdmin(user)) return false;
        return canAccessMenu(user, item.key);
      }
    }
  }
  return false;
}

export function getVisibleMenuGroups(user: AdminUser | null): AdminMenuGroup[] {
  if (!user) return [];

  return adminMenuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.superAdminOnly && !isSuperAdmin(user)) return false;
        return canAccessMenu(user, item.key);
      }),
    }))
    .filter((group) => group.items.length > 0);
}

export function getStoredAdminPermissions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setStoredAdminPermissions(keys: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(keys));
}

export function getDefaultPermissionKeys(): string[] {
  const stored = getStoredAdminPermissions();
  if (stored.length > 0) return stored;
  return getAllMenuKeys().filter(
    (key) => !["admin-users", "role-permissions", "login-history"].includes(key),
  );
}
