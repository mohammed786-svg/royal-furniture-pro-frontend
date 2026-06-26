import { features, homeImages, popularCategories } from "@/lib/constants/home";
import {
  bestSellers,
  decorCategories,
  limitedDeals,
  newArrivals,
  onlineExclusive,
  spotlightItems,
  testimonials,
  type ProductItem,
} from "@/lib/constants/home-data";
import type { HeroBannerItem } from "@/types/hero-banners";
import {
  HOME_EMPTY_COUNTS,
  type StorefrontCategoryTile,
  type StorefrontFeature,
  type StorefrontHomeResponse,
  type StorefrontProduct,
  type StorefrontTestimonial,
} from "@/types/storefront-home";

export function mapStorefrontProduct(product: StorefrontProduct): ProductItem {
  return {
    id: product.id,
    name: product.name,
    image: product.imageUrl ?? "",
    price: product.price,
    mrp: product.mrp,
    collection: product.collection ?? undefined,
    badge: product.badge ?? undefined,
    discount: product.discount ?? undefined,
    slug: product.slug,
    href: product.href,
    isEmpty: product.id.startsWith("empty-"),
  };
}

export function createEmptyProducts(count: number): ProductItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `empty-product-${index + 1}`,
    name: `Product slot ${index + 1}`,
    image: "",
    price: 0,
    mrp: 0,
    isEmpty: true,
  }));
}

export function createEmptyCategoryTiles(count: number): StorefrontCategoryTile[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `empty-category-${index + 1}`,
    name: `Category ${index + 1}`,
    slug: "",
    href: "#",
    imageUrl: null,
  }));
}

export function createEmptyPromoBanners(count: number): HeroBannerItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `empty-promo-${index + 1}`,
    title: `Promo banner ${index + 1}`,
    subtitle: "Add banners in Admin → Marketing → Banners (HOME_PROMO)",
    imageUrl: null,
    mobileImageUrl: null,
    href: "#",
    displayOrder: index,
  }));
}

export function createEmptyTestimonials(count: number): StorefrontTestimonial[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `empty-testimonial-${index + 1}`,
    name: `Customer ${index + 1}`,
    city: "India",
    text: "Add featured testimonials in Admin → Marketing → Testimonials",
    imageUrl: null,
    rating: 0,
  }));
}

export function createEmptyFeatures(count: number): StorefrontFeature[] {
  return Array.from({ length: count }, (_, index) => ({
    label: `Feature ${index + 1}`,
    imageUrl: null,
  }));
}

function staticHomeFallback(): StorefrontHomeResponse {
  return {
    promoBanners: [
      {
        id: "static-promo-1",
        title: "Sign up offer",
        imageUrl: homeImages.promoHappy,
        mobileImageUrl: homeImages.promoHappy,
        href: "#",
        displayOrder: 0,
      },
      {
        id: "static-promo-2",
        title: "HDFC EMI",
        imageUrl: homeImages.promoHdfc,
        mobileImageUrl: homeImages.promoHdfc,
        href: "#",
        displayOrder: 1,
      },
    ],
    offerBar: null,
    features: features.map((item) => ({
      label: item.label,
      imageUrl: item.image,
    })),
    popularCategories: popularCategories.map((cat, index) => ({
      id: `static-pop-${index}`,
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
      href: cat.href || "#",
      imageUrl: cat.image,
    })),
    onlineExclusive: onlineExclusive.map((p) => ({
      id: p.id,
      name: p.name,
      imageUrl: p.image,
      price: p.price,
      mrp: p.mrp,
      badge: p.badge,
      discount: p.discount,
      href: "#",
    })),
    spotlight: spotlightItems.map((item, index) => ({
      id: `static-spot-${index}`,
      name: item.name,
      label: item.name,
      imageUrl: item.image,
      price: 0,
      mrp: 0,
      href: "#",
    })),
    bestSellers: bestSellers.map((p) => ({
      id: p.id,
      name: p.name,
      imageUrl: p.image,
      price: p.price,
      mrp: p.mrp,
      badge: p.badge,
      discount: p.discount,
      collection: p.collection,
      href: "#",
    })),
    newArrivals: newArrivals.map((p) => ({
      id: p.id,
      name: p.name,
      imageUrl: p.image,
      price: p.price,
      mrp: p.mrp,
      badge: p.badge,
      discount: p.discount,
      href: "#",
    })),
    decorCategories: decorCategories.map((cat, index) => ({
      id: `static-decor-${index}`,
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
      href: "#",
      imageUrl: cat.image,
    })),
    limitedDeals: limitedDeals.map((deal, index) => ({
      id: `static-deal-${index}`,
      name: deal.label,
      label: deal.label,
      imageUrl: deal.image,
      price: 0,
      mrp: 0,
      href: "#",
    })),
    testimonials: testimonials.map((t, index) => ({
      id: `static-testimonial-${index}`,
      name: t.name,
      city: t.city,
      text: t.text,
      imageUrl: null,
    })),
    seoContent: null,
    version: "static",
    cachedAt: null,
  };
}

