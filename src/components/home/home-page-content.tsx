"use client";

import { FeaturesBar } from "@/components/home/features-bar";
import { InternationalCollection } from "@/components/home/international-collection";
import { LimitedDeals } from "@/components/home/limited-deals";
import { OfferBar } from "@/components/home/offer-bar";
import { OnlineExclusiveSection } from "@/components/home/online-exclusive-section";
import { PopularCategories } from "@/components/home/popular-categories";
import { ProductGridSection } from "@/components/home/product-grid-section";
import { PromoBanner } from "@/components/home/promo-banner";
import { RoyalDecor } from "@/components/home/royal-decor";
import { SeoContent } from "@/components/home/seo-content";
import { ShopByCelebrity } from "@/components/home/shop-by-celebrity";
import { SpotlightSection } from "@/components/home/spotlight-section";
import { StoresSection } from "@/components/home/stores-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { homepageSectionVisibility } from "@/config/homepage-sections";
import { getHomeProducts } from "@/lib/home/homepage-utils";
import { useHomepage } from "@/providers/homepage-provider";

export function HomePageContent() {
  const { data } = useHomepage();

  return (
    <main>
      <OfferBar />
      <FeaturesBar />
      <PromoBanner />
      <PopularCategories />
      <OnlineExclusiveSection products={getHomeProducts(data, "onlineExclusive")} />
      {homepageSectionVisibility.shopByCelebrity ? <ShopByCelebrity /> : null}
      <SpotlightSection />
      {homepageSectionVisibility.internationalCollection ? (
        <InternationalCollection />
      ) : null}
      {homepageSectionVisibility.storesSection ? <StoresSection /> : null}
      <ProductGridSection
        title="Best Sellers"
        products={getHomeProducts(data, "bestSellers")}
      />
      <ProductGridSection
        title="New Arrivals"
        products={getHomeProducts(data, "newArrivals")}
        bgClassName="bg-[#f5f5f5]"
      />
      <RoyalDecor />
      <LimitedDeals />
      <TestimonialsSection />
      <SeoContent />
    </main>
  );
}
