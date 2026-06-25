import {
  HERO_EMPTY_SLIDE_COUNT,
  type HeroBannerItem,
  type HeroBannersResponse,
  type HeroCarouselSlide,
} from "@/types/hero-banners";

export function mapHeroBannerToSlide(item: HeroBannerItem): HeroCarouselSlide {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    desktopImageUrl: item.imageUrl ?? null,
    mobileImageUrl: item.mobileImageUrl ?? item.imageUrl ?? null,
    href: item.href || "#",
    isEmpty: false,
  };
}

export function createEmptyHeroSlides(
  count = HERO_EMPTY_SLIDE_COUNT,
): HeroCarouselSlide[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `empty-${index + 1}`,
    title: `Banner slot ${index + 1}`,
    subtitle: "Add a hero banner in Admin → Marketing → Banners",
    desktopImageUrl: null,
    mobileImageUrl: null,
    href: "#",
    isEmpty: true,
  }));
}

export function resolveHeroSlides(
  response: HeroBannersResponse | undefined,
  isError: boolean,
): HeroCarouselSlide[] {
  if (isError || !response?.items?.length) {
    return createEmptyHeroSlides();
  }
  return response.items.map(mapHeroBannerToSlide);
}