function withEmptyProducts(items: StorefrontProduct[], count: number): ProductItem[] {
  if (items.length > 0) return items.map(mapStorefrontProduct);
  return createEmptyProducts(count);
}

function withEmptyCategories(
  items: StorefrontCategoryTile[],
  count: number,
): StorefrontCategoryTile[] {
  if (items.length > 0) return items;
  return createEmptyCategoryTiles(count);
}

export function resolveHomepageData(
  response: StorefrontHomeResponse | undefined,
  isError: boolean,
): StorefrontHomeResponse {
  if (!response || isError) {
    return {
      promoBanners: createEmptyPromoBanners(HOME_EMPTY_COUNTS.promoBanners),
      features: createEmptyFeatures(HOME_EMPTY_COUNTS.features),
      popularCategories: createEmptyCategoryTiles(HOME_EMPTY_COUNTS.popularCategories),
      onlineExclusive: withEmptyProducts([], HOME_EMPTY_COUNTS.onlineExclusive).map(
        (p) => ({
          id: p.id,
          name: p.name,
          imageUrl: null,
          price: 0,
          mrp: 0,
        }),
      ),
      spotlight: withEmptyProducts([], HOME_EMPTY_COUNTS.spotlight).map((p) => ({
        id: p.id,
        name: p.name,
        label: p.name,
        imageUrl: null,
        price: 0,
        mrp: 0,
      })),
      bestSellers: withEmptyProducts([], HOME_EMPTY_COUNTS.bestSellers).map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: null,
        price: 0,
        mrp: 0,
      })),
      newArrivals: withEmptyProducts([], HOME_EMPTY_COUNTS.newArrivals).map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: null,
        price: 0,
        mrp: 0,
      })),
      decorCategories: createEmptyCategoryTiles(HOME_EMPTY_COUNTS.decorCategories),
      limitedDeals: withEmptyProducts([], HOME_EMPTY_COUNTS.limitedDeals).map((p) => ({
        id: p.id,
        name: p.name,
        label: p.name,
        imageUrl: null,
        price: 0,
        mrp: 0,
      })),
      testimonials: createEmptyTestimonials(HOME_EMPTY_COUNTS.testimonials),
      version: "empty",
    };
  }

  return {
    ...response,
    promoBanners:
      response.promoBanners.length > 0
        ? response.promoBanners
        : createEmptyPromoBanners(HOME_EMPTY_COUNTS.promoBanners),
    features:
      response.features.length > 0
        ? response.features
        : createEmptyFeatures(HOME_EMPTY_COUNTS.features),
    popularCategories: withEmptyCategories(
      response.popularCategories,
      HOME_EMPTY_COUNTS.popularCategories,
    ),
    onlineExclusive:
      response.onlineExclusive.length > 0
        ? response.onlineExclusive
        : withEmptyProducts([], HOME_EMPTY_COUNTS.onlineExclusive).map((p) => ({
            id: p.id,
            name: p.name,
            imageUrl: null,
            price: 0,
            mrp: 0,
          })),
    spotlight:
      response.spotlight.length > 0
        ? response.spotlight
        : withEmptyProducts([], HOME_EMPTY_COUNTS.spotlight).map((p) => ({
            id: p.id,
            name: p.name,
            label: p.name,
            imageUrl: null,
            price: 0,
            mrp: 0,
          })),
    bestSellers:
      response.bestSellers.length > 0
        ? response.bestSellers
        : withEmptyProducts([], HOME_EMPTY_COUNTS.bestSellers).map((p) => ({
            id: p.id,
            name: p.name,
            imageUrl: null,
            price: 0,
            mrp: 0,
          })),
    newArrivals:
      response.newArrivals.length > 0
        ? response.newArrivals
        : withEmptyProducts([], HOME_EMPTY_COUNTS.newArrivals).map((p) => ({
            id: p.id,
            name: p.name,
            imageUrl: null,
            price: 0,
            mrp: 0,
          })),
    decorCategories: withEmptyCategories(
      response.decorCategories,
      HOME_EMPTY_COUNTS.decorCategories,
    ),
    limitedDeals:
      response.limitedDeals.length > 0
        ? response.limitedDeals
        : withEmptyProducts([], HOME_EMPTY_COUNTS.limitedDeals).map((p) => ({
            id: p.id,
            name: p.name,
            label: p.name,
            imageUrl: null,
            price: 0,
            mrp: 0,
          })),
    testimonials:
      response.testimonials.length > 0
        ? response.testimonials
        : createEmptyTestimonials(HOME_EMPTY_COUNTS.testimonials),
  };
}

export function getHomeProducts(
  data: StorefrontHomeResponse,
  key: "onlineExclusive" | "bestSellers" | "newArrivals" | "spotlight" | "limitedDeals",
): ProductItem[] {
  const items = data[key] as StorefrontProduct[];
  return items.map(mapStorefrontProduct);
}
