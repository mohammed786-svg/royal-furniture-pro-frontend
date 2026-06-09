import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  AdministrationMetaOptions,
  AdminUserFormValues,
  AdminUserItem,
  LoginHistoryItem,
} from "@/types/admin-users";
import type { PaginationMeta } from "@/types/catalog";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

type LoginHistoryListParams = ListParams & {
  userId?: string;
  status?: string;
  loginType?: string;
};

type ListResponse<T> = { items: T[]; pagination: PaginationMeta };

function buildQuery(params: Record<string, string | number | undefined> = {}) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") q.set(key, String(value));
  }
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchAdminUsers(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<AdminUserItem>>>(
    `/administration/users/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchAdminUser(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: AdminUserItem }>>(
    `/administration/users/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createAdminUser(payload: Partial<AdminUserFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: AdminUserItem }>>(
    "/administration/users/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateAdminUser(
  id: string,
  payload: Partial<AdminUserFormValues>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: AdminUserItem }>>(
    `/administration/users/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteAdminUser(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/administration/users/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchLoginHistory(params?: LoginHistoryListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<LoginHistoryItem>>>(
    `/administration/login-history/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchLoginHistoryRecord(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: LoginHistoryItem }>>(
    `/administration/login-history/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function fetchAdministrationMetaOptions() {
  const { data } = await apiClient.get<ApiEnvelope<AdministrationMetaOptions>>(
    "/administration/meta-options/",
  );
  return assertApiSuccess(data);
}
