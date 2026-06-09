import { formatPrice, p } from "@/lib/constants/home-data";
import { getProductHref } from "@/lib/constants/product-details";

export type DeliveryNote =
  | { type: "unavailable"; text: string }
  | { type: "estimated"; text: string };

export type CartLineItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  href: string;
  price: number;
  mrp: number;
  quantity: number;
  collection?: string;
  collectionLogo?: string;
  deliveryNote?: DeliveryNote;
};

const CDN = "https://www.royaloakindia.com";

const sofaSet = p(
  "cart1",
  "Royal Furniture Pro Travis Leatherette Recliner Sofa Set 2+1+1 Seater",
  "s/f/sf8408-3_1.jpg",
  103000.01,
  265000,
  { collection: "Living Collection" },
);

const carpet = p(
  "cart2",
  "Royal Furniture Pro Rustics Handwoven Jacquard Carpet - Chiffon 180X120cm",
  "d/s/dscf3290a.jpg",
  5999.18,
  14399.18,
  { collection: "Wood World Collection" },
);

function toLineItem(
  product: ReturnType<typeof p>,
  opts: {
    id: string;
    quantity: number;
    deliveryNote?: DeliveryNote;
    collectionLogo?: string;
    priceOverride?: number;
    mrpOverride?: number;
  },
): CartLineItem {
  return {
    id: opts.id,
    productId: product.id,
    name: product.name,
    image: product.image,
    href: getProductHref(product),
    price: opts.priceOverride ?? product.price,
    mrp: opts.mrpOverride ?? product.mrp,
    quantity: opts.quantity,
    collection: product.collection,
    collectionLogo: opts.collectionLogo,
    deliveryNote: opts.deliveryNote,
  };
}

export const initialCartItems: CartLineItem[] = [
  toLineItem(sofaSet, {
    id: "line-1",
    quantity: 1,
    deliveryNote: { type: "unavailable", text: "Product is not available at: 560001" },
  }),
  toLineItem(carpet, {
    id: "line-2",
    quantity: 1,
    collectionLogo: `${CDN}/media/mageplaza/brand/Wood_world-final.webp`,
    deliveryNote: { type: "estimated", text: "Delivery Estimated: Sat 06-Jun*" },
  }),
];

export const initialWishlistItems: CartLineItem[] = [
  toLineItem(
    p(
      "wl1",
      "Royal Furniture Pro Nova Leatherette Single Seater Recliner - Brown",
      "s/f/sf5024-3.jpg",
      14990,
      44999,
      { badge: "New Arrival" },
    ),
    { id: "wl-1", quantity: 1 },
  ),
  toLineItem(
    p(
      "wl2",
      "Royal Furniture Pro Venice Italian Marble 6 Seater Dining Set",
      "d/t/dt4033-6s_1_.jpg",
      130000,
      220000,
      { collection: "Italian Collection" },
    ),
    { id: "wl-2", quantity: 1 },
  ),
  toLineItem(carpet, {
    id: "wl-3",
    quantity: 1,
    collectionLogo: `${CDN}/media/mageplaza/brand/Wood_world-final.webp`,
  }),
];

export function lineItemSavings(item: CartLineItem): number {
  return Math.max(0, item.mrp - item.price) * item.quantity;
}

export function cartSubtotal(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartTax(subtotal: number): number {
  return Math.round(subtotal * 0.18 * 100) / 100;
}

export function cartOrderTotal(items: CartLineItem[]): number {
  const subtotal = cartSubtotal(items);
  const tax = cartTax(subtotal);
  return Math.round((subtotal + tax) * 100) / 100;
}

export { formatPrice };
