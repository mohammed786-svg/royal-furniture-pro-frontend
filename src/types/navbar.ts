export type NavbarMegaMenuItem = {
  id: string;
  label: string;
  slug: string;
  href: string;
};

export type NavbarMegaMenuColumn = {
  id: string;
  title: string;
  slug: string;
  href: string;
  items: NavbarMegaMenuItem[];
};

export type NavbarCategoryItem = {
  id: string;
  name: string;
  slug: string;
  href: string;
  iconUrl?: string | null;
  columns: NavbarMegaMenuColumn[];
};

export type NavbarTreeResponse = {
  items: NavbarCategoryItem[];
  version: string;
  cachedAt?: string | null;
};

/** Panel-compatible mega menu shape (label + columns). */
export type NavMegaMenu = {
  label: string;
  href: string;
  columns: {
    title: string;
    href: string;
    items: { label: string; href: string }[];
  }[];
};

export type NavbarDataSource = "api" | "cache" | "static";

export type NavbarState = {
  items: NavbarCategoryItem[];
  menusByLabel: Record<string, NavMegaMenu>;
  categoryLabels: string[];
  labelBySlug: Record<string, string>;
  version: string;
  source: NavbarDataSource;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
};
