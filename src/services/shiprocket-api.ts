import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { PaginationMeta } from "@/types/catalog";

export type ShiprocketOrdersResponse = {
  data?: unknown[];
  meta?: {
    pagination?: {
      current_page?: number;
      per_page?: number;
      total?: number;
      total_pages?: number;
      count?: number;
    };
  };
  [key: string]: unknown;
};

export type ShiprocketOrderListItem = {
  id: string;
  srOrderId: string;
  channelOrderId: string;
  status: string;
  paymentMethod: string;
  total: string | number | null;
  createdAt: string;
};

function normalizeShiprocketOrder(
  row: Record<string, unknown>,
): ShiprocketOrderListItem {
  const srId = row.id != null ? String(row.id) : "";
  return {
    id: srId || String(row.channel_order_id ?? ""),
    srOrderId: srId,
    channelOrderId: String(row.channel_order_id ?? ""),
    status: String(row.status ?? "—"),
    paymentMethod: String(row.payment_method ?? "—"),
    total: row.total as string | number | null,
    createdAt: String(row.created_at ?? "—"),
  };
}

function parseShiprocketPagination(
  raw: ShiprocketOrdersResponse,
  items: ShiprocketOrderListItem[],
  fallbackPage: number,
  fallbackPageSize: number,
): PaginationMeta {
  const pg = raw.meta?.pagination;
  const page = Number(pg?.current_page) || fallbackPage;
  const pageSize = Number(pg?.per_page) || fallbackPageSize;
  let total = Number(pg?.total);
  let totalPages = Number(pg?.total_pages);

  if (!Number.isFinite(total) || total < 0) {
    const count = Number(pg?.count);
    if (Number.isFinite(count) && count >= 0) {
      total = count + (page - 1) * pageSize;
    } else {
      total = (page - 1) * pageSize + items.length;
      if (items.length >= pageSize) {
        total = page * pageSize;
      }
    }
  }

  if (!Number.isFinite(totalPages) || totalPages < 1) {
    totalPages =
      items.length < pageSize
        ? Math.max(1, page)
        : Math.max(page + 1, Math.ceil(total / pageSize));
  }

  return {
    page,
    pageSize,
    total: Math.max(total, items.length),
    totalPages: Math.max(1, totalPages),
  };
}

export async function fetchShiprocketOrders(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: string;
}) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const { data } = await apiClient.get<ApiEnvelope<ShiprocketOrdersResponse>>(
    "/shipping/shiprocket/orders/",
    { params },
  );
  const raw = assertApiSuccess(data);
  const list = (raw.data as Record<string, unknown>[] | undefined) ?? [];
  const items = (Array.isArray(list) ? list : []).map(normalizeShiprocketOrder);
  return {
    items,
    pagination: parseShiprocketPagination(raw, items, page, pageSize),
  };
}

export async function fetchShiprocketOrder(shiprocketOrderId: string) {
  const { data } = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
    `/shipping/shiprocket/orders/${encodeURIComponent(shiprocketOrderId)}/`,
  );
  return assertApiSuccess(data);
}

export async function fetchShiprocketTracking(params: {
  awb?: string;
  shipmentId?: string;
}) {
  const { data } = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
    "/shipping/shiprocket/track/",
    { params },
  );
  return assertApiSuccess(data);
}

export async function fetchShiprocketRates(params: {
  pickupPostcode: string;
  deliveryPostcode: string;
  weight: number;
  cod?: boolean;
  lengthCm?: number;
  breadthCm?: number;
  heightCm?: number;
}) {
  const { data } = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
    "/shipping/shiprocket/serviceability/",
    {
      params: {
        ...params,
        cod: params.cod ? 1 : 0,
      },
    },
  );
  return assertApiSuccess(data);
}
