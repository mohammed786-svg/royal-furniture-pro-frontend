import type { HeroBannerItem } from "@/types/hero-banners";

export type StorefrontProduct = {
  id: string;
  name: string;
  slug?: string;
  href?: string;
  imageUrl?: string | null;
  price: number;
  mrp: number;
  collection?: string | null;
  badge?: string | null;
  discount?: string | null;
  label?: string;
};

export type StorefrontCategoryTile = {
  id: string;
  name: string;
  slug: string;
  href: string;
  imageUrl?: string | null;
};

export type StorefrontTestimonial = {
  id: string;
  name: string;
  city: string;
  text: string;
  imageUrl?: string | null;
  rating?: number;
};

export type StorefrontFeature = {
  label: string;
  imageUrl?: string | null;
};

export type StorefrontSeoContent = {
  title: string;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type StorefrontHomeResponse = {
  promoBanners: HeroBannerItem[];
  offerBar?: Record<string, unknown> | null;
  features: StorefrontFeature[];
  popularCategories: StorefrontCategoryTile[];
  onlineExclusive: StorefrontProduct[];
  spotlight: StorefrontProduct[];
  bestSellers: StorefrontProduct[];
  newArrivals: StorefrontProduct[];
  decorCategories: StorefrontCategoryTile[];
  limitedDeals: StorefrontProduct[];
  testimonials: StorefrontTestimonial[];
  seoContent?: StorefrontSeoContent | null;
  version: string;
  cachedAt?: string | null;
};

export type HomepageDataSource = "api" | "cache" | "empty" | "static";

export type HomepageState = {
  data: StorefrontHomeResponse;
  source: HomepageDataSource;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
};

export const HOME_EMPTY_COUNTS = {
  promoBanners: 2,
  popularCategories: 12,
  onlineExclusive: 4,
  spotlight: 6,
  bestSellers: 8,
  newArrivals: 8,
  decorCategories: 8,
  limitedDeals: 6,
  testimonials: 3,
  features: 5,
} as const;
