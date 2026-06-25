import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { StorefrontHomeResponse } from "@/types/storefront-home";

export async function fetchStorefrontHome(): Promise<StorefrontHomeResponse> {
  const { data } =
    await apiClient.get<ApiEnvelope<StorefrontHomeResponse>>("/storefront/home/");
  return assertApiSuccess(data);
}
