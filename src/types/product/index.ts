import type { ID } from "@/types/common";

export type ProductBase = {
  productId: ID;
  name: string;
  slug: string;
  sku: string;
};
