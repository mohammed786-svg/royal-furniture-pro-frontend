import { siteConfig } from "./metadata.config";

export type JsonLd = Record<string, unknown>;

export const organizationSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
});

export const websiteSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const productSchema = (params: {
  name: string;
  description: string;
  sku: string;
  image: string;
  price: number;
  currency?: string;
}): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: params.name,
  description: params.description,
  sku: params.sku,
  image: params.image,
  offers: {
    "@type": "Offer",
    price: params.price,
    priceCurrency: params.currency ?? "INR",
    availability: "https://schema.org/InStock",
  },
});
