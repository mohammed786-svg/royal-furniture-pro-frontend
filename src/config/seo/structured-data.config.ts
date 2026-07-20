import { COMPANY_INFO } from "@/lib/constants/company-info";
import { siteConfig } from "./metadata.config";

export type JsonLd = Record<string, unknown>;

export const organizationSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logoSrc}`,
  email: COMPANY_INFO.email,
  telephone: COMPANY_INFO.phoneTel,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY_INFO.addressLine1} ${COMPANY_INFO.addressLine2}`,
    addressLocality: COMPANY_INFO.city,
    addressRegion: COMPANY_INFO.state,
    postalCode: COMPANY_INFO.pincode,
    addressCountry: "IN",
  },
  sameAs: [],
});

/** Local furniture store schema — helps “near me” and map-pack relevance. */
export const localBusinessSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": ["FurnitureStore", "LocalBusiness"],
  name: siteConfig.name,
  image: `${siteConfig.url}${siteConfig.logoSrc}`,
  url: siteConfig.url,
  telephone: COMPANY_INFO.phoneTel,
  email: COMPANY_INFO.email,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1st Cross, Azam Nagar",
    addressLocality: COMPANY_INFO.city,
    addressRegion: COMPANY_INFO.state,
    postalCode: COMPANY_INFO.pincode,
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 15.8497,
    longitude: 74.4977,
  },
  areaServed: [
    { "@type": "City", name: "Belagavi" },
    { "@type": "State", name: "Karnataka" },
    { "@type": "Country", name: "India" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
  ],
});

export const websiteSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logoSrc}`,
    },
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
  brand: { "@type": "Brand", name: siteConfig.name },
  offers: {
    "@type": "Offer",
    price: params.price,
    priceCurrency: params.currency ?? "INR",
    availability: "https://schema.org/InStock",
    url: siteConfig.url,
  },
});

export const blogPostingSchema = (params: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  keywords?: string[];
}): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: params.title,
  description: params.description,
  datePublished: params.publishedAt,
  dateModified: params.updatedAt,
  keywords: params.keywords?.join(", "),
  author: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logoSrc}`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/blog/${params.slug}`,
  },
  image: `${siteConfig.url}${siteConfig.logoSrc}`,
});

export const faqPageSchema = (
  faqs: { question: string; answer: string }[],
): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const breadcrumbSchema = (items: { name: string; path: string }[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${siteConfig.url}${item.path}`,
  })),
});
