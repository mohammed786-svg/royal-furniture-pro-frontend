"use client";

import Link from "next/link";
import { HeroBannerSlide } from "@/components/home/hero-banner-slide";
import { useHomepage } from "@/providers/homepage-provider";
import type { HeroBannerItem } from "@/types/hero-banners";

function toSlide(banner: HeroBannerItem) {
  return {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    desktopImageUrl: banner.imageUrl ?? null,
    mobileImageUrl: banner.mobileImageUrl ?? banner.imageUrl ?? null,
    href: banner.href || "#",
    isEmpty: banner.id.startsWith("empty-"),
  };
}

export function PromoBanner() {
  const { data } = useHomepage();

  return (
    <section className="w-full shrink-0 bg-white">
      {data.promoBanners.map((banner) => (
        <HeroBannerSlide key={banner.id} slide={toSlide(banner)} />
      ))}
    </section>
  );
}
