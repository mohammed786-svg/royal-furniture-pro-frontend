import Image from "next/image";
import Link from "next/link";
import { internationalBrands } from "@/lib/constants/home-data";

export function InternationalCollection() {
  return (
    <section className="bg-[#f5f5f5] py-8 md:py-12">
      <div className="royal-section-inner">
        <div className="royal-section-heading">
          <h2 className="royal-section-title royal-section-title--playfair">
            Go Around The World With Royal Furniture Pro
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {internationalBrands.map((brand) => (
            <Link
              key={brand.name}
              href="#"
              className="flex flex-col items-center rounded-sm bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="relative mb-3 h-16 w-16 md:h-20 md:w-20">
                <Image
                  src={brand.flag}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <span className="text-center text-sm font-semibold text-[#1a2744] md:text-[15px]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
