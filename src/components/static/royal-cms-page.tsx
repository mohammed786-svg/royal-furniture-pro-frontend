"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { ContactPageContent } from "@/components/static/contact-page-content";
import {
  ABOUT_STATS,
  ABOUT_STORY,
  ABOUT_VISION,
  POLICIES_HUB_SECTIONS,
  POLICY_QUICK_LINKS,
  PRIVACY_SECTIONS,
  ROYAL_ADDRESS,
  ROYAL_BRAND,
  ROYAL_PHONE_DISPLAY,
  ROYAL_PHONE_TEL,
} from "@/lib/constants/royal-cms-content";
import type { StaticPageSlug } from "@/lib/constants/static-page-data";

type RoyalCmsPageProps = {
  slug: StaticPageSlug;
  title: string;
};

const CMS_SLUGS = new Set<StaticPageSlug>([
  "about",
  "contact",
  "privacy-policy",
  "policies",
  "terms-and-conditions",
  "return-policy",
  "shipping-policy",
]);

export function isRoyalCmsSlug(slug: StaticPageSlug): boolean {
  return CMS_SLUGS.has(slug);
}

export function RoyalCmsPage({ slug, title }: RoyalCmsPageProps) {
  if (slug === "contact") {
    return <ContactPageContent />;
  }

  return (
    <main className="royal-cms-page">
      <div className="royal-cms-page__inner royal-section-inner">
        <CategoryBreadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />

        <h1 className="royal-cms-page__title">{title}</h1>

        {slug === "about" && <AboutContent />}
        {slug === "privacy-policy" && <PrivacyContent />}
        {slug === "policies" && <PoliciesHubContent />}
        {slug === "terms-and-conditions" && <TermsContent />}
        {slug === "return-policy" && <ReturnPolicyContent />}
        {slug === "shipping-policy" && <ShippingPolicyContent />}
      </div>
    </main>
  );
}

