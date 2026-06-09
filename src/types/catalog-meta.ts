export type CatalogProductOption = {
  id: string;
  name: string;
  sku: string;
};

export type CatalogCustomerOption = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
};
