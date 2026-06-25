import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { CatalogOption, PaginationMeta } from "@/types/catalog";
import type { CatalogProductOption } from "@/types/catalog-meta";
import type {
  BannerFormValues,
  BannerItem,
  BannerPosition,
  CmsPageFormValues,
  CmsPageItem,
  CouponFormValues,
  CouponItem,
  FaqFormValues,
  FaqItem,
  TestimonialFormValues,
  TestimonialItem,
} from "@/types/marketing";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  isActive?: boolean;
  positionId?: string;
};

type ListResponse<T> = { items: T[]; pagination: PaginationMeta };

function normalizeBanner(item: BannerItem & { positionId?: string }): BannerItem {
  return {
    ...item,
    bannerPositionId: item.bannerPositionId || item.positionId || "",
  };
}

function toBannerPayload(payload: Partial<BannerFormValues>) {
  const { bannerPositionId, ...rest } = payload;
  return {
    ...rest,
    positionId: bannerPositionId,
  };
}

function buildQuery(params: Record<string, unknown> = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const query = q.toString();
  return query ? `?${query}` : "";
}

// Coupons
export async function fetchCoupons(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<CouponItem>>>(
    `/marketing/coupons/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchCoupon(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: CouponItem }>>(
    `/marketing/coupons/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createCoupon(payload: Partial<CouponFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: CouponItem }>>(
    "/marketing/coupons/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateCoupon(id: string, payload: Partial<CouponFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: CouponItem }>>(
    `/marketing/coupons/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteCoupon(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/marketing/coupons/${id}/`,
  );
  assertApiSuccess(data);
}

// Banners
export async function fetchBanners(params?: ListParams) {
  const { data } = await apiClient.get<
    ApiEnvelope<ListResponse<BannerItem & { positionId?: string }>>
  >(`/marketing/banners/${buildQuery(params ?? {})}`);
  const result = assertApiSuccess(data);
  return {
    ...result,
    items: result.items.map(normalizeBanner),
  };
}

export async function fetchBanner(id: string) {
  const { data } = await apiClient.get<
    ApiEnvelope<{ item: BannerItem & { positionId?: string } }>
  >(`/marketing/banners/${id}/`);
  return normalizeBanner(assertApiSuccess(data).item);
}

export async function createBanner(payload: Partial<BannerFormValues>) {
  const { data } = await apiClient.post<
    ApiEnvelope<{ item: BannerItem & { positionId?: string } }>
  >("/marketing/banners/", toBannerPayload(payload));
  return normalizeBanner(assertApiSuccess(data).item);
}

export async function updateBanner(id: string, payload: Partial<BannerFormValues>) {
  const { data } = await apiClient.patch<
    ApiEnvelope<{ item: BannerItem & { positionId?: string } }>
  >(`/marketing/banners/${id}/`, toBannerPayload(payload));
  return normalizeBanner(assertApiSuccess(data).item);
}

export async function deleteBanner(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/marketing/banners/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchBannerPositions() {
  const { data } = await apiClient.get<ApiEnvelope<{ items: BannerPosition[] }>>(
    "/marketing/banner-positions/",
  );
  return assertApiSuccess(data).items;
}

// CMS Pages
export async function fetchCmsPages(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<CmsPageItem>>>(
    `/marketing/cms-pages/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchCmsPage(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: CmsPageItem }>>(
    `/marketing/cms-pages/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createCmsPage(payload: Partial<CmsPageFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: CmsPageItem }>>(
    "/marketing/cms-pages/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateCmsPage(id: string, payload: Partial<CmsPageFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: CmsPageItem }>>(
    `/marketing/cms-pages/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteCmsPage(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/marketing/cms-pages/${id}/`,
  );
  assertApiSuccess(data);
}

// Testimonials
export async function fetchTestimonials(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<TestimonialItem>>>(
    `/marketing/testimonials/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchTestimonial(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: TestimonialItem }>>(
    `/marketing/testimonials/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createTestimonial(payload: Partial<TestimonialFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: TestimonialItem }>>(
    "/marketing/testimonials/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateTestimonial(
  id: string,
  payload: Partial<TestimonialFormValues>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: TestimonialItem }>>(
    `/marketing/testimonials/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteTestimonial(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/marketing/testimonials/${id}/`,
  );
  assertApiSuccess(data);
}

// FAQs
export async function fetchFaqs(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<FaqItem>>>(
    `/marketing/faqs/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchFaq(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: FaqItem }>>(
    `/marketing/faqs/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createFaq(payload: Partial<FaqFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: FaqItem }>>(
    "/marketing/faqs/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateFaq(id: string, payload: Partial<FaqFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: FaqItem }>>(
    `/marketing/faqs/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteFaq(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/marketing/faqs/${id}/`);
  assertApiSuccess(data);
}

// Meta options
export async function fetchMarketingMetaOptions() {
  const { data } = await apiClient.get<
    ApiEnvelope<{
      bannerPositions: BannerPosition[];
      categories: CatalogOption[];
      products: CatalogProductOption[];
    }>
  >("/marketing/meta-options/");
  return assertApiSuccess(data);
}
