import type { Metadata } from "next";
import { StaticPageView } from "@/components/static/static-page-view";
import { STATIC_PAGES, type StaticPageSlug } from "@/lib/constants/static-page-data";

export function staticPageMetadata(slug: StaticPageSlug): Metadata {
  const config = STATIC_PAGES[slug];
  return {
    title: `${config.title} | Royal Furniture Pro`,
    description: config.subtitle,
  };
}

export function StaticPageRoute({ slug }: { slug: StaticPageSlug }) {
  return <StaticPageView slug={slug} />;
}
