import type { Metadata } from "next";

export const siteConfig = {
  name: "Royal Furniture Pro",
  description:
    "Buy furniture online at Royal Furniture Pro — international furniture, unbeatable prices. Sofas, beds, dining & more.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_IN",
  twitterHandle: "@royalfurniture",
  logoSrc: "/logos/royal_furniture_pro_logo.png",
} as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};
