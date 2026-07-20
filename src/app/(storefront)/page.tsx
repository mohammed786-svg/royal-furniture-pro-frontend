import type { Metadata } from "next";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HomePageContent } from "@/components/home/home-page-content";
import { DEFAULT_SEO_TITLE, siteConfig } from "@/config/seo";
import { HomepageProvider } from "@/providers/homepage-provider";

export const metadata: Metadata = {
  title: {
    absolute: DEFAULT_SEO_TITLE,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: DEFAULT_SEO_TITLE,
    description: siteConfig.description,
    url: "/",
  },
};

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
