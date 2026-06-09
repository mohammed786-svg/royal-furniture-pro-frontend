import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  AddressFormValues,
  AddressItem,
  CustomerFormValues,
  CustomerItem,
  CustomerOptions,
  CustomersListResponse,
  WalletDetail,
  WalletItem,
  WalletTransactionFormValues,
  WishlistItem,
} from "@/types/customers";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  customerId?: string;
  isGuest?: boolean;
};

function buildQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDir) q.set("sortDir", params.sortDir);
  if (params.customerId) q.set("customerId", params.customerId);
  if (params.isGuest !== undefined) q.set("isGuest", String(params.isGuest));
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function fetchCustomerOptions() {
  const { data } =
    await apiClient.get<ApiEnvelope<CustomerOptions>>("/customers/options/");
  return assertApiSuccess(data);
}

export async function fetchCustomers(params?: ListParams) {
  const { data } = await apiClient.get<
    ApiEnvelope<CustomersListResponse<CustomerItem>>
  >(`/customers/customers/${buildQuery(params)}`);
  return assertApiSuccess(data);
}

export async function fetchCustomer(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: CustomerItem }>>(
    `/customers/customers/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createCustomer(payload: CustomerFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: CustomerItem }>>(
    "/customers/customers/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateCustomer(id: string, payload: Partial<CustomerFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: CustomerItem }>>(
    `/customers/customers/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteCustomer(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/customers/customers/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchAddresses(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<CustomersListResponse<AddressItem>>>(
    `/customers/addresses/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchAddress(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: AddressItem }>>(
    `/customers/addresses/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function createAddress(payload: AddressFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: AddressItem }>>(
    "/customers/addresses/",
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function updateAddress(id: string, payload: Partial<AddressFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: AddressItem }>>(
    `/customers/addresses/${id}/`,
    payload,
  );
  return assertApiSuccess(data).item;
}

export async function deleteAddress(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/customers/addresses/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchWishlists(params?: ListParams) {
  const { data } = await apiClient.get<
    ApiEnvelope<CustomersListResponse<WishlistItem>>
  >(`/customers/wishlists/${buildQuery(params)}`);
  return assertApiSuccess(data);
}

export async function deleteWishlist(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/customers/wishlists/${id}/`,
  );
  assertApiSuccess(data);
}

export async function fetchWallets(params?: ListParams) {
  const { data } = await apiClient.get<ApiEnvelope<CustomersListResponse<WalletItem>>>(
    `/customers/wallet/${buildQuery(params)}`,
  );
  return assertApiSuccess(data);
}

export async function fetchWallet(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ item: WalletDetail }>>(
    `/customers/wallet/${id}/`,
  );
  return assertApiSuccess(data).item;
}

export async function processWalletTransaction(
  walletId: string,
  payload: WalletTransactionFormValues,
) {
  const { data } = await apiClient.post<ApiEnvelope<{ item: WalletDetail }>>(
    `/customers/wallet/${walletId}/transactions/`,
    payload,
  );
  return assertApiSuccess(data).item;
}
