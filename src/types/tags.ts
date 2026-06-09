export type TagItem = {
  id: string;
  tagName: string;
  slug: string;
  isActive: boolean;
  productCount: number;
  productIds: string[];
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type TagFormValues = {
  tagName: string;
  slug: string;
  isActive: boolean;
  productIds: string[];
};
