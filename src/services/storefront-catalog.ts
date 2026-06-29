import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  StorefrontCategoryListingResponse,
  StorefrontProductDetailResponse,
} from "@/types/storefront-catalog";

export async function fetchCategoryListing(
  categorySlug: string,
  subCategorySlug: string,
  params?: {
    page?: number;
    pageSize?: number;
    sort?: string;
    underSubCategorySlug?: string;
    categoryId?: string;
    subCategoryId?: string;
    underSubCategoryId?: string;
  },
): Promise<StorefrontCategoryListingResponse> {
  const under = params?.underSubCategorySlug;
  const path = under
    ? `/storefront/catalog/${categorySlug}/${subCategorySlug}/${under}/`
    : `/storefront/catalog/${categorySlug}/${subCategorySlug}/`;

  const query: Record<string, string | number | undefined> = {
    page: params?.page,
    pageSize: params?.pageSize,
    sort: params?.sort,
    categoryId: params?.categoryId,
    subCategoryId: params?.subCategoryId,
    underSubCategoryId: params?.underSubCategoryId,
  };

  const { data } = await apiClient.get<ApiEnvelope<StorefrontCategoryListingResponse>>(
    path,
    {
      params: query,
    },
  );
  return assertApiSuccess(data);
}

export async function fetchStorefrontProduct(
  slug: string,
): Promise<StorefrontProductDetailResponse> {
  const { data } = await apiClient.get<ApiEnvelope<StorefrontProductDetailResponse>>(
    `/storefront/products/${slug}/`,
  );
  return assertApiSuccess(data);
}
