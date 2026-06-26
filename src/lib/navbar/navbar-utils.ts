import { navCategories, navCategoryIcons } from "@/lib/constants/home";
import { navMegaMenus } from "@/lib/constants/nav-mega-menu";
import { categoryPageHref } from "@/lib/routes/category";
import type {
  NavbarCategoryItem,
  NavbarTreeResponse,
  NavMegaMenu,
} from "@/types/navbar";

export function emptyNavbarTree(): NavbarTreeResponse {
  return {
    items: [],
    version: "empty",
    cachedAt: null,
  };
}

/** @deprecated Demo-only — not used on production storefront. */
export function staticNavbarFallback(): NavbarTreeResponse {
  const items: NavbarCategoryItem[] = navCategories.map((label, index) => {
    const menu = navMegaMenus[label];
    const slug = label
      .toLowerCase()
      .replace(/\s*&\s*/g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return {
      id: `static-${index}`,
      name: label,
      slug,
      href: menu?.href && menu.href !== "#" ? menu.href : categoryPageHref(label),
      iconUrl: navCategoryIcons[label] ?? null,
      columns: (menu?.columns ?? []).map((column, colIndex) => ({
        id: `static-${index}-${colIndex}`,
        title: column.title,
        slug: column.title
          .toLowerCase()
          .replace(/\s*&\s*/g, "-")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        href: column.href !== "#" ? column.href : categoryPageHref(label, column.title),
        items: column.items.map((item, itemIndex) => ({
          id: `static-${index}-${colIndex}-${itemIndex}`,
          label: item.label,
          slug: item.label
            .toLowerCase()
            .replace(/\s*&\s*/g, "-")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
          href: item.href !== "#" ? item.href : categoryPageHref(label, column.title),
        })),
      })),
    };
  });

  return {
    items,
    version: "static",
    cachedAt: null,
  };
}

export function toMegaMenu(item: NavbarCategoryItem): NavMegaMenu {
  return {
    label: item.name,
    href: item.href,
    columns: item.columns.map((column) => ({
      title: column.title,
      href: column.href,
      items: column.items.map((sub) => ({
        label: sub.label,
        href: sub.href,
      })),
    })),
  };
}

export function buildNavbarLookups(items: NavbarCategoryItem[]) {
  const menusByLabel: Record<string, NavMegaMenu> = {};
  const labelBySlug: Record<string, string> = {};
  const categoryLabels: string[] = [];

  for (const item of items) {
    categoryLabels.push(item.name);
    menusByLabel[item.name] = toMegaMenu(item);
    labelBySlug[item.slug] = item.name;
  }

  return { menusByLabel, labelBySlug, categoryLabels };
}

export function resolveNavCategoryIcon(item: NavbarCategoryItem): string | null {
  const icon =
    item.iconUrl ??
    navCategoryIcons[item.name as keyof typeof navCategoryIcons] ??
    null;
  if (!icon) return null;
  if (icon.startsWith("/images/nav/") && icon.endsWith(".png")) {
    return "/images/nav/category.svg";
  }
  return icon;
}

export function activeNavLabelFromItems(
  pathname: string,
  labelBySlug: Record<string, string>,
): string | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return null;
  return labelBySlug[segment] ?? null;
}

export function primaryNavHref(item: NavbarCategoryItem): string {
  return item.href;
}

export function hasMegaMenuColumns(item: NavbarCategoryItem): boolean {
  return item.columns.length > 0;
}
