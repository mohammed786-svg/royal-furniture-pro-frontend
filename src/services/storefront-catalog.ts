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
  params?: { page?: number; pageSize?: number; sort?: string },
): Promise<StorefrontCategoryListingResponse> {
  const { data } = await apiClient.get<ApiEnvelope<StorefrontCategoryListingResponse>>(
    `/storefront/catalog/${categorySlug}/${subCategorySlug}/`,
    { params },
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
