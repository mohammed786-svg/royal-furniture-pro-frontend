import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { PaginationMeta } from "@/types/catalog";
import type { TagFormValues, TagItem } from "@/types/tags";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

type ListResponse = { items: TagItem[]; pagination: PaginationMeta };

function buildQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchTags(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse>>(
    `/catalog/tags/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchTag(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: TagItem }>>(
    `/catalog/tags/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createTag(payload: Partial<TagFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: TagItem }>>(
    "/catalog/tags/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateTag(id: string, payload: Partial<TagFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: TagItem }>>(
    `/catalog/tags/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteTag(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/catalog/tags/${id}/`);
  assertApiSuccess(data);
}
