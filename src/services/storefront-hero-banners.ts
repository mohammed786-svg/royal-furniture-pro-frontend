import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { HeroBannersResponse } from "@/types/hero-banners";

export async function fetchHeroBanners(
  position = "HOME_HERO",
): Promise<HeroBannersResponse> {
  const { data } = await apiClient.get<ApiEnvelope<HeroBannersResponse>>(
    `/marketing/hero-banners/?position=${encodeURIComponent(position)}`,
  );
  return assertApiSuccess(data);
}
