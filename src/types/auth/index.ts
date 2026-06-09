import type { ID } from "@/types/common";

export type UserRole = "SUPER_ADMIN" | "ADMIN_MANAGER" | "CUSTOMER";

export type AuthUser = {
  userId: ID;
  email: string;
  role: UserRole;
};
