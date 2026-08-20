import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { StorefrontHomeResponse } from "@/types/storefront-home";

export async function fetchStorefrontHome(options?: { nocache?: boolean }): Promise<StorefrontHomeResponse> {
  const nocache = Boolean(options?.nocache);
  const qs = nocache ? "?nocache=1" : "";
  const { data } = await apiClient.get<ApiEnvelope<StorefrontHomeResponse>>(
    `/storefront/home/${qs}`,
  );
  return assertApiSuccess(data);
}
