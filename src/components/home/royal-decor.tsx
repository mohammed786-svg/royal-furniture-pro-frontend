import Image from "next/image";
import Link from "next/link";
import { decorCategories } from "@/lib/constants/home-data";

export function RoyalDecor() {
  return (
    <section className="bg-[#f5f5f5] py-8 md:py-12">
      <div className="royal-section-inner">
        <div className="royal-section-heading">
          <h2 className="royal-section-title royal-section-title--playfair">
            Royal Decor
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8 md:gap-4">
          {decorCategories.map((cat) => (
            <Link key={cat.name} href="#" className="group text-center">
              <div className="relative mb-2 aspect-square overflow-hidden rounded-sm bg-white">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="150px"
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
