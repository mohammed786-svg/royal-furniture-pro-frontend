import type { CartLineItem, DeliveryNote } from "@/lib/constants/cart-data";
import type { ProductItem } from "@/lib/constants/home-data";
import { getProductHref, type ProductDetail } from "@/lib/constants/product-details";

const CDN = "https://www.royaloakindia.com";

const COLLECTION_LOGOS: Record<string, string> = {
  "Wood World Collection": `${CDN}/media/mageplaza/brand/Wood_world-final.webp`,
  "Italian Collection": `${CDN}/media/mageplaza/brand/italian_2.png`,
  "Malaysian Collection": `${CDN}/media/mageplaza/brand/malaysian_2.png`,
  "American Collection": `${CDN}/media/mageplaza/brand/american_1.png`,
};

function defaultDeliveryNote(): DeliveryNote {
  return { type: "estimated", text: "Delivery Estimated: Sat 06-Jun*" };
}

export function productItemToLineItem(
  product: ProductItem,
  linePrefix: "cart" | "wl",
  quantity = 1,
): CartLineItem {
  const collection = product.collection;
  return {
    id: `${linePrefix}-${product.id}`,
    productId: product.id,
    name: product.name,
    image: product.image,
    href: getProductHref(product),
    price: product.price,
    mrp: product.mrp,
    quantity,
    collection,
    collectionLogo: collection ? COLLECTION_LOGOS[collection] : undefined,
    deliveryNote: linePrefix === "cart" ? defaultDeliveryNote() : undefined,
  };
}

export function productDetailToProductItem(product: ProductDetail): ProductItem {
  return {
    id: product.id,
    name: product.name,
    image: product.images[0] ?? "",
    price: product.price,
    mrp: product.mrp,
    badge: product.badge,
    discount: product.discount,
    collection: product.department,
  };
}

export function productDetailToLineItem(
  product: ProductDetail,
  linePrefix: "cart" | "wl",
  quantity = 1,
): CartLineItem {
  return productItemToLineItem(
    productDetailToProductItem(product),
    linePrefix,
    quantity,
  );
}
