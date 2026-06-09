"use client";

import { useEffect, useState } from "react";
import { bankLogos } from "@/lib/constants/home";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function OfferBar() {
  const [time, setTime] = useState({ h: 3, m: 34, s: 3 });

  useEffect(() => {
    const end = Date.now() + 3 * 3600 * 1000 + 34 * 60 * 1000 + 3 * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-y border-[#e0d8cc] bg-[var(--royal-cream-bar)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-6 lg:py-3">
        {/* Countdown */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold tracking-wide text-[var(--royal-navy)] uppercase sm:text-sm">
            Limited Time Deal:
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <TimeBox value={pad(time.h)} unit="Hrs" />
            <TimeBox value={pad(time.m)} unit="Mins" />
            <TimeBox value={pad(time.s)} unit="Secs" />
          </div>
        </div>

        {/* Jumbo offer */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="rounded-full bg-[var(--royal-red-badge)] px-3 py-1 text-[10px] font-bold tracking-wide text-white uppercase sm:text-xs">
            Jumbo Offer
          </span>
          <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--royal-gold-brand)] sm:text-2xl">
            Flat 70% OFF
          </span>
        </div>

        {/* EMI */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-semibold tracking-wide text-[var(--royal-navy)] uppercase sm:text-xs">
              No Cost EMI Available On
            </p>
            <p className="text-xs font-bold text-[var(--royal-navy)] sm:text-sm">
              Credit Cards
            </p>
            <p className="text-[9px] text-[var(--royal-navy)]/70">
              [3 & 6 Months Only]
            </p>
          </div>
          <div className="flex items-center gap-2">
            {bankLogos.map((bank) => (
              <div
                key={bank.name}
                className="flex h-8 w-14 items-center justify-center rounded bg-white px-1 shadow-sm sm:h-9 sm:w-16"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bank.src}
                  alt={bank.name}
                  className="h-5 w-auto max-w-full object-contain sm:h-6"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-[var(--royal-navy)]/60 lg:text-right">
          *T&C Min Purchase Of ₹5,000
        </p>
      </div>
    </section>
  );
}

function TimeBox({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-9 min-w-[42px] items-center justify-center rounded bg-white px-2 text-lg font-bold text-[var(--royal-navy)] shadow-sm sm:h-10 sm:min-w-[48px]">
        {value}
      </span>
      <span className="mt-0.5 text-[9px] font-medium text-[var(--royal-navy)]/70">
        {unit}
      </span>
    </div>
  );
}
