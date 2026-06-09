import type { Metadata } from "next";
import { siteConfig } from "./metadata.config";

export type OpenGraphParams = {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
};

export function buildOpenGraphMetadata(params: OpenGraphParams): Metadata["openGraph"] {
  return {
    title: params.title,
    description: params.description ?? siteConfig.description,
    url: params.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: params.type ?? "website",
    images: params.image
      ? [{ url: params.image, width: 1200, height: 630, alt: params.title }]
      : undefined,
  };
}
