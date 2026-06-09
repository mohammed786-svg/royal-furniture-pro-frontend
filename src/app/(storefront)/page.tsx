import { FeaturesBar } from "@/components/home/features-bar";
import { HeroCarousel } from "@/components/home/hero-carousel";
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
import { bestSellers, newArrivals, onlineExclusive } from "@/lib/constants/home-data";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <main>
        <OfferBar />
        <FeaturesBar />
        <PromoBanner />
        <PopularCategories />
        <OnlineExclusiveSection products={onlineExclusive} />
        <ShopByCelebrity />
        <SpotlightSection />
        <InternationalCollection />
        <StoresSection />
        <ProductGridSection title="Best Sellers" products={bestSellers} />
        <ProductGridSection
          title="New Arrivals"
          products={newArrivals}
          bgClassName="bg-[#f5f5f5]"
        />
        <RoyalDecor />
        <LimitedDeals />
        <TestimonialsSection />
        <SeoContent />
      </main>
    </>
  );
}
