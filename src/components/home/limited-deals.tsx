import Image from "next/image";
import Link from "next/link";
import { limitedDeals } from "@/lib/constants/home-data";

export function LimitedDeals() {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="royal-section-inner">
        <div className="royal-section-heading">
          <h2 className="royal-section-title royal-section-title--playfair">
            Limited Time Deals
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {limitedDeals.map((deal) => (
            <Link
              key={deal.label}
              href="#"
              className="group relative overflow-hidden rounded-sm"
            >
              <div className="relative aspect-[268/350] w-full">
                <Image
                  src={deal.image}
                  alt={deal.label}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="200px"
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
