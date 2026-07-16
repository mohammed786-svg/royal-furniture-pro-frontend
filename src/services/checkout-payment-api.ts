import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type {
  CheckoutPaymentFormValues,
  CheckoutPaymentInstructions,
} from "@/types/checkout-payment";

export async function fetchCheckoutPaymentInstructions() {
  const { data } = await apiClient.get<ApiEnvelope<CheckoutPaymentInstructions>>(
    "/storefront/checkout/",
  );
  return assertApiSuccess(data);
}

export async function fetchAdminCheckoutPaymentSettings() {
  const { data } = await apiClient.get<ApiEnvelope<CheckoutPaymentInstructions>>(
    "/settings/checkout-payment/",
  );
  return assertApiSuccess(data);
}

export async function updateAdminCheckoutPaymentSettings(
  payload: Partial<CheckoutPaymentFormValues>,
) {
  const { data } = await apiClient.put<ApiEnvelope<CheckoutPaymentInstructions>>(
    "/settings/checkout-payment/",
    payload,
  );
  return assertApiSuccess(data);
}
