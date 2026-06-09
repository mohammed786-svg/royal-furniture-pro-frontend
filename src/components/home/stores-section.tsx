import Image from "next/image";
import Link from "next/link";
import { storeLocations } from "@/lib/constants/home-data";

export function StoresSection() {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="royal-section-inner">
        <div className="royal-section-heading">
          <h2 className="royal-section-title royal-section-title--playfair">
            200+ Stores Across India
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
          {storeLocations.map((store) => (
            <Link
              key={store.name}
              href="#"
              className="group overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="300px"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-[15px] font-semibold text-[#1a2744]">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {store.stores} store{store.stores !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="#" className="royal-section-btn royal-section-btn--outline px-8">
            Explore All Stores
          </Link>
        </div>
      </div>
    </section>
  );
}
