import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { PaginationMeta } from "@/types/catalog";
import type { CatalogCustomerOption } from "@/types/catalog-meta";
import type {
  PaymentFormValues,
  PaymentItem,
  PaymentVerificationFormValues,
  PaymentVerificationItem,
} from "@/types/payments";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  orderId?: string;
  customerId?: string;
  paymentStatus?: string;
  paymentId?: string;
  verificationStatus?: string;
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

export async function fetchPayments(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<ListResponse<PaymentItem>>>(
    `/payments/payments/${buildQuery(params ?? {})}`,
  );
  return assertApiSuccess(data);
}

export async function fetchPayment(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: PaymentItem }>>(
    `/payments/payments/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createPayment(payload: Partial<PaymentFormValues>) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: PaymentItem }>>(
    "/payments/payments/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updatePayment(id: string, payload: Partial<PaymentFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: PaymentItem }>>(
    `/payments/payments/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deletePayment(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/payments/payments/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchPaymentVerifications(params?: ListParams) {
  const { data } = await apiClient.get<
    ApiEnvelope<ListResponse<PaymentVerificationItem>>
  >(`/payments/verifications/${buildQuery(params ?? {})}`);
  return assertApiSuccess(data);
}

export async function fetchPaymentVerification(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: PaymentVerificationItem }>>(
    `/payments/verifications/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createPaymentVerification(
  payload: Partial<PaymentVerificationFormValues>,
) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: PaymentVerificationItem }>>(
    "/payments/verifications/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updatePaymentVerification(
  id: string,
  payload: Partial<PaymentVerificationFormValues & { verificationStatus?: string }>,
) {
  const { data } = await apiClient.patch<
    ApiEnvelope<{ item: PaymentVerificationItem }>
  >(`/payments/verifications/${id}/`, payload);
  return assertApiSuccess(data).item;
}

export async function deletePaymentVerification(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/payments/verifications/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchPaymentMetaOptions() {
  const { data } = await apiClient.get<
    ApiEnvelope<{
      orders: {
        id: string;
        orderNumber: string;
        customerId: string;
        customerName: string;
        totalAmount: number;
      }[];
      customers: CatalogCustomerOption[];
      paymentMethods: string[];
      paymentStatuses: string[];
      verificationStatuses: string[];
    }>
  >("/payments/meta-options/");
  return assertApiSuccess(data);
}
