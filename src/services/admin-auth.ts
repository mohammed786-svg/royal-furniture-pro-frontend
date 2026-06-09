import type { AdminUser } from "@/lib/admin/types";
import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";

export type AdminLoginResponse = {
  user: AdminUser;
  accessToken: string;
  expiresInHours: number;
};

export async function adminLogin(
  email: string,
  password: string,
  remember = false,
): Promise<AdminLoginResponse> {
  const { data } = await apiClient.post<ApiEnvelope<AdminLoginResponse>>(
    "/auth/admin/login/",
    { email, password, remember },
  );
  return assertApiSuccess(data);
}

export async function adminLogout(): Promise<void> {
  const { data } = await apiClient.post<ApiEnvelope<null>>("/auth/admin/logout/");
  assertApiSuccess(data);
}

export async function adminRefresh(): Promise<AdminLoginResponse> {
  const { data } =
    await apiClient.post<ApiEnvelope<AdminLoginResponse>>("/auth/admin/refresh/");
  return assertApiSuccess(data);
}

export async function adminMe(): Promise<AdminUser> {
  const { data } =
    await apiClient.get<ApiEnvelope<{ user: AdminUser }>>("/auth/admin/me/");
  const payload = assertApiSuccess(data);
  return payload.user;
}

export async function adminUpdateProfile(payload: {
  fullName: string;
  phone?: string;
}): Promise<AdminUser> {
  const { data } = await apiClient.patch<ApiEnvelope<{ user: AdminUser }>>(
    "/auth/admin/profile/",
    payload,
  );
  const result = assertApiSuccess(data);
  return result.user;
}

export async function adminChangePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const { data } = await apiClient.post<ApiEnvelope<null>>(
    "/auth/admin/change-password/",
    {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    },
  );
  assertApiSuccess(data);
}
