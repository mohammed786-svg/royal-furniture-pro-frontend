import type { Metadata } from "next";

export const siteConfig = {
  name: "Royal Furniture Pro",
  description:
    "Royal Furniture Pro — best furniture store in Belagavi. Buy sofas, beds, dining & office furniture online in India. Furniture near me with showroom support, delivery & GST billing.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://royalfurniturepro.azdeploy.com",
  locale: "en_IN",
  twitterHandle: "@royalfurniture",
  logoSrc: "/logos/royal_furniture_pro_logo.png",
  /** Square tab / PWA icons generated from logo */
  iconSrc: "/icon.png",
  appleIconSrc: "/apple-icon.png",
  faviconSrc: "/favicon.png",
} as const;

/** SERP-style default title — mirrors strong furniture brand listings */
export const DEFAULT_SEO_TITLE =
  "Royal Furniture Pro | Buy Furniture Online in India | Belagavi Store";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: DEFAULT_SEO_TITLE,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Royal Furniture Pro",
    "furniture near me",
    "best furniture store near me",
    "furniture store Belagavi",
    "furniture Belgaum",
    "buy furniture online India",
    "sofa store near me",
    "bedroom furniture Belagavi",
    "dining furniture",
    "office chairs Belagavi",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: siteConfig.faviconSrc, sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: siteConfig.appleIconSrc, sizes: "180x180", type: "image/png" }],
    shortcut: siteConfig.faviconSrc,
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: DEFAULT_SEO_TITLE,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.logoSrc,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO_TITLE,
    description: siteConfig.description,
    images: [siteConfig.logoSrc],
  },
  category: "shopping",
};
