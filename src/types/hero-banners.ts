export type HeroBannerItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
  href: string;
  displayOrder: number;
};

export type HeroBannersResponse = {
  positionCode: string;
  items: HeroBannerItem[];
  version: string;
  cachedAt?: string | null;
};

export type HeroCarouselSlide = {
  id: string;
  title: string;
  subtitle?: string | null;
  desktopImageUrl: string | null;
  mobileImageUrl: string | null;
  href: string;
  isEmpty: boolean;
};

export type HeroBannersDataSource = "api" | "cache" | "empty";

export type HeroBannersState = {
  slides: HeroCarouselSlide[];
  version: string;
  source: HeroBannersDataSource;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
};

export const HERO_EMPTY_SLIDE_COUNT = 4;
