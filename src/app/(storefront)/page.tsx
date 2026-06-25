import { HeroCarousel } from "@/components/home/hero-carousel";
import { HomePageContent } from "@/components/home/home-page-content";
import { HomepageProvider } from "@/providers/homepage-provider";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <HomepageProvider>
        <HomePageContent />
      </HomepageProvider>
    </>
  );
}
