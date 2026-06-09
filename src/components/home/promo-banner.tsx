import Link from "next/link";
import { homeImages } from "@/lib/constants/home";

export function PromoBanner() {
  return (
    <section className="w-full shrink-0 bg-white">
      <Link href="#" className="block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={homeImages.promoHappy}
          alt="Sign up today get 500 off - Use code HAPPY"
          width={1920}
          height={600}
          loading="lazy"
          className="block w-full h-auto object-cover object-center"
        />
      </Link>
      <Link href="#" className="block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={homeImages.promoHdfc}
          alt="HDFC Bank No Cost EMI Offer"
          width={1920}
          height={360}
          loading="lazy"
          className="block w-full h-auto object-cover object-center"
        />
      </Link>
    </section>
  );
}
