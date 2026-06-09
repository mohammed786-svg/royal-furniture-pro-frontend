import Image from "next/image";
import { features } from "@/lib/constants/home";

export function FeaturesBar() {
  return (
    <section className="bg-[var(--royal-navy)] py-6 md:py-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-4 sm:grid-cols-3 md:grid-cols-5 md:gap-4 lg:px-6">
        {features.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <div className="relative mb-2 h-14 w-14 sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]">
              <Image
                src={item.image}
                alt={item.label}
                fill
                className="object-contain"
                sizes="72px"
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
