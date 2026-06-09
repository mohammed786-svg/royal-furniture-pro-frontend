/** Label → URL map for utility bar, footer, and internal links */

export const SITE_PAGE_HREFS: Record<string, string> = {
  "Track Order": "/track-order",
  "Royal Furniture Stores": "/stores",
  "Franchise Enquiry": "/franchise",
  "About Us": "/about",
  "Customer Support": "/customer-support",
  Careers: "/careers",
  Policies: "/policies",
  "Privacy Policy": "/privacy-policy",
  "Terms & Conditions": "/terms-and-conditions",
  "Return Policy": "/return-policy",
  "Shipping Policy": "/shipping-policy",
  "Contact Us": "/contact",
  FAQs: "/faqs",
  Blog: "/blog",
  Media: "/media",
  Sitemap: "/site-map",
  "Coming Soon": "/coming-soon",
  Living: "/living",
  Bedroom: "/bedroom",
  Dining: "/dining",
  "Study & Office": "/study-office",
  Outdoor: "/outdoor",
  Decor: "/decor",
};

export function siteHref(label: string): string {
  return SITE_PAGE_HREFS[label] ?? "#";
}

export const topUtilityLinks = [
  { label: "Track Order", href: "/track-order" },
  { label: "Royal Furniture Stores", href: "/stores" },
  { label: "Franchise Enquiry", href: "/franchise" },
  { label: "About Us", href: "/about" },
  { label: "Customer Support", href: "/customer-support" },
  { label: "Careers", href: "/careers" },
] as const;
