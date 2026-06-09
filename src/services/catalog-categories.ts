import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  CatalogOption,
  CategoryFormValues,
  CategoryItem,
  CategoryLevel,
  PaginationMeta,
  SubCategoryItem,
  SubCategoryOption,
  UnderSubCategoryItem,
} from "@/types/catalog";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  categoryId?: string;
  subCategoryId?: string;
};

type ListResponse<T> = { items: T[]; pagination: PaginationMeta };

const endpoints: Record<CategoryLevel, string> = {
  categories: "/catalog/categories/",
  "sub-categories": "/catalog/sub-categories/",
  "under-sub-categories": "/catalog/under-sub-categories/",
};

function buildQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  if (params.categoryId) q.set("categoryId", params.categoryId);
  if (params.subCategoryId) q.set("subCategoryId", params.subCategoryId);
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchCatalogOptions(categoryId?: string) {
  const params: ListParams = {};
  if (categoryId) params.categoryId = categoryId;
  const { data } = await apiClient.get<
    ApiEnvelope<{ categories: CatalogOption[]; subCategories: SubCategoryOption[] }>
  >(`/catalog/options/${buildQuery(params)}`);
  return assertApiSuccess(data);
}

export async function fetchCategories(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<CategoryItem>>>(
    `/catalog/categories/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchSubCategories(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<SubCategoryItem>>>(
    `/catalog/sub-categories/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchUnderSubCategories(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<UnderSubCategoryItem>>>(
    `/catalog/under-sub-categories/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function createCatalogItem(
  level: CategoryLevel,
  payload: Partial<CategoryFormValues>,
) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: unknown }>>(
    endpoints[level],
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateCatalogItem(
  level: CategoryLevel,
  id: string,
  payload: Partial<CategoryFormValues>,
) {
  const base = endpoints[level];
  const { data } = await apiClient.patch<ApiEnvelope<{ item: unknown }>>(
    `${base}${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteCatalogItem(level: CategoryLevel, id: string) {
  const base = endpoints[level];
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`${base}${id}/`);
  assertApiSuccess(data);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
