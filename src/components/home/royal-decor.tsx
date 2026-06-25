"use client";

import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import { useHomepage } from "@/providers/homepage-provider";

export function RoyalDecor() {
  const { data } = useHomepage();

  return (
    <section className="bg-[#f5f5f5] py-8 md:py-12">
      <div className="royal-section-inner">
        <div className="royal-section-heading">
          <h2 className="royal-section-title royal-section-title--playfair">
            Royal Decor
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8 md:gap-4">
          {data.decorCategories.map((cat) => (
            <Link key={cat.id} href={cat.href || "#"} className="group text-center">
              <div className="relative mb-2 aspect-square overflow-hidden rounded-sm bg-white">
                <MediaImage
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  fit="cover"
                  placeholderSize="sm"
                  showLabel
                  resolveUrl
                />
              </div>
              <span className="text-xs font-medium text-[#333] sm:text-sm">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
