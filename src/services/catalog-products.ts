import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  CatalogOption,
  SubCategoryOption,
  UnderSubCategoryOption,
} from "@/types/catalog";
import type {
  BrandOption,
  ProductDetail,
  ProductFormValues,
  ProductListResponse,
} from "@/types/product";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  categoryId?: string;
  subCategoryId?: string;
  underSubCategoryId?: string;
  brandId?: string;
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
  if (params.underSubCategoryId) q.set("underSubCategoryId", params.underSubCategoryId);
  if (params.brandId) q.set("brandId", params.brandId);
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchProductOptions() {
  const { data } = await apiClient.get<
    ApiEnvelope<{
      brands: BrandOption[];
      categories: CatalogOption[];
      subCategories: SubCategoryOption[];
      underSubCategories: UnderSubCategoryOption[];
    }>
  >("/catalog/product-options/");
  return assertApiSuccess(data);
}

export async function fetchProducts(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ProductListResponse>>(
    `/catalog/products/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchProduct(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: ProductDetail }>>(
    `/catalog/products/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createProduct(payload: Partial<ProductFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: ProductDetail }>>(
    "/catalog/products/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateProduct(id: string, payload: Partial<ProductFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: ProductDetail }>>(
    `/catalog/products/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteProduct(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/catalog/products/${id}/`,
  );
  assertApiSuccess(data);
}

export { fileToDataUrl } from "@/services/catalog-categories";
