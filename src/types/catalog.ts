export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  isActive: boolean;
  subCategoryCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type SubCategoryItem = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  underSubCategoryCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UnderSubCategoryItem = {
  id: string;
  subCategoryId: string;
  categoryId: string;
  categoryName: string;
  subCategoryName: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CatalogOption = { id: string; name: string; slug: string };
export type SubCategoryOption = CatalogOption & {
  categoryId: string;
  categoryName: string;
};

export type UnderSubCategoryOption = CatalogOption & {
  categoryId: string;
  subCategoryId: string;
  categoryName: string;
  subCategoryName: string;
};

export type CategoryLevel = "categories" | "sub-categories" | "under-sub-categories";

export type CategoryFormValues = {
  name: string;
  slug: string;
  imageUrl: string;
  iconUrl: string;
  bannerUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  subCategoryId: string;
};
