"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductItem } from "@/lib/constants/home-data";
import { ExclusiveProductCard } from "./exclusive-product-card";

type OnlineExclusiveSectionProps = {
  products: ProductItem[];
  viewAllHref?: string;
};

export function OnlineExclusiveSection({
  products,
  viewAllHref,
}: OnlineExclusiveSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, products.length]);

  const scroll = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-exclusive-card]");
    const step = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
    window.setTimeout(updateScrollState, 350);
  };

  return (
    <section className="bg-white py-7 md:py-9">
      <div className="royal-section-inner">
        <div className="royal-section-heading">
          <h2 className="royal-section-title text-black">Online Exclusive</h2>
        </div>

        <div className="relative">
          {/* Left arrow — overlaps first card like Royal Oak */}
          <button
            type="button"
            aria-label="Previous products"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute top-[calc(50%-28px)] left-0 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#333] shadow-[0_1px_4px_rgba(0,0,0,0.12)] transition md:flex ${
              canScrollLeft
                ? "cursor-pointer hover:scale-105"
                : "cursor-default opacity-40"
            }`}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <button
            type="button"
            aria-label="Next products"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute top-[calc(50%-28px)] right-0 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#333] shadow-[0_1px_4px_rgba(0,0,0,0.12)] transition md:flex ${
              canScrollRight
                ? "cursor-pointer hover:scale-105"
                : "cursor-default opacity-40"
            }`}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div
            ref={trackRef}
            onScroll={updateScrollState}
            className="flex gap-4 overflow-x-auto scroll-smooth pr-1 pl-0 [-ms-overflow-style:none] [scrollbar-width:none] md:pl-11 md:pr-11 [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <div
                key={product.id}
                data-exclusive-card
                className="w-[calc(50%-8px)] min-w-[calc(50%-8px)] shrink-0 sm:w-[calc(33.333%-11px)] sm:min-w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] lg:min-w-[calc(25%-12px)]"
              >
                <ExclusiveProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {viewAllHref ? (
          <div className="mt-7 flex justify-center md:mt-8">
            <Link
              href={viewAllHref}
              className="royal-section-btn royal-section-btn--primary min-w-[140px] px-14"
            >
              View All
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
