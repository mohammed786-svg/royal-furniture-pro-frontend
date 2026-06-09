import Image from "next/image";
import { features } from "@/lib/constants/home";

export function ProductTrustBar() {
  return (
    <section className="product-trust-bar" aria-label="Store benefits">
      <div className="product-trust-bar__inner">
        {features.map((item) => (
          <div key={item.label} className="product-trust-bar__item">
            <div className="product-trust-bar__icon">
              <Image
                src={item.image}
                alt=""
                fill
                className="object-contain"
                sizes="64px"
                unoptimized
              />
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
