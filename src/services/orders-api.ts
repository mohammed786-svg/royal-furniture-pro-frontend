import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  OrderCreateFormValues,
  OrderDetail,
  OrderInvoice,
  OrderListItem,
  OrderOptions,
  OrdersListResponse,
  OrderStatusFormValues,
  OrderStatusItem,
  OrderTracking,
  ReturnFormValues,
  TrackingFormValues,
} from "@/types/orders";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  customerId?: string;
  orderId?: string;
  statusCode?: string;
  currentStatus?: string;
};

function buildQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  if (params.customerId) q.set("customerId", params.customerId);
  if (params.orderId) q.set("orderId", params.orderId);
  if (params.statusCode) q.set("statusCode", params.statusCode);
  if (params.currentStatus) q.set("currentStatus", params.currentStatus);
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchOrderOptions() {
  const { data } = await apiClient.get<ApiEnvelope<OrderOptions>>("/orders/options/");
  return assertApiSuccess(data);
}

export async function fetchOrders(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<OrdersListResponse<OrderListItem>>>(
    `/orders/orders/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchOrder(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: OrderDetail }>>(
    `/orders/orders/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createOrder(payload: Partial<OrderCreateFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: OrderDetail }>>(
    "/orders/orders/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateOrder(id: string, payload: Record<string, unknown>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: OrderDetail }>>(
    `/orders/orders/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function fetchOrderInvoice(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ invoice: OrderInvoice }>>(
    `/orders/orders/${id}/invoice/`,
  );
  return assertApiSuccess(data).invoice;
}

export async function fetchOrderStatuses(params?: ListParams) {
  const { data } = await apiClient.get<
    ApiEnvelope<OrdersListResponse<OrderStatusItem>>
  >(`/orders/status/${buildQuery(params)}`);
  return assertApiSuccess(data);
}

export async function fetchOrderStatus(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: OrderStatusItem }>>(
    `/orders/status/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createOrderStatus(payload: OrderStatusFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: OrderStatusItem }>>(
    "/orders/status/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateOrderStatus(
  id: string,
  payload: Partial<OrderStatusFormValues>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: OrderStatusItem }>>(
    `/orders/status/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteOrderStatus(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/orders/status/${id}/`);
  assertApiSuccess(data);
}

export async function fetchTracking(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<OrdersListResponse<OrderTracking>>>(
    `/orders/tracking/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function addTracking(payload: TrackingFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: OrderTracking }>>(
    "/orders/tracking/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function fetchReturns(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<OrdersListResponse<OrderListItem>>>(
    `/orders/returns/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function initiateReturn(payload: ReturnFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: OrderDetail }>>(
    "/orders/returns/",
    { ...payload, changeReason: payload.reason },
  );
  return assertApiSuccess(data).item;
}
