import type { CategoryPageData } from "@/lib/constants/category-pages";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import type {
  StorefrontCategoryListingResponse,
  StorefrontProductDetailResponse,
} from "@/types/storefront-catalog";

const PLACEHOLDER_IMAGE = "";

export function mapPlpProductToCard(
  product: StorefrontCategoryListingResponse["products"][0],
): ProductItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    href: product.href,
    image: resolveMediaUrl(product.imageUrl) ?? PLACEHOLDER_IMAGE,
    price: product.price,
    mrp: product.mrp,
    badge: product.badge ?? undefined,
    discount: product.discount ?? undefined,
    collection: product.collection ?? undefined,
  };
}

export function mapCategoryListingResponse(
  response: StorefrontCategoryListingResponse,
): CategoryPageData {
  return {
    department: response.department,
    category: response.category,
    title: response.title,
    subcategories: response.subcategories.map((sub) => ({
      label: sub.label,
      image: resolveMediaUrl(sub.imageUrl) ?? PLACEHOLDER_IMAGE,
      href: sub.href,
    })),
    products: response.products.map(mapPlpProductToCard),
    sortOptions: response.sortOptions,
  };
}

export function mapProductDetailResponse(
  response: StorefrontProductDetailResponse,
): ProductDetail {
  const images = response.images
    .map((url) => resolveMediaUrl(url))
    .filter((url): url is string => Boolean(url));

  return {
    slug: response.slug,
    id: response.id,
    name: response.name,
    images: images.length > 0 ? images : [PLACEHOLDER_IMAGE],
    price: response.price,
    mrp: response.mrp,
    discount: response.discount ?? undefined,
    badge: response.badge ?? undefined,
    inStock: response.inStock,
    sku: response.sku,
    department: response.department,
    category: response.category,
    emiMonthly: response.emiMonthly,
    description: response.description,
    features: response.features,
    moreInfo: response.moreInfo,
  };
}

export function emptyCategoryListing(
  departmentSlug: string,
  subCategorySlug: string,
): CategoryPageData {
  const title = subCategorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    department: departmentSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    category: title,
    title,
    subcategories: [],
    products: [],
    sortOptions: [
      "Recommended",
      "Price: Low to High",
      "Price: High to Low",
      "Newest",
      "Discount",
    ],
  };
}
