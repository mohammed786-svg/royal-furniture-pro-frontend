import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { PaginationMeta } from "@/types/catalog";
import type {
  NotificationFormValues,
  NotificationItem,
  NotificationLogItem,
  NotificationMetaOptions,
} from "@/types/notifications";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  channel?: string;
  targetType?: string;
  isActive?: boolean;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

type LogListParams = ListParams & {
  notificationId?: string;
  status?: string;
};

type ListResponse<T> = { items: T[]; pagination: PaginationMeta };

function buildQuery(
  params: Record<string, string | number | boolean | undefined> = {},
) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    q.set(key, String(value));
  }
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchNotifications(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<NotificationItem>>>(
    `/notifications/notifications/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchNotification(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: NotificationItem }>>(
    `/notifications/notifications/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createNotification(payload: Partial<NotificationFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: NotificationItem }>>(
    "/notifications/notifications/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateNotification(
  id: string,
  payload: Partial<NotificationFormValues>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: NotificationItem }>>(
    `/notifications/notifications/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteNotification(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/notifications/notifications/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchNotificationLogs(params?: LogListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<NotificationLogItem>>>(
    `/notifications/notification-logs/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchNotificationMetaOptions() {
  const { data } = await apiClient.get<ApiEnvelope<NotificationMetaOptions>>(
    "/notifications/meta-options/",
  );
  return assertApiSuccess(data);
}
