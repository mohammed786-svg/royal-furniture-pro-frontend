import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { NavbarTreeResponse } from "@/types/navbar";

export async function fetchNavbarTree(): Promise<NavbarTreeResponse> {
  const { data } =
    await apiClient.get<ApiEnvelope<NavbarTreeResponse>>("/catalog/navbar/");
  return assertApiSuccess(data);
}
