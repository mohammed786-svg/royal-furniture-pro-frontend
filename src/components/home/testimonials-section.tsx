"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useHomepage } from "@/providers/homepage-provider";

export function TestimonialsSection() {
  const { data } = useHomepage();
  const testimonials = data.testimonials;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [testimonials.length]);

  const next = useCallback(() => {
    if (!testimonials.length) return;
    setIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    if (!testimonials.length) return;
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const t = testimonials[index];
  if (!t) return null;

  return (
    <section className="bg-[#1a2744] py-10 md:py-14">
      <div className="royal-section-inner">
        <div className="royal-section-heading !mb-8 md:!mb-10">
          <h2 className="royal-section-title royal-section-title--playfair royal-section-title--light">
            What Customers Say About Royal Furniture Pro
          </h2>
        </div>
        <div className="relative mx-auto max-w-4xl">
          <div className="rounded-lg bg-white/5 p-6 text-center md:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--royal-gold-brand)]/20">
              <Play className="h-6 w-6 fill-[var(--royal-gold-brand)] text-[var(--royal-gold-brand)]" />
            </div>
            <p className="mb-6 text-base leading-relaxed text-white/90 italic md:text-lg">
              &ldquo;{t.text}&rdquo;
            </p>
            <h3 className="text-xl font-semibold text-[var(--royal-gold-brand)]">
              {t.name}
            </h3>
            <p className="text-base text-white/70">{t.city}</p>
          </div>
          {testimonials.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="absolute top-1/2 -left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a2744] shadow md:-left-12"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="absolute top-1/2 -right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a2744] shadow md:-right-12"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="mt-6 flex justify-center gap-2">
                {testimonials.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition ${
                      i === index
                        ? "w-6 bg-[var(--royal-gold-brand)]"
                        : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
