import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import { apiClient } from "@/lib/axios/instance";
import type { CatalogCustomerOption, CatalogProductOption } from "@/types/catalog-meta";

export async function fetchCatalogMetaOptions() {
  const { data } = await apiClient.get<
    ApiEnvelope<{
      products: CatalogProductOption[];
      customers: CatalogCustomerOption[];
    }>
  >("/catalog/meta-options/");
  return assertApiSuccess(data);
}
