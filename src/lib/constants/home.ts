/** Homepage content & assets (sourced from royaloakindia.com reference) */

export const ROYAL_OAK_CDN = "https://www.royaloakindia.com";

export const homeImages = {
  hero: {
    desktop:
      "https://www.royaloakindia.com/media/wysiwyg/200_store-website-banner-desktop.jpg",
    mobile: "https://www.royaloakindia.com/media/wysiwyg/200-stores-m.webp",
  },
  heroSlides: [
    {
      desktop:
        "https://www.royaloakindia.com/media/wysiwyg/200_store-website-banner-desktop.jpg",
      mobile: "https://www.royaloakindia.com/media/wysiwyg/200-stores-m.webp",
      title: "200+ STORES ACROSS INDIA & UAE",
      subtitle: "INTERNATIONAL FURNITURE, UNBEATABLE PRICE",
    },
    {
      desktop: "https://www.royaloakindia.com/media/wysiwyg/jumbo-sale-desktop.webp",
      mobile: "https://www.royaloakindia.com/media/wysiwyg/Website_banner_418x302.webp",
      title: "JUMBO SALE",
      subtitle: "FLAT 70% OFF ON SELECTED RANGE",
    },
    {
      desktop:
        "https://www.royaloakindia.com/media/wysiwyg/exchange-offer-desktop.webp",
      mobile: "https://www.royaloakindia.com/media/wysiwyg/EXCHANGE-M.webp",
      title: "EXCHANGE OFFER",
      subtitle: "UPGRADE YOUR HOME FOR LESS",
    },
  ],
  features: {
    customers: `${ROYAL_OAK_CDN}/media/royaloakindia/10m_customers.png`,
    international: `${ROYAL_OAK_CDN}/media/royaloakindia/international_furniture.png`,
    price: `${ROYAL_OAK_CDN}/media/royaloakindia/Unbeatable_price.png`,
    secure: `${ROYAL_OAK_CDN}/media/royaloakindia/secure_payment.png`,
    emi: `${ROYAL_OAK_CDN}/media/royaloakindia/no_cost_emi.png`,
  },
  promoHappy: "/images/home/promo/happy-500.jpg",
  promoHdfc: "/images/home/promo/hdfc-bank.webp",
  categories: [],
} as const;

const CAT_IMG = "/images/home/categories";

/** Popular Categories — 12 items, local images for reliable loading */
export const popularCategories = [
  { name: "Recliner", image: `${CAT_IMG}/recliner.webp`, href: "#" },
  { name: "Sofa", image: `${CAT_IMG}/sofa.webp`, href: "#" },
  { name: "Dining Set", image: `${CAT_IMG}/dining-set.webp`, href: "#" },
  { name: "Beds", image: `${CAT_IMG}/beds.webp`, href: "#" },
  { name: "Study Tables", image: `${CAT_IMG}/study-tables.webp`, href: "#" },
  { name: "Mattress", image: `${CAT_IMG}/mattress.webp`, href: "#" },
  { name: "Decor", image: `${CAT_IMG}/decor.webp`, href: "#" },
  { name: "Wardrobes", image: `${CAT_IMG}/wardrobes.webp`, href: "#" },
  { name: "Chairs", image: `${CAT_IMG}/chairs.webp`, href: "#" },
  { name: "Outdoor", image: `${CAT_IMG}/outdoor.webp`, href: "#" },
  { name: "Dressing Table", image: `${CAT_IMG}/dressing-table.webp`, href: "#" },
  { name: "Coffee Tables", image: `${CAT_IMG}/coffee-tables.webp`, href: "#" },
] as const;

export { topUtilityLinks } from "@/lib/routes/site-pages";

export const navCategories = [
  "International Collection",
  "Living",
  "Bedroom",
  "Mattresses",
  "Dining",
  "Study & Office",
  "Outdoor",
  "Decor",
  "Furnishings",
  "New Arrivals",
  "House of Interiors",
] as const;

/** Mobile/tablet nav icons — replace with real PNGs in public/images/nav/ when available */
const NAV_ICON = "/images/nav/category.svg";

export const navCategoryIcons: Record<(typeof navCategories)[number], string> = {
  "International Collection": NAV_ICON,
  Living: NAV_ICON,
  Bedroom: NAV_ICON,
  Mattresses: NAV_ICON,
  Dining: NAV_ICON,
  "Study & Office": NAV_ICON,
  Outdoor: NAV_ICON,
  Decor: NAV_ICON,
  Furnishings: NAV_ICON,
  "New Arrivals": NAV_ICON,
  "House of Interiors": NAV_ICON,
};

export const features = [
  {
    image: homeImages.features.customers,
    label: "2000+ Customers",
  },
  {
    image: homeImages.features.international,
    label: "International Furniture",
  },
  {
    image: homeImages.features.price,
    label: "Unbeatable Price",
  },
  {
    image: homeImages.features.secure,
    label: "100% Secure Payment",
  },
  {
    image: homeImages.features.emi,
    label: "No Cost EMI",
  },
] as const;

export const bankLogos = [
  {
    name: "HDFC",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
  },
  {
    name: "Axis",
    src: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg",
  },
  {
    name: "SBI",
    src: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg",
  },
  {
    name: "ICICI",
    src: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
  },
] as const;
