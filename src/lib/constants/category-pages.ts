import {
  bestSellers,
  newArrivals,
  p,
  type ProductItem,
} from "@/lib/constants/home-data";
import { navMegaMenus } from "@/lib/constants/nav-mega-menu";
import { categoryPageHref, toCategorySlug } from "@/lib/routes/category";

const CDN = "https://www.royaloakindia.com";

export type CategorySubcategory = {
  label: string;
  image: string;
  href: string;
};

export type CategoryPageData = {
  department: string;
  category: string;
  title: string;
  subcategories: CategorySubcategory[];
  products: ProductItem[];
  sortOptions: string[];
};

const DEFAULT_SORT_OPTIONS = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Discount",
] as const;

const productThumb = (path: string) => `${CDN}/media/catalog/product/${path}`;

const reclinersSubcategories: CategorySubcategory[] = [
  {
    label: "Fabric Recliners",
    image: productThumb("s/f/sf5024-3.jpg"),
    href: categoryPageHref("Living", "Recliners"),
  },
  {
    label: "Leatherette Recliners",
    image: productThumb("s/f/sf6005_3_1_1.jpg"),
    href: categoryPageHref("Living", "Recliners"),
  },
  {
    label: "Leather Recliners",
    image: productThumb("s/f/sf5024-3.jpg"),
    href: categoryPageHref("Living", "Recliners"),
  },
  {
    label: "Single Seater Recliners",
    image: productThumb("s/f/sf6005_3_1_1.jpg"),
    href: categoryPageHref("Living", "Recliners"),
  },
  {
    label: "Two seater Recliners",
    image: productThumb("s/f/sf8408-3_1.jpg"),
    href: categoryPageHref("Living", "Recliners"),
  },
  {
    label: "Three Seater Recliners",
    image: productThumb("s/f/sf8408-3_1.jpg"),
    href: categoryPageHref("Living", "Recliners"),
  },
  {
    label: "Recliner Sets",
    image: productThumb("s/f/sf5024-3.jpg"),
    href: categoryPageHref("Living", "Recliners"),
  },
  {
    label: "Home Theatre Recliners",
    image: productThumb("s/f/sf6005_3_1_1.jpg"),
    href: categoryPageHref("Living", "Recliners"),
  },
];

const reclinersProducts: ProductItem[] = [
  p(
    "rec1",
    "Royal Furniture Pro Nova Leatherette Single Seater Recliner - Brown",
    "s/f/sf5024-3.jpg",
    14990,
    44999,
    { badge: "New Arrival", discount: "66% off" },
  ),
  p(
    "rec2",
    "Royal Furniture Pro Nova Leatherette Single Seater Recliner - Ivory",
    "s/f/sf6005_3_1_1.jpg",
    14990,
    44999,
    { badge: "New Arrival", discount: "66% off" },
  ),
  p(
    "rec3",
    "Royal Furniture Pro Logan Fabric Single Seater Recliner - Brown",
    "s/f/sf5024-3.jpg",
    14990,
    44999,
    { badge: "New Arrival", discount: "66% off" },
  ),
  p(
    "rec4",
    "Royal Furniture Pro Logan Fabric Single Seater Recliner - Ivory",
    "s/f/sf6005_3_1_1.jpg",
    14990,
    44999,
    { badge: "New Arrival", discount: "66% off" },
  ),
  p(
    "rec5",
    "Royal Furniture Pro Melaka Malaysian Fabric Recliner Three Seater",
    "s/f/sf8408-3_1.jpg",
    43000,
    90000,
    { badge: "New Arrival", discount: "52% off" },
  ),
  p(
    "rec6",
    "Royal Furniture Pro Melaka Malaysian Fabric Recliner Two Seater",
    "s/f/sf8408-3_1.jpg",
    32000,
    70000,
    { badge: "New Arrival", discount: "54% off" },
  ),
  p(
    "rec7",
    "Royal Furniture Pro Texas American Leatherette High Back Recliner",
    "a/r/artboard_2_121.jpg",
    14999,
    27999,
    { badge: "Online Exclusive", discount: "46% off" },
  ),
  p(
    "rec8",
    "Royal Furniture Pro Nova Leatherette Two Seater Recliner - Brown",
    "s/f/sf5024-3.jpg",
    28990,
    79999,
    { badge: "New Arrival", discount: "64% off" },
  ),
  p(
    "rec9",
    "Royal Furniture Pro Nova Leatherette Three Seater Recliner - Ivory",
    "s/f/sf6005_3_1_1.jpg",
    39990,
    99999,
    { badge: "Online Exclusive", discount: "60% off" },
  ),
];

const FALLBACK_PRODUCT_POOL = [...newArrivals, ...bestSellers];

function productsForCategory(
  categoryTitle: string,
  registryKey: string,
): ProductItem[] {
  if (registryKey === "living/recliners") return reclinersProducts;

  const lower = categoryTitle.toLowerCase();
  const matched = FALLBACK_PRODUCT_POOL.filter((item) =>
    item.name.toLowerCase().includes(lower.replace(/s$/, "")),
  );
  if (matched.length >= 3) return matched.slice(0, 9);

  const offset =
    Math.abs(registryKey.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 4;
  return FALLBACK_PRODUCT_POOL.slice(offset, offset + 9);
}

function buildSubcategories(
  department: string,
  category: string,
  items: { label: string }[],
  fallbackImage: string,
): CategorySubcategory[] {
  const pageHref = categoryPageHref(department, category);

  if (items.length > 0) {
    return items.map((item) => ({
      label: item.label,
      image: fallbackImage,
      href: pageHref,
    }));
  }

  return [{ label: category, image: fallbackImage, href: pageHref }];
}

function buildPageFromMegaColumn(
  department: string,
  column: { title: string; items: { label: string }[] },
): CategoryPageData {
  const registryKey = `${toCategorySlug(department)}/${toCategorySlug(column.title)}`;
  const fallbackImage = productThumb("s/f/sf5024-3.jpg");

  return {
    department,
    category: column.title,
    title: `${column.title} Online In India`,
    subcategories: buildSubcategories(
      department,
      column.title,
      column.items,
      fallbackImage,
    ),
    products: productsForCategory(column.title, registryKey),
    sortOptions: [...DEFAULT_SORT_OPTIONS],
  };
}

function buildCategoryPagesRegistry(): Record<string, CategoryPageData> {
  const registry: Record<string, CategoryPageData> = {
    "living/recliners": {
      department: "Living",
      category: "Recliners",
      title: "Recliners Online In India",
      subcategories: reclinersSubcategories,
      products: reclinersProducts,
      sortOptions: [...DEFAULT_SORT_OPTIONS],
    },
  };

  for (const [department, menu] of Object.entries(navMegaMenus)) {
    for (const column of menu.columns) {
      const key = `${toCategorySlug(department)}/${toCategorySlug(column.title)}`;
      if (!registry[key]) {
        registry[key] = buildPageFromMegaColumn(department, column);
      }
    }
  }

  return registry;
}

export const categoryPagesRegistry = buildCategoryPagesRegistry();

export function getCategoryPage(
  departmentSlug: string,
  categorySlug: string,
): CategoryPageData | null {
  return categoryPagesRegistry[`${departmentSlug}/${categorySlug}`] ?? null;
}

export function getAllCategoryPageParams(): { department: string; category: string }[] {
  return Object.keys(categoryPagesRegistry).map((key) => {
    const [department, category] = key.split("/");
    return { department, category };
  });
}
