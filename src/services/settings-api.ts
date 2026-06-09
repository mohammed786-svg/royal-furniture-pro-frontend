import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { PaginationMeta } from "@/types/catalog";
import type { SettingFormValues, SettingItem } from "@/types/settings";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  group?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

type ListResponse = { items: SettingItem[]; pagination: PaginationMeta };

function buildQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.group) q.set("group", params.group);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchSettings(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse>>(
    `/settings/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchSettingGroups() {
  const { data } =
    await apiClient.get<ApiEnvelope<{ groups: string[] }>>("/settings/groups/");
  return assertApiSuccess(data).groups;
}

export async function fetchSetting(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: SettingItem }>>(
    `/settings/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createSetting(payload: Partial<SettingFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: SettingItem }>>(
    "/settings/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateSetting(id: string, payload: Partial<SettingFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: SettingItem }>>(
    `/settings/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteSetting(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/settings/${id}/`);
  assertApiSuccess(data);
}
