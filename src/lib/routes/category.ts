import { navCategories } from "@/lib/constants/home";
import { navMegaMenus } from "@/lib/constants/nav-mega-menu";

/** Build storefront PLP path from API category slugs */
export function categoryListingHref(
  categorySlug: string,
  subCategorySlug: string,
  underSubCategorySlug?: string | null,
): string {
  if (underSubCategorySlug) {
    return `/${categorySlug}/${subCategorySlug}/${underSubCategorySlug}`;
  }
  return `/${categorySlug}/${subCategorySlug}`;
}

/** URL slug from nav label (e.g. "Study & Office" → "study-office") */
export function toCategorySlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function categoryPageHref(department: string, category?: string): string {
  const dept = toCategorySlug(department);
  if (!category) return `/${dept}`;
  return `/${dept}/${toCategorySlug(category)}`;
}

const NAV_LABEL_BY_DEPT_SLUG: Record<string, string> = Object.fromEntries(
  navCategories.map((label) => [toCategorySlug(label), label]),
);

/** Resolve top-nav label from pathname (e.g. /living/recliners → Living) */
export function activeNavLabelFromPath(pathname: string): string | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return null;
  return NAV_LABEL_BY_DEPT_SLUG[segment] ?? null;
}

/** Default category slug when visiting /{department} only */
export function getDefaultCategorySlugForDepartment(departmentSlug: string): string {
  const label = NAV_LABEL_BY_DEPT_SLUG[departmentSlug];
  if (!label) return departmentSlug;

  if (label === "Living") {
    return toCategorySlug("Recliners");
  }

  const firstColumn = navMegaMenus[label]?.columns?.[0]?.title;
  return firstColumn ? toCategorySlug(firstColumn) : departmentSlug;
}

/** Primary href for top-level nav category click */
export function primaryNavCategoryHref(label: string): string {
  if (label === "Living") {
    return categoryPageHref("Living", "Recliners");
  }

  const menu = navMegaMenus[label];
  const firstColumn = menu?.columns?.[0]?.title;
  if (firstColumn) {
    return categoryPageHref(label, firstColumn);
  }

  return categoryPageHref(label);
}

/** Homepage popular category tiles → listing pages */
export const popularCategoryHrefs: Record<string, string> = {
  Recliner: categoryPageHref("Living", "Recliners"),
  Sofa: categoryPageHref("Living", "Sofas"),
  "Dining Set": categoryPageHref("Dining", "Dining Tables & Sets"),
  Beds: categoryPageHref("Bedroom", "Beds"),
  "Study Tables": categoryPageHref("Study & Office", "Tables"),
  Mattress: categoryPageHref("Mattresses", "Single Mattresses"),
  Decor: categoryPageHref("Decor", "Furniture Accents"),
  Wardrobes: categoryPageHref("Bedroom", "Wardrobes"),
  Chairs: categoryPageHref("Living", "Seatings"),
  Outdoor: categoryPageHref("Outdoor", "Outdoor Furniture"),
  "Dressing Table": categoryPageHref("Bedroom", "Tables"),
  "Coffee Tables": categoryPageHref("Living", "Living Room Tables"),
};

export function resolvePopularCategoryHref(cat: {
  name: string;
  slug?: string;
  href?: string;
}): string {
  if (cat.href && cat.href !== "#") return cat.href;
  if (cat.slug) return `/${cat.slug}`;
  const mapped = popularCategoryHrefs[cat.name];
  if (mapped) return mapped;
  return categoryPageHref(cat.name);
}
