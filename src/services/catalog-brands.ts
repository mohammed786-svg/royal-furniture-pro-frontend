import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { BrandFormValues, BrandItem } from "@/types/brands";
import type { PaginationMeta } from "@/types/catalog";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

type ListResponse = { items: BrandItem[]; pagination: PaginationMeta };

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

export async function fetchBrands(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse>>(
    `/catalog/brands/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchBrand(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: BrandItem }>>(
    `/catalog/brands/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createBrand(payload: Partial<BrandFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: BrandItem }>>(
    "/catalog/brands/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateBrand(id: string, payload: Partial<BrandFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: BrandItem }>>(
    `/catalog/brands/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteBrand(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/catalog/brands/${id}/`);
  assertApiSuccess(data);
}
