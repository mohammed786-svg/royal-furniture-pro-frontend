export type AdminUserItem = {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  roleId: string;
  roleCode: string;
  roleName: string;
  isActive: boolean;
  lastLoginAt?: string | null;
  loginCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminUserFormValues = {
  email: string;
  fullName: string;
  phone: string;
  roleId: string;
  password: string;
  isActive: boolean;
};

export type AdminRoleOption = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
};

export type LoginHistoryItem = {
  id: string;
  userId?: string | null;
  customerId?: string | null;
  loginType: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceType?: string | null;
  location?: string | null;
  status: string;
  failureReason?: string | null;
  loginAt?: string | null;
  userEmail?: string | null;
  userFullName?: string | null;
  customerEmail?: string | null;
  customerFullName?: string | null;
};

export type AdministrationMetaOptions = {
  roles: AdminRoleOption[];
  loginTypes: string[];
  loginStatuses: string[];
};
