import type { Metadata } from "next";

export const siteConfig = {
  name: "Royal Furniture Pro",
  description:
    "Buy furniture online at Royal Furniture Pro — international furniture, unbeatable prices. Sofas, beds, dining & more.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_IN",
  twitterHandle: "@royalfurniture",
  logoSrc: "/logos/royal_furniture_pro_logo.png",
  /** Square tab / PWA icons generated from logo */
  iconSrc: "/icon.png",
  appleIconSrc: "/apple-icon.png",
  faviconSrc: "/favicon.png",
} as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
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
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
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
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.logoSrc],
  },
};
