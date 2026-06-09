import { navMegaMenus } from "@/lib/constants/nav-mega-menu";
import { categoryPageHref } from "@/lib/routes/category";

/** Mega menu column or sub-item → category listing page */
export function resolveMegaMenuHref(department: string, columnTitle?: string): string {
  if (columnTitle) {
    return categoryPageHref(department, columnTitle);
  }

  const menu = navMegaMenus[department];
  const firstColumn = menu?.columns?.[0]?.title;
  if (firstColumn) {
    return categoryPageHref(department, firstColumn);
  }

  return categoryPageHref(department);
}
