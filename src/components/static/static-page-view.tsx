"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { isRoyalCmsSlug, RoyalCmsPage } from "@/components/static/royal-cms-page";
import {
  STATIC_PAGES,
  type StaticBlock,
  type StaticPageSlug,
} from "@/lib/constants/static-page-data";

type StaticPageViewProps = {
  slug: StaticPageSlug;
};

export function StaticPageView({ slug }: StaticPageViewProps) {
  const config = STATIC_PAGES[slug];

  if (config.layout === "cms" || isRoyalCmsSlug(slug)) {
    return <RoyalCmsPage slug={slug} title={config.title} />;
  }

  const Icon = config.icon;
  const accent = config.accent ?? "gold";

  return (
    <main className={`static-page static-page--${accent}`}>
      <section className="static-hero">
        <div className="static-hero__mesh" aria-hidden />
        <div className="static-hero__particles" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="static-hero__particle"
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="static-hero__inner royal-section-inner">
          <CategoryBreadcrumbs
            items={[{ label: "Home", href: "/" }, { label: config.title }]}
          />
          <div className="static-hero__content">
            <div className="static-hero__icon-wrap">
              <Icon className="static-hero__icon" strokeWidth={1.5} />
            </div>
            <h1 className="static-hero__title">{config.title}</h1>
            <p className="static-hero__subtitle">{config.subtitle}</p>
            <div className="static-hero__crown-line" aria-hidden>
              <span>♛</span>
            </div>
          </div>
        </div>
      </section>

      <div className="static-body royal-section-inner">
        {config.blocks.map((block, index) => (
          <StaticBlockRenderer key={index} block={block} />
        ))}
      </div>
    </main>
  );
}

function StaticBlockRenderer({ block }: { block: StaticBlock }) {
  switch (block.type) {
    case "intro":
      return (
        <p className="static-intro">
          <span className="static-intro__mark" aria-hidden />
          {block.text}
        </p>
      );
    case "features":
      return (
        <div className="static-features">
          {block.items.map((item) => {
            const FIcon = item.icon;
            return (
              <div key={item.title} className="static-feature-card">
                <div className="static-feature-card__icon">
                  <FIcon className="h-6 w-6" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>
      );
    case "cards":
      return (
        <div className="static-cards">
          {block.items.map((item) => (
            <article key={item.title} className="static-glass-card">
              {item.tag && <span className="static-glass-card__tag">{item.tag}</span>}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      );
    case "prose":
      return (
        <div className="static-prose">
          {block.sections.map((sec, i) => (
            <section key={i}>
              {sec.heading && <h2>{sec.heading}</h2>}
              {sec.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      );
    case "stores":
      return (
        <div className="static-stores-grid">
          {block.cities.map((store) => (
            <article key={store.city} className="static-store-card">
              <div className="static-store-card__head">
                <h3>{store.city}</h3>
                <span className="static-store-card__count">{store.count} stores</span>
              </div>
              <p>{store.address}</p>
              <Link href="/contact" className="static-store-card__link">
                Get directions →
              </Link>
            </article>
          ))}
        </div>
      );
    case "faq":
      return <FaqAccordion items={block.items} />;
    case "timeline":
      return (
        <ol className="static-timeline">
          {block.items.map((item) => (
            <li key={item.year} className="static-timeline__item">
              <span className="static-timeline__year">{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "links":
      return (
        <ul className="static-sitemap-links">
          {block.items.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <span className="static-sitemap-links__label">{link.label}</span>
                {link.desc && (
                  <span className="static-sitemap-links__desc">{link.desc}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      );
    case "cta":
      return (
        <div className="static-cta">
          <div className="static-cta__glow" aria-hidden />
          <h2>{block.title}</h2>
          <p>{block.text}</p>
          <div className="static-cta__actions">
            <Link
              href={block.primary.href}
              className="static-cta__btn static-cta__btn--primary"
            >
              {block.primary.label}
            </Link>
            {block.secondary && (
              <Link
                href={block.secondary.href}
                className="static-cta__btn static-cta__btn--outline"
              >
                {block.secondary.label}
              </Link>
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
}

function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="static-faq">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={item.q}
            className={`static-faq__item${isOpen ? " static-faq__item--open" : ""}`}
          >
            <button
              type="button"
              className="static-faq__trigger"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span>{item.q}</span>
              <ChevronDown className="static-faq__chevron" />
            </button>
            <div className="static-faq__panel">
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
