import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { NewAddressInput } from "@/lib/store/address-store";
import type { OrderInvoice } from "@/types/orders";
import type {
  StorefrontAddressesResponse,
  StorefrontCartResponse,
  StorefrontCheckoutResponse,
  StorefrontOrdersListResponse,
  StorefrontTrackOrderResponse,
  StorefrontWishlistResponse,
  VerifyOtpResponse,
} from "@/types/storefront-commerce";

export async function sendStorefrontOtp(
  phone: string,
  purpose: "login" | "register" = "login",
) {
  const { data } = await apiClient.post<
    ApiEnvelope<{ phone: string; devOtp?: string }>
  >("/storefront/auth/send-otp/", { phone, purpose });
  return assertApiSuccess(data);
}

export async function verifyStorefrontOtp(
  phone: string,
  otp: string,
  options?: {
    purpose?: "login" | "register";
    fullName?: string;
    email?: string;
  },
) {
  const { data } = await apiClient.post<ApiEnvelope<VerifyOtpResponse>>(
    "/storefront/auth/verify-otp/",
    {
      phone,
      otp,
      purpose: options?.purpose ?? "login",
      fullName: options?.fullName,
      email: options?.email,
    },
  );
  return assertApiSuccess(data);
}

export async function verifyStorefrontGoogle(idToken: string) {
  const { data } = await apiClient.post<ApiEnvelope<VerifyOtpResponse>>(
    "/storefront/auth/google/",
    { idToken },
  );
  return assertApiSuccess(data);
}

export async function fetchStorefrontMe() {
  const { data } =
    await apiClient.get<ApiEnvelope<VerifyOtpResponse["user"]>>("/storefront/auth/me/");
  return assertApiSuccess(data);
}

export async function updateStorefrontProfile(payload: {
  fullName?: string;
  email?: string;
  mobile?: string;
}) {
  const { data } = await apiClient.patch<ApiEnvelope<VerifyOtpResponse["user"]>>(
    "/storefront/auth/me/",
    {
      fullName: payload.fullName,
      email: payload.email || undefined,
      phone: payload.mobile,
    },
  );
  return assertApiSuccess(data);
}

export async function fetchStorefrontCart() {
  const { data } =
    await apiClient.get<ApiEnvelope<StorefrontCartResponse>>("/storefront/cart/");
  return assertApiSuccess(data);
}

export async function addStorefrontCartItem(payload: {
  productId: string | number;
  quantity?: number;
  productVariantId?: string | number;
}) {
  const { data } = await apiClient.post<ApiEnvelope<StorefrontCartResponse>>(
    "/storefront/cart/items/",
    payload,
  );
  return assertApiSuccess(data);
}

export async function updateStorefrontCartItem(
  cartItemId: string,
  payload: { quantity: number },
) {
  const { data } = await apiClient.patch<ApiEnvelope<StorefrontCartResponse>>(
    `/storefront/cart/items/${cartItemId}/`,
    payload,
  );
  return assertApiSuccess(data);
}

export async function removeStorefrontCartItem(cartItemId: string) {
  const { data } = await apiClient.delete<ApiEnvelope<StorefrontCartResponse>>(
    `/storefront/cart/items/${cartItemId}/`,
  );
  return assertApiSuccess(data);
}

export async function clearStorefrontCart() {
  const { data } =
    await apiClient.delete<ApiEnvelope<StorefrontCartResponse>>("/storefront/cart/");
  return assertApiSuccess(data);
}

export async function fetchStorefrontWishlist() {
  const { data } = await apiClient.get<ApiEnvelope<StorefrontWishlistResponse>>(
    "/storefront/wishlist/",
  );
  return assertApiSuccess(data);
}

export async function addStorefrontWishlistItem(productId: string | number) {
  const { data } = await apiClient.post<ApiEnvelope<StorefrontWishlistResponse>>(
    "/storefront/wishlist/",
    { productId },
  );
  return assertApiSuccess(data);
}

export async function removeStorefrontWishlistItem(productId: string | number) {
  const { data } = await apiClient.delete<ApiEnvelope<StorefrontWishlistResponse>>(
    `/storefront/wishlist/${productId}/`,
  );
  return assertApiSuccess(data);
}

export async function fetchStorefrontAddresses() {
  const { data } = await apiClient.get<ApiEnvelope<StorefrontAddressesResponse>>(
    "/storefront/addresses/",
  );
  return assertApiSuccess(data);
}

export async function createStorefrontAddress(input: NewAddressInput) {
  const { data } = await apiClient.post<
    ApiEnvelope<{ item: StorefrontAddressesResponse["items"][0] }>
  >("/storefront/addresses/", input);
  return assertApiSuccess(data);
}

export async function updateStorefrontAddress(
  addressId: string,
  input: NewAddressInput,
) {
  const { data } = await apiClient.patch<
    ApiEnvelope<{ item: StorefrontAddressesResponse["items"][0] }>
  >(`/storefront/addresses/${addressId}/`, input);
  return assertApiSuccess(data);
}

export async function deleteStorefrontAddress(addressId: string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(
    `/storefront/addresses/${addressId}/`,
  );
  return assertApiSuccess(data);
}

export async function placeStorefrontOrder(payload: {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: string;
  transactionRef: string;
  screenshot?: string;
}) {
  const { data } = await apiClient.post<ApiEnvelope<StorefrontCheckoutResponse>>(
    "/storefront/checkout/",
    payload,
  );
  return assertApiSuccess(data);
}

export async function fetchStorefrontOrders(params?: {
  page?: number;
  pageSize?: number;
}) {
  const { data } = await apiClient.get<ApiEnvelope<StorefrontOrdersListResponse>>(
    "/storefront/orders/",
    { params },
  );
  return assertApiSuccess(data);
}

export async function trackStorefrontOrder(orderNumber: string, mobile?: string) {
  const params: Record<string, string> = { orderNumber };
  if (mobile) params.mobile = mobile;
  const { data } = await apiClient.get<ApiEnvelope<StorefrontTrackOrderResponse>>(
    "/storefront/orders/track/",
    { params },
  );
  return assertApiSuccess(data);
}

export async function fetchStorefrontOrderInvoice(orderNumber: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ invoice: OrderInvoice }>>(
    "/storefront/orders/invoice/",
    { params: { orderNumber } },
  );
  return assertApiSuccess(data).invoice;
}

export async function cancelStorefrontOrder(payload: {
  orderNumber: string;
  reasonCode: string;
  reasonText?: string;
}) {
  const { data } = await apiClient.post<ApiEnvelope<{ order: StorefrontOrderSummary }>>(
    "/storefront/orders/cancel/",
    payload,
  );
  return assertApiSuccess(data);
}

export async function returnExchangeStorefrontOrder(payload: {
  orderNumber: string;
  requestType: "RETURN" | "EXCHANGE";
  reasonCode: string;
  reasonText?: string;
}) {
  const { data } = await apiClient.post<ApiEnvelope<{ order: StorefrontOrderSummary }>>(
    "/storefront/orders/return-exchange/",
    payload,
  );
  return assertApiSuccess(data);
}
