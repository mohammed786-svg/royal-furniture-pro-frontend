"use client";

import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import { useHomepage } from "@/providers/homepage-provider";

export function LimitedDeals() {
  const { data } = useHomepage();

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="royal-section-inner">
        <div className="royal-section-heading">
          <h2 className="royal-section-title royal-section-title--playfair">
            Limited Time Deals
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {data.limitedDeals.map((deal) => (
            <Link
              key={deal.id}
              href={deal.href || "#"}
              className="group relative overflow-hidden rounded-sm"
            >
              <div className="relative aspect-[268/350] w-full">
                <MediaImage
                  src={deal.imageUrl}
                  alt={deal.label || deal.name}
                  fill
                  fit="cover"
                  placeholderSize="md"
                  showLabel
                  resolveUrl
                />
              </div>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-[#f5c518] px-3 py-1 text-xs font-bold text-[#1a2744] uppercase">
                Shop Now
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
