import Image from "next/image";
import Link from "next/link";
import { CDN } from "@/lib/constants/home-data";

export function ShopByCelebrity() {
  return (
    <section className="bg-[#f5f5f5] py-6 md:py-8">
      <div className="royal-section-inner">
        <div className="royal-section-heading !mb-4 md:!mb-5">
          <h2 className="royal-section-title royal-section-title--playfair">
            Shop by Celebrity
          </h2>
        </div>
        <Link href="#" className="relative block overflow-hidden rounded-sm">
          <div className="relative aspect-[16/4] w-full md:aspect-[16/3]">
            <Image
              src={`${CDN}/media/wysiwyg/celebrity.jpg`}
              alt="Shop by Celebrity"
              fill
              className="hidden object-cover object-center md:block"
              sizes="1400px"
            />
            <Image
              src={`${CDN}/media/wysiwyg/mobile-celebrity.webp`}
              alt="Shop by Celebrity"
              fill
              className="object-cover object-center md:hidden"
              sizes="100vw"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
