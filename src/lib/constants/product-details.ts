import { categoryPagesRegistry } from "@/lib/constants/category-pages";
import {
  bestSellers,
  CDN,
  newArrivals,
  onlineExclusive,
  type ProductItem,
} from "@/lib/constants/home-data";
import { categoryPageHref } from "@/lib/routes/category";
import { productSlugFromName } from "@/lib/routes/product";

export type ProductMoreInfoRow = {
  label: string;
  value: string;
};

export type ProductDetail = {
  slug: string;
  id: string;
  name: string;
  images: string[];
  price: number;
  mrp: number;
  discount?: string;
  badge?: string;
  inStock: boolean;
  sku: string;
  department: string;
  category: string;
  emiMonthly: number;
  description: string;
  features: string[];
  moreInfo: ProductMoreInfoRow[];
};

const NOVA_SLUG = "royalfurniturepro-nova-leatherette-single-seater-recliner-brown";

const novaGallery = [
  `${CDN}/media/catalog/product/s/f/sf5024-3.jpg`,
  `${CDN}/media/catalog/product/s/f/sf5024-2.jpg`,
  `${CDN}/media/catalog/product/s/f/sf5024-1.jpg`,
  `${CDN}/media/catalog/product/s/f/sf5024-4.jpg`,
  `${CDN}/media/catalog/product/s/f/sf5024-5.jpg`,
  `${CDN}/media/catalog/product/s/f/sf5024-6.jpg`,
];

const NOVA_DETAIL: ProductDetail = {
  slug: NOVA_SLUG,
  id: "rec1",
  name: "Royal Furniture Pro Nova Leatherette Single Seater Recliner - Brown",
  images: novaGallery,
  price: 14990,
  mrp: 44999,
  discount: "66% off",
  badge: "New Arrival",
  inStock: true,
  sku: "SF201970-1",
  department: "Living",
  category: "Recliners",
  emiMonthly: 1775,
  description:
    "Buy Leatherette single seater recliner from Royal Furniture Pro today and enjoy the benefits of owning international furniture from India's leading brand. Bring home comfort and timeless style with the Royal Furniture Pro Nova Leatherette Single Seater Recliner in Brown. Crafted with premium leatherette upholstery, this manual recliner offers a rich, warm look while being easy to maintain and highly durable. The high backrest with elegant tufting design ensures excellent support for your back, while the padded armrests provide added relaxation. Filled with super soft cushions, it delivers exceptional seating comfort for extended lounging. The sturdy footrest allows you to recline effortlessly and unwind after a long day. Supported by a heavy-duty metal mechanism, this recliner promises strength, stability, and long-lasting performance.",
  features: [
    "Leatherette Upholstery",
    "High Backrest",
    "Tufting Design",
    "Padded Armrest",
    "Super Soft Cushions for Extra Comfort",
    "Sturdy Footrest",
    "Heavy Duty Metal Support",
  ],
  moreInfo: [
    { label: "Available Quantity", value: "9" },
    { label: "SKU", value: "SF201970-1" },
    { label: "Weight", value: "35.00" },
    {
      label: "Dimensions",
      value: "W 31.88 X D 38.97 X H 39.76 Inches | W 81 X D 99 X H 101 Cms",
    },
    { label: "Warranty", value: "12 Months Warranty" },
    {
      label: "Assembly Details",
      value: "Installation provided by Royal Furniture Pro",
    },
    { label: "Material", value: "Leatherette" },
  ],
};

function defaultDescription(name: string, category: string): string {
  return `Buy ${name} from Royal Furniture Pro today and enjoy international-quality ${category.toLowerCase()} furniture at unbeatable prices. Designed for comfort, durability, and modern living spaces across India.`;
}

