import Image from "next/image";
import Link from "next/link";
import { spotlightItems } from "@/lib/constants/home-data";

export function SpotlightSection() {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="royal-section-inner">
        <div className="royal-section-heading">
          <h2 className="royal-section-title royal-section-title--playfair">
            In the Spotlight
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {spotlightItems.map((item) => (
            <Link
              key={item.name}
              href="#"
              className="group overflow-hidden rounded-sm border border-gray-100 bg-[#f8f8f8]"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="200px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <span className="text-sm font-semibold text-white md:text-[15px]">
                    {item.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
