export type StorefrontPlpProduct = {
  id: string;
  name: string;
  slug: string;
  href: string;
  imageUrl?: string | null;
  price: number;
  mrp: number;
  badge?: string | null;
  discount?: string | null;
  collection?: string | null;
  categorySlug?: string;
  subCategorySlug?: string;
};

export type StorefrontPlpSubcategory = {
  label: string;
  imageUrl?: string | null;
  href: string;
};

export type StorefrontCategoryListingResponse = {
  categoryId: string;
  subCategoryId: string;
  underSubCategoryId?: string | null;
  department: string;
  category: string;
  underSubCategory?: string | null;
  title: string;
  categorySlug: string;
  subCategorySlug: string;
  underSubCategorySlug?: string | null;
  subcategories: StorefrontPlpSubcategory[];
  products: StorefrontPlpProduct[];
  sortOptions: string[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  version: string;
  cachedAt?: string;
};

export type StorefrontProductDetailResponse = {
  id: string;
  slug: string;
  name: string;
  images: string[];
  imageUrl?: string | null;
  price: number;
  mrp: number;
  discount?: string | null;
  badge?: string | null;
  inStock: boolean;
  availableStock: number;
  sku: string;
  department: string;
  category: string;
  categorySlug: string;
  subCategorySlug: string;
  emiMonthly: number;
  description: string;
  features: string[];
  moreInfo: { label: string; value: string }[];
  specifications?: { group: string; key: string; value: string }[];
  version: string;
  cachedAt?: string;
};

export type CatalogListingDataSource = "api" | "cache" | "static" | "empty";
export type ProductDetailDataSource = "api" | "cache" | "static" | "empty";

export type CategoryListingState = {
  data: import("@/lib/constants/category-pages").CategoryPageData | null;
  source: CatalogListingDataSource;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
};

export type ProductDetailState = {
  product: import("@/lib/constants/product-details").ProductDetail | null;
  source: ProductDetailDataSource;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
};
