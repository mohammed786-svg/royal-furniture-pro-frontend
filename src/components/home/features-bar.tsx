"use client";

import { useEffect, useState } from "react";
import {
  BadgeIndianRupee,
  CreditCard,
  Globe2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

type FeatureItem = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

/** Anchor date for the live customer counter (starts at 2000+). */
const CUSTOMER_COUNT_START_MS = Date.UTC(2026, 6, 20); // 20 Jul 2026
const CUSTOMER_BASE_COUNT = 2000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export function getLiveCustomerCount(nowMs: number = Date.now()): number {
  const elapsed = Math.max(0, nowMs - CUSTOMER_COUNT_START_MS);
  const steps = Math.floor(elapsed / THREE_DAYS_MS);
  return CUSTOMER_BASE_COUNT + steps;
}

function formatCustomerLabel(count: number): string {
  return `${count.toLocaleString("en-IN")}+ Customers`;
}

export function FeaturesBar() {
  const [customerCount, setCustomerCount] = useState(() => getLiveCustomerCount());

  useEffect(() => {
    setCustomerCount(getLiveCustomerCount());
    const id = window.setInterval(
      () => {
        setCustomerCount(getLiveCustomerCount());
      },
      60 * 60 * 1000,
    );
    return () => window.clearInterval(id);
  }, []);

  const items: FeatureItem[] = [
    {
      id: "customers",
      Icon: Users,
      label: formatCustomerLabel(customerCount),
    },
    {
      id: "international",
      Icon: Globe2,
      label: "International Furniture",
    },
    {
      id: "price",
      Icon: BadgeIndianRupee,
      label: "Unbeatable Price",
    },
    {
      id: "secure",
      Icon: ShieldCheck,
      label: "100% Secure Payment",
    },
    {
      id: "emi",
      Icon: CreditCard,
      label: "No Cost EMI",
    },
  ];

  return (
    <section className="bg-[var(--royal-navy)] py-6 md:py-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-4 sm:grid-cols-3 md:grid-cols-5 md:gap-4 lg:px-6">
        {items.map((item) => {
          const Icon = item.Icon;
          return (
            <div
              key={item.id}
              className="flex flex-col items-center gap-2.5 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[var(--royal-gold-brand)] sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]">
                <Icon
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                  strokeWidth={1.6}
                  aria-hidden
                />
              </span>
              <span className="text-[11px] leading-snug font-medium text-white/90 sm:text-xs">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
