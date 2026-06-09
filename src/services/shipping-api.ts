import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { PaginationMeta } from "@/types/catalog";
import type {
  ShipmentFormValues,
  ShipmentItem,
  ShipmentTrackingFormValues,
  ShipmentTrackingItem,
} from "@/types/shipping";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  orderId?: string;
  shipmentId?: string;
  deliveryStatus?: string;
};

type ListResponse<T> = { items: T[]; pagination: PaginationMeta };

function buildQuery(params: Record<string, unknown> = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchShipments(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<ShipmentItem>>>(
    `/shipping/shipments/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchShipment(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: ShipmentItem }>>(
    `/shipping/shipments/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createShipment(payload: Partial<ShipmentFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: ShipmentItem }>>(
    "/shipping/shipments/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateShipment(id: string, payload: Partial<ShipmentFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: ShipmentItem }>>(
    `/shipping/shipments/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteShipment(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/shipping/shipments/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchShipmentTracking(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<ShipmentTrackingItem>>>(
    `/shipping/tracking/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchShipmentTrackingEntry(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: ShipmentTrackingItem }>>(
    `/shipping/tracking/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createShipmentTracking(
  payload: Partial<ShipmentTrackingFormValues>,
) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: ShipmentTrackingItem }>>(
    "/shipping/tracking/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateShipmentTracking(
  id: string,
  payload: Partial<ShipmentTrackingFormValues>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: ShipmentTrackingItem }>>(
    `/shipping/tracking/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteShipmentTracking(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/shipping/tracking/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchShippingMetaOptions() {
  const { data } = await apiClient.get<
    ApiEnvelope<{
      orders: { id: string; orderNumber: string; customerName: string }[];
      shipments: {
        id: string;
        orderId: string;
        orderNumber: string;
        awbNumber?: string | null;
      }[];
      pickupStatuses: string[];
      deliveryStatuses: string[];
      trackingSources: string[];
    }>
  >("/shipping/meta-options/");
  return assertApiSuccess(data);
}
