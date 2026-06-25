"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/seo/metadata.config";
import { footerColumns, paymentIcons } from "@/lib/constants/home-data";
import { primaryNavCategoryHref } from "@/lib/routes/category";
import { siteHref } from "@/lib/routes/site-pages";

export function StorefrontFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="storefront-footer bg-white text-gray-600">
      {/* Newsletter */}
      <div className="border-b border-gray-200 bg-gray-50 py-10">
        <div className="mx-auto max-w-[1400px] px-4 text-center lg:px-6">
          <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-xl text-[var(--royal-navy)] md:text-2xl">
            Subscribe to our newsletter
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Be the first to know about new arrivals, sales & promos
          </p>
          <form
            className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm text-[var(--royal-navy)] placeholder:text-gray-400 focus:border-[var(--royal-gold-brand)] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-sm bg-[var(--royal-gold-brand)] px-6 py-2.5 text-sm font-bold tracking-wide text-[var(--royal-navy)] uppercase hover:bg-[#e6b800]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-10 lg:px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="storefront-footer-logo-link">
            <img
              src={siteConfig.logoSrc}
              alt={siteConfig.name}
              className="storefront-footer-logo__image"
              width={540}
              height={462}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            International Furniture, Unbeatable Price
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-4 lg:grid-cols-5">
          <FooterCol title="Company" links={footerColumns.company} />
          <FooterCol title="Policies" links={footerColumns.policies} />
          <FooterCol title="Help" links={footerColumns.help} />
          <FooterCol
            title="Categories"
            links={footerColumns.categories}
            categoryLinks
          />
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="mb-3 text-xs font-bold tracking-wider text-[var(--royal-navy)] uppercase">
              Payment Methods
            </h3>
            <div className="flex flex-wrap gap-2">
              {paymentIcons.map((p) => (
                <div
                  key={p.name}
                  className="relative h-8 w-12 rounded border border-gray-200 bg-white p-1"
                >
                  <Image
                    src={p.src}
                    alt={p.name}
                    fill
                    className="object-contain p-0.5"
                    sizes="48px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Royal Furniture Pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  categoryLinks,
}: {
  title: string;
  links: string[];
  categoryLinks?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold tracking-wider text-[var(--royal-navy)] uppercase">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((l) => {
          const href = categoryLinks ? primaryNavCategoryHref(l) : siteHref(l);
          return (
            <li key={l}>
              <Link
                href={href}
                className="text-gray-600 transition-colors hover:text-[var(--royal-gold-brand)]"
              >
                {l}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
