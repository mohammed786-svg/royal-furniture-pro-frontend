/** URL slug for product detail pages */
export function productSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/royal furniture pro/gi, "royalfurniturepro")
    .replace(/royaloak/gi, "royaloak")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function productPageHref(slug: string): string {
  return `/product/${slug}`;
}
