import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { AuditLogItem } from "@/types/audit-logs";
import type { PaginationMeta } from "@/types/catalog";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  actionType?: string;
  tableName?: string;
  userId?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

type ListResponse = { items: AuditLogItem[]; pagination: PaginationMeta };

function buildQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.actionType) q.set("actionType", params.actionType);
  if (params.tableName) q.set("tableName", params.tableName);
  if (params.userId) q.set("userId", params.userId);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchAuditLogs(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse>>(
    `/audit-logs/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchAuditLog(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: AuditLogItem }>>(
    `/audit-logs/${id}/`,
  );
  return assertApiSuccess(data).item;
}
