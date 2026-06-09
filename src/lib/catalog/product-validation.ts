import type { ProductFormValues } from "@/types/product";

export type ProductFormSection =
  | "basic"
  | "category"
  | "pricing"
  | "details"
  | "images"
  | "variants"
  | "specs"
  | "features"
  | "seo";

export type ProductFieldErrors = Partial<Record<string, string>>;

export type ProductValidationResult = {
  valid: boolean;
  errors: ProductFieldErrors;
  sections: Partial<Record<ProductFormSection, boolean>>;
};

const SKU_PATTERN = /^[A-Za-z0-9_-]+$/;

function setError(errors: ProductFieldErrors, field: string, message: string) {
  if (!errors[field]) errors[field] = message;
}

export function validateProductForm(
  values: ProductFormValues,
  section?: ProductFormSection,
): ProductValidationResult {
  const errors: ProductFieldErrors = {};
  const sections: Partial<Record<ProductFormSection, boolean>> = {};

  const check = (name: ProductFormSection, fn: () => void) => {
    if (section && section !== name) return;
    const before = Object.keys(errors).length;
    fn();
    sections[name] = Object.keys(errors).length === before;
  };

  check("basic", () => {
    const name = values.name.trim();
    if (!name) setError(errors, "name", "Product name is required");
    else if (name.length < 2)
      setError(errors, "name", "Name must be at least 2 characters");

    const sku = values.sku.trim();
    if (!sku) setError(errors, "sku", "SKU is required");
    else if (!SKU_PATTERN.test(sku)) {
      setError(
        errors,
        "sku",
        "SKU can only contain letters, numbers, hyphens and underscores",
      );
    }

    if (values.slug.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug.trim())) {
      setError(errors, "slug", "Slug must be lowercase letters, numbers and hyphens");
    }
  });

  check("category", () => {
    if (!values.categoryId) setError(errors, "categoryId", "Category is required");
    if (values.underSubCategoryId && !values.subCategoryId) {
      setError(
        errors,
        "subCategoryId",
        "Sub category is required when under sub category is set",
      );
    }
  });

  check("pricing", () => {
    if (values.basePrice < 0)
      setError(errors, "basePrice", "Base price cannot be negative");
    if (values.salePrice < 0)
      setError(errors, "salePrice", "Sale price cannot be negative");
    if (values.mrp < 0) setError(errors, "mrp", "MRP cannot be negative");
    if (values.salePrice > 0 && values.mrp > 0 && values.salePrice > values.mrp) {
      setError(errors, "salePrice", "Sale price cannot exceed MRP");
    }
    if (values.basePrice > 0 && values.mrp > 0 && values.basePrice > values.mrp) {
      setError(errors, "basePrice", "Base price cannot exceed MRP");
    }
    if (values.gstPercent < 0 || values.gstPercent > 100) {
      setError(errors, "gstPercent", "GST must be between 0 and 100");
    }
  });

  check("details", () => {
    if (values.weight < 0) setError(errors, "weight", "Weight cannot be negative");
  });

  check("images", () => {
    if (values.images.length > 0) {
      const primaryCount = values.images.filter((img) => img.isPrimary).length;
      if (primaryCount !== 1) {
        setError(errors, "images", "Select exactly one primary image");
      }
      values.images.forEach((img, idx) => {
        if (!img.imageUrl?.trim()) {
          setError(errors, `images.${idx}`, "Image is required");
        }
      });
    }
  });

  check("variants", () => {
    const skus = new Set<string>();
    values.variants.forEach((variant, idx) => {
      const prefix = `variants.${idx}`;
      if (!variant.variantName.trim()) {
        setError(errors, `${prefix}.variantName`, "Variant name is required");
      }
      const variantSku = variant.sku.trim();
      if (!variantSku) {
        setError(errors, `${prefix}.sku`, "Variant SKU is required");
      } else if (!SKU_PATTERN.test(variantSku)) {
        setError(errors, `${prefix}.sku`, "Invalid variant SKU format");
      } else if (skus.has(variantSku)) {
        setError(errors, `${prefix}.sku`, "Duplicate variant SKU");
      } else {
        skus.add(variantSku);
      }
      if (variant.price < 0)
        setError(errors, `${prefix}.price`, "Price cannot be negative");
      if (variant.salePrice < 0)
        setError(errors, `${prefix}.salePrice`, "Sale price cannot be negative");
      if (variant.mrp < 0) setError(errors, `${prefix}.mrp`, "MRP cannot be negative");
    });
  });

  check("specs", () => {
    values.specifications.forEach((spec, idx) => {
      const hasContent =
        spec.specKey.trim() || spec.specValue.trim() || spec.specGroup.trim();
      if (hasContent && !spec.specKey.trim()) {
        setError(
          errors,
          `specifications.${idx}.specKey`,
          "Specification key is required",
        );
      }
    });
  });

  check("features", () => {
    values.features.forEach((feature, idx) => {
      const hasContent =
        feature.featureTitle.trim() || (feature.featureDescription ?? "").trim();
      if (hasContent && !feature.featureTitle.trim()) {
        setError(errors, `features.${idx}.featureTitle`, "Feature title is required");
      }
    });
  });

  check("seo", () => {
    if (values.seoTitle.length > 70) {
      setError(errors, "seoTitle", "SEO title should be 70 characters or fewer");
    }
    if (values.seoDescription.length > 160) {
      setError(
        errors,
        "seoDescription",
        "SEO description should be 160 characters or fewer",
      );
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sections,
  };
}

export function getSectionCompletion(
  values: ProductFormValues,
): Record<ProductFormSection, boolean> {
  const result = validateProductForm(values);
  return {
    basic:
      Boolean(values.name.trim() && values.sku.trim()) &&
      !result.errors.name &&
      !result.errors.sku,
    category: Boolean(values.categoryId) && !result.errors.categoryId,
    pricing:
      values.basePrice >= 0 &&
      values.salePrice >= 0 &&
      !result.errors.basePrice &&
      !result.errors.salePrice &&
      !result.errors.gstPercent,
    details: values.weight >= 0 && !result.errors.weight,
    images:
      values.images.length === 0 || (!result.errors.images && values.images.length > 0),
    variants:
      values.variants.length === 0 ||
      !Object.keys(result.errors).some((k) => k.startsWith("variants.")),
    specs: !Object.keys(result.errors).some((k) => k.startsWith("specifications.")),
    features: !Object.keys(result.errors).some((k) => k.startsWith("features.")),
    seo: !result.errors.seoTitle && !result.errors.seoDescription,
  };
}
