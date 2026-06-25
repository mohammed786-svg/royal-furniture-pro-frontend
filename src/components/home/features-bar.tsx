"use client";

import { MediaImage } from "@/components/ui/media-image";
import { features as staticFeatures } from "@/lib/constants/home";
import { useHomepage } from "@/providers/homepage-provider";

export function FeaturesBar() {
  const { data } = useHomepage();
  const isPlaceholderFeatures = data.features.every((item) =>
    /^Feature \d+$/.test(item.label),
  );
  const items = isPlaceholderFeatures
    ? staticFeatures.map((item) => ({ label: item.label, imageUrl: item.image }))
    : data.features.length > 0
      ? data.features
      : staticFeatures.map((item) => ({ label: item.label, imageUrl: item.image }));

  return (
    <section className="bg-[var(--royal-navy)] py-6 md:py-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-4 sm:grid-cols-3 md:grid-cols-5 md:gap-4 lg:px-6">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mb-2 h-14 w-14 sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]">
              <MediaImage
                src={item.imageUrl}
                alt={item.label}
                fill
                fit="contain"
                placeholderSize="sm"
                resolveUrl
              />
            </div>
            <span className="text-[11px] leading-snug font-medium text-white/90 sm:text-xs">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
