import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { PaginationMeta } from "@/types/catalog";
import type { ReviewFormValues, ReviewItem, ReviewStatus } from "@/types/reviews";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  productId?: string;
  isApproved?: boolean;
};

type ListResponse = { items: ReviewItem[]; pagination: PaginationMeta };

function buildQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  if (params.productId) q.set("productId", params.productId);
  if (params.isApproved !== undefined) q.set("isApproved", String(params.isApproved));
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchReviews(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse>>(
    `/catalog/reviews/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchReview(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: ReviewItem }>>(
    `/catalog/reviews/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createReview(payload: Partial<ReviewFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: ReviewItem }>>(
    "/catalog/reviews/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateReview(id: string, payload: Partial<ReviewFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: ReviewItem }>>(
    `/catalog/reviews/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: ReviewItem }>>(
    `/catalog/reviews/${id}/`,
    { status },
  );
  return assertApiSuccess(data).item;
}

export async function deleteReview(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/catalog/reviews/${id}/`);
  assertApiSuccess(data);
}
