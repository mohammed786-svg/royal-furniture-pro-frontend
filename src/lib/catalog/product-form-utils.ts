import { fromCm, toCm, type DimensionUnit } from "@/lib/admin/dimension-units";
import type { ProductDetail, ProductFormValues } from "@/types/product";

export function detailToForm(item: ProductDetail): ProductFormValues {
  const unit: DimensionUnit = "cm";
  return {
    name: item.name,
    slug: item.slug,
    sku: item.sku,
    categoryId: item.categoryId,
    subCategoryId: item.subCategoryId ?? "",
    underSubCategoryId: item.underSubCategoryId ?? "",
    brandId: item.brandId ?? "",
    shortDescription: item.shortDescription ?? "",
    longDescription: item.longDescription ?? "",
    material: item.material ?? "",
    fabric: item.fabric ?? "",
    color: item.color ?? "",
    dimensions: item.dimensions ?? "",
    packageLength: fromCm(item.lengthCm ?? 0, unit),
    packageBreadth: fromCm(item.breadthCm ?? 0, unit),
    packageHeight: fromCm(item.heightCm ?? 0, unit),
    packageDimensionUnit: unit,
    weight: item.weight,
    assemblyRequired: item.assemblyRequired,
    warranty: item.warranty ?? "",
    countryOfOrigin: item.countryOfOrigin ?? "",
    hsnCode: item.hsnCode ?? "",
    barcode: item.barcode ?? "",
    basePrice: item.basePrice,
    salePrice: item.salePrice,
    mrp: item.mrp,
    gstPercent: item.gstPercent,
    isFeatured: item.isFeatured,
    isNewArrival: item.isNewArrival,
    isBestSeller: item.isBestSeller,
    isTrending: item.isTrending,
    isActive: item.isActive,
    seoTitle: item.seoTitle ?? "",
    seoDescription: item.seoDescription ?? "",
    seoKeywords: item.seoKeywords ?? "",
    images: item.images.map((img) => ({
      ...img,
      imageUrl: img.imageUrl ?? "",
    })),
    variants: item.variants,
    specifications: item.specifications,
    features: item.features,
  };
}

export function formToPayload(values: ProductFormValues) {
  const unit = values.packageDimensionUnit;
  return {
    ...values,
    lengthCm: toCm(values.packageLength, unit),
    breadthCm: toCm(values.packageBreadth, unit),
    heightCm: toCm(values.packageHeight, unit),
  };
}
