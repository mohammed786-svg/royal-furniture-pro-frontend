"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/constants/home-data";

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 50;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  const slide = heroSlides[index];

  const goTo = useCallback((i: number) => {
    setIndex((i + heroSlides.length) % heroSlides.length);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    if (diff > 0) next();
    else prev();
  };

  if (!slide) return null;

  return (
    <section
      className="relative w-full shrink-0 overflow-hidden bg-[#e8e8e8]"
      aria-roledescription="carousel"
      aria-label="Homepage promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full">
        <Link href={slide.href ?? "#"} className="block w-full">
          <picture>
            <source media="(min-width: 768px)" srcSet={slide.desktop} />
            <img
              src={slide.mobile}
              alt={slide.alt}
              width={1305}
              height={500}
              decoding="async"
              loading="eager"
              className="block w-full h-auto max-h-[500px] object-cover object-center"
            />
          </picture>
        </Link>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute top-1/2 left-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-[#333] shadow-md transition hover:scale-105 sm:left-4 sm:h-12 sm:w-12"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute top-1/2 right-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-[#333] shadow-md transition hover:scale-105 sm:right-4 sm:h-12 sm:w-12"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        </button>

        <div
          className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-4"
          role="tablist"
          aria-label="Slide pagination"
        >
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === index
                  ? "h-2.5 w-2.5 bg-white shadow-sm ring-2 ring-white/50"
                  : "h-2 w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
