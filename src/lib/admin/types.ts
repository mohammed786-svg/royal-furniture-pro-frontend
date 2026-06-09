export type AdminRole = "SUPER_ADMIN" | "ADMIN_MANAGER";

export type AdminMenuKey = string;

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: AdminRole;
  roleName: string;
  allowedMenus: AdminMenuKey[];
};

export type AdminMenuItem = {
  key: AdminMenuKey;
  label: string;
  href: string;
  icon: string;
  superAdminOnly?: boolean;
};

export type AdminMenuGroup = {
  id: string;
  label: string;
  items: AdminMenuItem[];
};

export type AdminPageMeta = {
  key: AdminMenuKey;
  title: string;
  description: string;
  section: string;
  href: string;
  superAdminOnly?: boolean;
  breadcrumbs: { label: string; href?: string }[];
};

export type DashboardStat = {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  active: number;
  inactive: number;
  icon: string;
  color: string;
};
