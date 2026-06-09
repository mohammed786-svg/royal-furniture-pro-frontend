import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  AnalyticsPeriod,
  PageViewDashboard,
  PageViewFormValues,
  PageViewItem,
  PageViewListResponse,
  SalesDashboard,
  SearchDashboard,
  SearchHistoryFormValues,
  SearchHistoryItem,
  SearchListResponse,
} from "@/types/analytics";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  customerId?: string;
  productId?: string;
};

function buildQuery(params: Record<string, unknown> = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchSalesDashboard(period: AnalyticsPeriod = "30d") {
  const { data } = await apiClient.get<ApiEnvelope<SalesDashboard>>(
    `/analytics/sales/${buildQuery({ period })}`,
  );
  return assertApiSuccess(data);
}

export async function fetchPageViewDashboard(period: AnalyticsPeriod = "30d") {
  const { data } = await apiClient.get<ApiEnvelope<PageViewDashboard>>(
    `/analytics/page-views/dashboard/${buildQuery({ period })}`,
  );
  return assertApiSuccess(data);
}

export async function fetchPageViews(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<PageViewListResponse>>(
    `/analytics/page-views/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchPageView(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: PageViewItem }>>(
    `/analytics/page-views/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createPageView(payload: Partial<PageViewFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: PageViewItem }>>(
    "/analytics/page-views/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updatePageView(id: string, payload: Partial<PageViewFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: PageViewItem }>>(
    `/analytics/page-views/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deletePageView(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/analytics/page-views/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchSearchDashboard(period: AnalyticsPeriod = "30d") {
  const { data } = await apiClient.get<ApiEnvelope<SearchDashboard>>(
    `/analytics/search/dashboard/${buildQuery({ period })}`,
  );
  return assertApiSuccess(data);
}

export async function fetchSearches(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<SearchListResponse>>(
    `/analytics/search/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchSearch(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: SearchHistoryItem }>>(
    `/analytics/search/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createSearch(payload: Partial<SearchHistoryFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: SearchHistoryItem }>>(
    "/analytics/search/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateSearch(
  id: string,
  payload: Partial<SearchHistoryFormValues>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: SearchHistoryItem }>>(
    `/analytics/search/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteSearch(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/analytics/search/${id}/`,
  );
  assertApiSuccess(data);
}
