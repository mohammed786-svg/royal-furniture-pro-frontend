import type { DimensionUnit } from "@/lib/admin/dimension-units";
import type { PaginationMeta } from "@/types/catalog";

export type ProductImage = {
  id?: string;
  imageUrl: string;
  altText?: string;
  imageType?: string;
  isPrimary?: boolean;
  is360?: boolean;
  displayOrder?: number;
};

export type ProductVariant = {
  id?: string;
  variantName: string;
  sku: string;
  barcode?: string;
  color?: string;
  fabric?: string;
  size?: string;
  material?: string;
  price: number;
  salePrice: number;
  mrp: number;
  weight?: number;
  dimensions?: string;
  isDefault?: boolean;
  isActive?: boolean;
};

export type ProductSpecification = {
  id?: string;
  specGroup: string;
  specKey: string;
  specValue: string;
  displayOrder?: number;
};

export type ProductFeature = {
  id?: string;
  featureTitle: string;
  featureDescription?: string;
  iconUrl?: string;
  displayOrder?: number;
};

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  basePrice: number;
  salePrice: number;
  mrp: number;
  categoryId: string;
  categoryName: string;
  subCategoryId?: string | null;
  subCategoryName?: string | null;
  underSubCategoryId?: string | null;
  underSubCategoryName?: string | null;
  brandId?: string | null;
  brandName?: string | null;
  primaryImageUrl?: string | null;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ProductDetail = ProductListItem & {
  hsnCode?: string | null;
  barcode?: string | null;
  longDescription?: string | null;
  material?: string | null;
  fabric?: string | null;
  color?: string | null;
  dimensions?: string | null;
  lengthCm?: number;
  breadthCm?: number;
  heightCm?: number;
  weight: number;
  assemblyRequired: boolean;
  warranty?: string | null;
  countryOfOrigin?: string | null;
  gstPercent: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
};

export type ProductFormValues = {
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  subCategoryId: string;
  underSubCategoryId: string;
  brandId: string;
  shortDescription: string;
  longDescription: string;
  material: string;
  fabric: string;
  color: string;
  dimensions: string;
  packageLength: number;
  packageBreadth: number;
  packageHeight: number;
  packageDimensionUnit: DimensionUnit;
  weight: number;
  assemblyRequired: boolean;
  warranty: string;
  countryOfOrigin: string;
  hsnCode: string;
  barcode: string;
  basePrice: number;
  salePrice: number;
  mrp: number;
  gstPercent: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
};

export type BrandOption = { id: string; name: string; slug: string };

export type ProductListResponse = {
  items: ProductListItem[];
  pagination: PaginationMeta;
};
