import { verifyAdminPassword } from "@/lib/admin/credentials";
import { defaultAdminAllowedMenus } from "@/lib/admin/navigation";
import type { AdminUser } from "@/lib/admin/types";

export const DEMO_ADMIN_USERS: Record<string, { password: string; user: AdminUser }> = {
  "superadmin@royalfurniture.com": {
    password: "Royal@2026",
    user: {
      id: "1",
      email: "superadmin@royalfurniture.com",
      fullName: "Mr. Herald",
      phone: "+91 98765 43210",
      avatarUrl: "",
      role: "SUPER_ADMIN",
      roleName: "Super Admin",
      allowedMenus: [],
    },
  },
  "admin@royalfurniture.com": {
    password: "Royal@2026",
    user: {
      id: "2",
      email: "admin@royalfurniture.com",
      fullName: "Sarah Mitchell",
      phone: "+91 98765 12345",
      avatarUrl: "",
      role: "ADMIN_MANAGER",
      roleName: "Admin Manager",
      allowedMenus: defaultAdminAllowedMenus,
    },
  },
};

export function authenticateAdmin(email: string, password: string): AdminUser | null {
  const entry = DEMO_ADMIN_USERS[email.toLowerCase()];
  if (!entry || !verifyAdminPassword(email, password)) return null;
  return entry.user;
}
