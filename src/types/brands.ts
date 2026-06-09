export type BrandItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type BrandFormValues = {
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  websiteUrl: string;
  displayOrder: number;
  isActive: boolean;
};
