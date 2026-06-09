import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  AdjustmentFormValues,
  AdjustmentItem,
  AlertItem,
  InventoryListResponse,
  InventoryOptions,
  StockFormValues,
  StockItem,
  TransferFormValues,
  TransferItem,
  WarehouseFormValues,
  WarehouseItem,
} from "@/types/inventory";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  warehouseId?: string;
  productId?: string;
  status?: string;
};

function buildQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  if (params.warehouseId) q.set("warehouseId", params.warehouseId);
  if (params.productId) q.set("productId", params.productId);
  if (params.status) q.set("status", params.status);
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchInventoryOptions() {
  const { data } =
    await apiClient.get<ApiEnvelope<InventoryOptions>>("/inventory/options/");
  return assertApiSuccess(data);
}

// Warehouses
export async function fetchWarehouses(params?: ListParams) {
  const { data } = await apiClient.get<
    ApiEnvelope<InventoryListResponse<WarehouseItem>>
  >(`/inventory/warehouses/${buildQuery(params)}`);
  return assertApiSuccess(data);
}

export async function fetchWarehouse(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: WarehouseItem }>>(
    `/inventory/warehouses/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createWarehouse(payload: WarehouseFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: WarehouseItem }>>(
    "/inventory/warehouses/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateWarehouse(
  id: string,
  payload: Partial<WarehouseFormValues>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: WarehouseItem }>>(
    `/inventory/warehouses/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteWarehouse(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/inventory/warehouses/${id}/`,
  );
  assertApiSuccess(data);
}

// Stock
export async function fetchStock(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<InventoryListResponse<StockItem>>>(
    `/inventory/stock/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchStockItem(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: StockItem }>>(
    `/inventory/stock/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createStock(payload: StockFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: StockItem }>>(
    "/inventory/stock/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateStock(id: string, payload: Partial<StockFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: StockItem }>>(
    `/inventory/stock/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteStock(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/inventory/stock/${id}/`);
  assertApiSuccess(data);
}

// Adjustments
export async function fetchAdjustments(params?: ListParams) {
  const { data } = await apiClient.get<
    ApiEnvelope<InventoryListResponse<AdjustmentItem>>
  >(`/inventory/adjustments/${buildQuery(params)}`);
  return assertApiSuccess(data);
}

export async function fetchAdjustment(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: AdjustmentItem }>>(
    `/inventory/adjustments/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createAdjustment(payload: AdjustmentFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: AdjustmentItem }>>(
    "/inventory/adjustments/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateAdjustmentStatus(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: AdjustmentItem }>>(
    `/inventory/adjustments/${id}/`,
    { status },
  );
  return assertApiSuccess(data).item;
}

// Transfers
export async function fetchTransfers(params?: ListParams) {
  const { data } = await apiClient.get<
    ApiEnvelope<InventoryListResponse<TransferItem>>
  >(`/inventory/transfers/${buildQuery(params)}`);
  return assertApiSuccess(data);
}

export async function fetchTransfer(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: TransferItem }>>(
    `/inventory/transfers/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createTransfer(payload: TransferFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: TransferItem }>>(
    "/inventory/transfers/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateTransferStatus(
  id: string,
  status: "IN_TRANSIT" | "COMPLETED" | "CANCELLED",
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: TransferItem }>>(
    `/inventory/transfers/${id}/`,
    { status },
  );
  return assertApiSuccess(data).item;
}

// Alerts
export async function fetchAlerts(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<InventoryListResponse<AlertItem>>>(
    `/inventory/alerts/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}