/** Build gallery URLs — main image + numbered angle variants when available */
function galleryImagesForProduct(image: string): string[] {
  const match = image.match(/^(.+?)(\.\w+)$/i);
  if (!match) return [image];

  const stem = match[1];
  const ext = match[2];
  const lastDash = stem.lastIndexOf("-");
  const baseStem = lastDash > 0 ? stem.slice(0, lastDash) : stem;

  const candidates = [
    image,
    `${baseStem}-1${ext}`,
    `${baseStem}-2${ext}`,
    `${baseStem}-3${ext}`,
    `${baseStem}-4${ext}`,
    `${stem}_1${ext}`,
    `${stem}_2${ext}`,
  ];

  const unique = [...new Set(candidates)];
  return unique.length > 1 ? unique : [image, image, image];
}

function buildFromItem(
  item: ProductItem,
  department = "Living",
  category = "Recliners",
): ProductDetail {
  const slug = productSlugFromName(item.name);
  const discount =
    item.discount ?? `${Math.round(((item.mrp - item.price) / item.mrp) * 100)}% off`;

  return {
    slug,
    id: item.id,
    name: item.name,
    images: galleryImagesForProduct(item.image),
    price: item.price,
    mrp: item.mrp,
    discount,
    badge: item.badge,
    inStock: true,
    sku: item.id.toUpperCase(),
    department,
    category,
    emiMonthly: Math.round(item.price / 9),
    description: defaultDescription(item.name, category),
    features: [
      "Premium build quality",
      "Designed for everyday comfort",
      "Easy maintenance",
      "Backed by Royal Furniture Pro warranty support",
    ],
    moreInfo: [
      { label: "SKU", value: item.id.toUpperCase() },
      { label: "Material", value: "Premium engineered materials" },
      { label: "Warranty", value: "12 Months Warranty" },
      {
        label: "Assembly Details",
        value: "Installation provided by Royal Furniture Pro",
      },
    ],
  };
}

function collectCatalogProducts(): {
  item: ProductItem;
  department: string;
  category: string;
}[] {
  const rows: { item: ProductItem; department: string; category: string }[] = [];

  for (const product of [...onlineExclusive, ...bestSellers, ...newArrivals]) {
    rows.push({ item: product, department: "Living", category: "Furniture" });
  }

  for (const page of Object.values(categoryPagesRegistry)) {
    for (const product of page.products) {
      rows.push({
        item: product,
        department: page.department,
        category: page.category,
      });
    }
  }

  return rows;
}

function buildProductRegistry(): Record<string, ProductDetail> {
  const registry: Record<string, ProductDetail> = {
    [NOVA_SLUG]: NOVA_DETAIL,
  };

  for (const { item, department, category } of collectCatalogProducts()) {
    const detail = buildFromItem(item, department, category);
    if (item.id === "rec1") {
      registry[NOVA_SLUG] = NOVA_DETAIL;
      registry[detail.slug] = NOVA_DETAIL;
    } else if (!registry[detail.slug]) {
      registry[detail.slug] = detail;
    }
  }

  return registry;
}

export const productDetailsRegistry = buildProductRegistry();

export function getProductBySlug(slug: string): ProductDetail | null {
  return productDetailsRegistry[slug] ?? null;
}

export function getProductHref(product: ProductItem): string {
  if (product.href && product.href !== "#") return product.href;
  if (product.slug) return `/product/${product.slug}`;
  const slug = productSlugFromName(product.name);
  const novaIds = new Set(["rec1", "na1"]);
  if (
    novaIds.has(product.id) ||
    slug.includes("nova-leatherette-single-seater-recliner-brown")
  ) {
    return `/product/${NOVA_SLUG}`;
  }
  const detail = productDetailsRegistry[slug];
  return `/product/${detail?.slug ?? slug}`;
}

export function getProductBreadcrumbs(product: ProductDetail) {
  return [
    { label: "Home", href: "/" },
    { label: product.department, href: categoryPageHref(product.department) },
    {
      label: product.category,
      href: categoryPageHref(product.department, product.category),
    },
    { label: product.name, href: `/product/${product.slug}` },
  ];
}

export function getAllProductSlugs(): string[] {
  return Object.keys(productDetailsRegistry);
}