function AboutContent() {
  return (
    <div className="royal-cms-about">
      <section className="royal-cms-section royal-cms-section--center">
        <h2 className="royal-cms-h2">Furniture for real Indian homes</h2>
        <p className="royal-cms-lead">
          {ROYAL_BRAND} is a growing furniture brand with more than 8 stores across
          India. From sofas and beds to dining and storage, we help families choose
          pieces that look good, last longer, and fit everyday living — not just
          showroom photos.
        </p>
        <p className="royal-cms-body">
          Our flagship presence is in Belagavi (Belgaum), Karnataka — at{" "}
          {ROYAL_ADDRESS.lines.join(" ")} near Basaveshwar Temple, Azam Nagar. Walk in
          to compare finishes and seating comfort, or shop online and we&apos;ll deliver
          to your door.
        </p>
        <p className="royal-cms-body">
          Call us at{" "}
          <a href={ROYAL_PHONE_TEL} className="royal-cms-inline-link">
            {ROYAL_PHONE_DISPLAY}
          </a>{" "}
          or explore the catalogue on this website.
        </p>
      </section>

      <section className="royal-cms-section">
        <h3 className="royal-cms-h3">Vision</h3>
        <ul className="royal-cms-list">
          {ABOUT_VISION.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="royal-cms-stats">
        {ABOUT_STATS.map((stat) => (
          <article key={stat.value} className="royal-cms-stat">
            <h4 className="royal-cms-stat__value">{stat.value}</h4>
            <p className="royal-cms-stat__label">{stat.label}</p>
          </article>
        ))}
      </div>

      <section className="royal-cms-section">
        <h2 className="royal-cms-h2 royal-cms-h2--center">Our story</h2>
        <div className="royal-cms-story">
          {ABOUT_STORY.map((era) => (
            <article key={era.period} className="royal-cms-story__era">
              <div className="royal-cms-story__year">{era.title}</div>
              <ul className="royal-cms-list">
                {era.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="royal-cms-section royal-cms-section--center">
        <h2 className="royal-cms-h2">Visit us</h2>
        <p className="royal-cms-body">
          <strong>{ROYAL_BRAND}</strong>
          <br />
          {ROYAL_ADDRESS.lines[0]}
          <br />
          {ROYAL_ADDRESS.lines[1]}
          <br />
          Near Basaveshwar Temple, Azam Nagar, Belagavi
        </p>
        <p className="royal-cms-body royal-cms-muted">
          <Link href="/contact" className="royal-cms-inline-link">
            Contact us
          </Link>
          {" · "}
          <Link href="/stores" className="royal-cms-inline-link">
            Our stores
          </Link>
        </p>
      </section>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="royal-cms-prose">
      {PRIVACY_SECTIONS.map((section) => (
        <section key={section.heading} className="royal-cms-prose__block">
          <h4 className="royal-cms-h4">{section.heading}</h4>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="royal-cms-body">
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

function PoliciesHubContent() {
  const [openId, setOpenId] = useState<string | null>("delivery");

  return (
    <div className="royal-cms-policies">
      <nav className="royal-cms-policy-nav" aria-label="Related policies">
        {POLICY_QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="royal-cms-policy-nav__link">
            {link.label}
          </Link>
        ))}
      </nav>

      {POLICIES_HUB_SECTIONS.map((section) => {
        const isOpen = openId === section.id;
        return (
          <section key={section.id} id={section.id} className="royal-cms-policy-block">
            <button
              type="button"
              className="royal-cms-policy-block__head"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : section.id)}
            >
              <h2 className="royal-cms-h4">{section.title}</h2>
              <span className="royal-cms-policy-block__toggle">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="royal-cms-prose royal-cms-prose--nested">
                {section.blocks.map((block, i) => (
                  <div key={i} className="royal-cms-prose__block">
                    {block.heading && <h4 className="royal-cms-h4">{block.heading}</h4>}
                    {block.paragraphs?.map((p) => (
                      <p key={p.slice(0, 30)} className="royal-cms-body">
                        {p}
                      </p>
                    ))}
                    {block.list && (
                      <ul className="royal-cms-list">
                        {block.list.map((item) => (
                          <li key={item.slice(0, 30)}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function TermsContent() {
  return (
    <div className="royal-cms-prose">
      <p className="royal-cms-body">
        By using the {ROYAL_BRAND} website you agree to these terms. Prices, offers, and
        availability may change without notice.
      </p>
      <section className="royal-cms-prose__block">
        <h4 className="royal-cms-h4">Orders &amp; payments</h4>
        <p className="royal-cms-body">
          Orders are confirmed after payment verification. Bank/UPI payments require
          valid reference numbers and proof upload at checkout.
        </p>
      </section>
      <section className="royal-cms-prose__block">
        <h4 className="royal-cms-h4">Warranty</h4>
        <p className="royal-cms-body">
          Manufacturing defects are covered as per product warranty cards. Normal wear,
          misuse, and unauthorised modifications are excluded.
        </p>
      </section>
      <p className="royal-cms-body royal-cms-muted">
        See also{" "}
        <Link href="/policies" className="royal-cms-inline-link">
          Policies
        </Link>
        ,{" "}
        <Link href="/privacy-policy" className="royal-cms-inline-link">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

function ReturnPolicyContent() {
  const section = POLICIES_HUB_SECTIONS.find((s) => s.id === "returns");
  if (!section) return null;
  return <PolicySectionBody section={section} />;
}

function ShippingPolicyContent() {
  const section = POLICIES_HUB_SECTIONS.find((s) => s.id === "delivery");
  if (!section) return null;
  return <PolicySectionBody section={section} />;
}

function PolicySectionBody({
  section,
}: {
  section: (typeof POLICIES_HUB_SECTIONS)[number];
}) {
  return (
    <div className="royal-cms-prose">
      <p className="royal-cms-body royal-cms-muted">
        <Link href="/policies" className="royal-cms-inline-link">
          ← All policies
        </Link>
      </p>
      {section.blocks.map((block, i) => (
        <div key={i} className="royal-cms-prose__block">
          {block.heading && <h4 className="royal-cms-h4">{block.heading}</h4>}
          {block.paragraphs?.map((p) => (
            <p key={p.slice(0, 30)} className="royal-cms-body">
              {p}
            </p>
          ))}
          {block.list && (
            <ul className="royal-cms-list">
              {block.list.map((item) => (
                <li key={item.slice(0, 30)}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
