/** Full homepage data — Royal Oak layout, Royal Furniture Pro branding */

export const CDN = "https://www.royaloakindia.com";

/** Local banner copies in /public — same-origin, works on LAN dev */
const HERO = "/images/home/hero";

export type ProductItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  collection?: string;
  badge?: string;
  discount?: string;
  rating?: string;
  slug?: string;
  href?: string;
  isEmpty?: boolean;
};

export function p(
  id: string,
  name: string,
  path: string,
  price: number,
  mrp: number,
  opts?: Partial<ProductItem> & { localImage?: string },
): ProductItem {
  const brandName = name.replace(/Royaloak/gi, "Royal Furniture Pro");
  const { localImage, ...rest } = opts ?? {};
  return {
    id,
    name: brandName,
    image: localImage ?? `${CDN}/media/catalog/product/${path}`,
    price,
    mrp,
    ...rest,
  };
}

export type HeroSlide = {
  id: string;
  desktop: string;
  mobile: string;
  alt: string;
  href?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "jumbo-sale",
    desktop: `${HERO}/jumbo-sale-desktop.webp`,
    mobile: `${HERO}/mobile-jumbo.webp`,
    alt: "Jumbo Offer — Flat 70% OFF — Royal Furniture Pro",
    href: "#",
  },
  {
    id: "200-stores",
    desktop: `${HERO}/200-stores-desktop.jpg`,
    mobile: `${HERO}/mobile-200-stores.webp`,
    alt: "200+ Stores Across India & UAE — Royal Furniture Pro",
    href: "#",
  },
  {
    id: "add-on-sale",
    desktop: `${HERO}/add-on-sale-desktop.webp`,
    mobile: `${HERO}/mobile-add-on.webp`,
    alt: "Add On Sale — Royal Furniture Pro",
    href: "#",
  },
  {
    id: "exchange-offer",
    desktop: `${HERO}/exchange-offer-desktop.webp`,
    mobile: `${HERO}/mobile-exchange.webp`,
    alt: "Exchange Offer — Royal Furniture Pro",
    href: "#",
  },
];

/** Online Exclusive — matches royaloakindia.com homepage carousel */
export const onlineExclusive: ProductItem[] = [
  p(
    "oe1",
    "Royal Furniture Pro Baleno Engineered Wood King Size Bed with Hydraulic Storage",
    "b/d/bd20222002_1_.jpg",
    24900,
    60000,
    {
      badge: "New Arrival",
      discount: "58% off",
      localImage: "/images/home/products/baleno-king.jpg",
    },
  ),
  p(
    "oe2",
    "Royal Furniture Pro Baleno Engineered Wood Dresser",
    "d/r/dr122202_12.jpg",
    7900,
    19999,
    {
      badge: "Online Exclusive",
      discount: "60% off",
      localImage: "/images/home/products/baleno-dresser.jpg",
    },
  ),
  p(
    "oe3",
    "Royal Furniture Pro Baleno Bedside Table Solid Wood",
    "c/t/ct8099_22.jpg",
    3500,
    10000,
    {
      badge: "Online Exclusive",
      discount: "65% off",
      localImage: "/images/home/products/baleno-bedside.jpg",
    },
  ),
  p(
    "oe4",
    "Royal Furniture Pro Aurora Engineered Wood 3 Door Wardrobe",
    "w/r/wr6605-3.jpg",
    14900,
    30000,
    {
      badge: "Online Exclusive",
      discount: "50% off",
      localImage: "/images/home/products/aurora-wardrobe.jpg",
    },
  ),
  p(
    "oe5",
    "Royal Furniture Pro Cosmos Shoe Rack with 2 Door Storage",
    "b/s/bs2121_lfs.jpg",
    4989,
    10000,
    { badge: "Online Exclusive", discount: "50% off" },
  ),
  p(
    "oe6",
    "Royal Furniture Pro Meadow Upholstered Queen Bed",
    "b/d/bd2001_1_.jpg",
    14000,
    30000,
    { badge: "Online Exclusive", discount: "53% off" },
  ),
  p(
    "oe7",
    "Royal Furniture Pro Meadow Upholstered King Bed",
    "b/d/bd2001_1__1.jpg",
    17000,
    35000,
    { badge: "Online Exclusive", discount: "51% off" },
  ),
  p(
    "oe8",
    "Royal Furniture Pro Zen Engineered Wood Queen Size Bed",
    "r/o/royaloak-lexus-single-bed-in-sheesham-wood-1.jpg",
    15999,
    38000,
    { badge: "New Arrival", discount: "58% off" },
  ),
];

export const bestSellers: ProductItem[] = [
  p(
    "bs1",
    "Royal Furniture Pro Ashoka Sheesham Wood Dining Chair",
    "c/r/cr2001.jpg",
    5000,
    10000,
    { collection: "Wood World Collection", badge: "Best Seller", discount: "50% off" },
  ),
  p(
    "bs2",
    "Royal Furniture Pro Venice Italian Marble 6 Seater Dining Set",
    "d/t/dt4033-6s_1_.jpg",
    130000,
    220000,
    {
      collection: "Italian Collection",
      badge: "Best Seller",
      discount: "41% off",
      rating: "100% of 100",
    },
  ),
  p(
    "bs3",
    "Royal Furniture Pro Serian Wooden Side Table",
    "s/t/st6605.jpg",
    3990,
    8899,
    { collection: "Malaysian Collection", badge: "Best Seller", discount: "55% off" },
  ),
  p(
    "bs4",
    "Royal Furniture Pro Muar Malaysian Bed Side Table",
    "m/s/msp-45.jpg",
    5500,
    10000,
    {
      collection: "Malaysian Collection",
      badge: "Best Seller",
      discount: "45% off",
      rating: "95% of 100",
    },
  ),
  p(
    "bs5",
    "Royal Furniture Pro Rome Italian Side Table",
    "a/r/artboard_2_76_1.jpg",
    6900,
    15999,
    { collection: "Italian Collection", badge: "Best Seller", discount: "57% off" },
  ),
  p(
    "bs6",
    "Royal Furniture Pro Zara Wardrobe 2 Door",
    "a/r/artboard_2_63_1.jpg",
    9500,
    24999,
    { badge: "Best Seller", discount: "62% off" },
  ),
  p(
    "bs7",
    "Royal Furniture Pro Texas American Leatherette High Back Chair",
    "a/r/artboard_2_121.jpg",
    14999,
    27999,
    { collection: "American Collection", badge: "Best Seller", discount: "46% off" },
  ),
  p(
    "bs8",
    "Royal Furniture Pro Genting Malaysian Dresser",
    "d/s/dscf3287a.jpg",
    17500,
    40000,
    { collection: "Malaysian Collection", badge: "Best Seller", discount: "56% off" },
  ),
];

export const newArrivals: ProductItem[] = [
  p(
    "na1",
    "Royal Furniture Pro Nova Leatherette Single Seater Recliner - Brown",
    "s/f/sf5024-3.jpg",
    14990,
    44999,
    { badge: "New Arrival", discount: "67% off" },
  ),
  p(
    "na2",
    "Royal Furniture Pro Nova Leatherette Single Seater Recliner - Ivory",
    "s/f/sf6005_3_1_1.jpg",
    14990,
    44999,
    { badge: "New Arrival", discount: "67% off" },
  ),
  p(
    "na3",
    "Royal Furniture Pro Rustics Handwoven Jacquard Carpet - Chiffon 210X150cm",
    "c/h/chatgpt_image_feb_13_2026_04_39_42_pm.png",
    8699,
    20898,
    { collection: "Wood World Collection", badge: "New Arrival", discount: "58% off" },
  ),
  p(
    "na4",
    "Royal Furniture Pro Rustics Handwoven Jacquard Carpet - Snow 180X120cm",
    "d/s/dscf3290a.jpg",
    5999,
    14399,
    { collection: "Wood World Collection", badge: "New Arrival", discount: "58% off" },
  ),
  p(
    "na5",
    "Royal Furniture Pro Melaka Malaysian Fabric Recliner Three Seater",
    "s/f/sf8408-3_1.jpg",
    43000,
    90000,
    { badge: "New Arrival", discount: "52% off" },
  ),
  p(
    "na6",
    "Royal Furniture Pro Zurich High Gloss Dresser with Ottoman",
    "d/s/dscf3347a_1.jpg",
    44999,
    80000,
    { badge: "New Arrival", discount: "44% off" },
  ),
  p(
    "na7",
    "Royal Furniture Pro Ashoka Queen Size Bed in Sheesham Wood",
    "r/o/royaloak-ashoka-queen-size-bed-in-sheesham-wood-1.jpg",
    36000,
    69999,
    { collection: "Wood World Collection", discount: "49% off" },
  ),
  p(
    "na8",
    "Royal Furniture Pro Ashoka King Size Bed in Sheesham Wood",
    "r/o/royaloak-ashoka-king-size-bed-in-sheesham-wood-1.jpg",
    39000,
    76000,
    { badge: "Best Seller", discount: "49% off" },
  ),
];

export const spotlightItems = [
  { name: "Center Table", image: `${CDN}/media/catalog/product/a/r/artboard_2_64.jpg` },
  { name: "Coffee Table", image: `${CDN}/media/catalog/product/c/t/ct8099_22.jpg` },
  { name: "Fabric Sofas", image: `${CDN}/media/royaloakindia/SF4041-3.webp` },
  { name: "Dresser", image: `${CDN}/media/royaloakindia/DR6605.webp` },
  { name: "Dining Tables", image: `${CDN}/media/royaloakindia/DT2703-6S.webp` },
  { name: "Beds", image: `${CDN}/media/royaloakindia/BD4404-5.webp` },
];

export const internationalBrands = [
  { name: "American Store", flag: `${CDN}/media/mageplaza/brand/american_1.png` },
  { name: "Italian Store", flag: `${CDN}/media/mageplaza/brand/italian_2.png` },
  { name: "Malaysian Store", flag: `${CDN}/media/mageplaza/brand/malaysian_2.png` },
  {
    name: "Wood World Store",
    flag: `${CDN}/media/mageplaza/brand/Wood_world-final.webp`,
  },
];

export const storeLocations = [
  { name: "Karnataka", stores: 52, image: `${CDN}/media/wysiwyg/Karanataka.webp` },
  { name: "Tamil Nadu", stores: 29, image: `${CDN}/media/wysiwyg/Tamilnadu.webp` },
  { name: "Telangana", stores: 25, image: `${CDN}/media/wysiwyg/Mumbai.webp` },
  { name: "Andhra Pradesh", stores: 15, image: `${CDN}/media/wysiwyg/Andhra.webp` },
  { name: "Delhi", stores: 7, image: `${CDN}/media/wysiwyg/Delhi.webp` },
  { name: "Kerala", stores: 6, image: `${CDN}/media/wysiwyg/Kerala.webp` },
  { name: "Maharashtra", stores: 7, image: `${CDN}/media/wysiwyg/Mumbai.webp` },
  { name: "Odisha", stores: 4, image: `${CDN}/media/wysiwyg/Oddisha.webp` },
];

export const decorCategories = [
  { name: "Idols", image: `${CDN}/media/royaloakindia/WSP-33.webp` },
  {
    name: "Plants & Planters",
    image: `${CDN}/media/catalog/product/d/s/dscf3290a_2.jpg`,
  },
  { name: "Figurines", image: `${CDN}/media/catalog/product/a/r/artboard_2_75_2.jpg` },
  {
    name: "Artificial Flowers",
    image: `${CDN}/media/catalog/product/d/s/dscf3347a.jpg`,
  },
  { name: "Vases", image: `${CDN}/media/royaloakindia/WSP-33.webp` },
  {
    name: "Cushion Covers",
    image: `${CDN}/media/catalog/product/c/r/cr7551_18_1_1.jpg`,
  },
  { name: "Crystal Wall Art", image: `${CDN}/media/wysiwyg/BFS-adver-10.webp` },
  {
    name: "Candle Holders",
    image: `${CDN}/media/catalog/product/a/r/artboard_4_12_.jpg`,
  },
];

export const limitedDeals = [
  { image: `${HERO}/jumbo-sale-desktop.webp`, label: "Jumbo Sale" },
  { image: `${HERO}/exchange-offer-desktop.webp`, label: "Exchange Offer" },
  { image: `${HERO}/add-on-sale-desktop.webp`, label: "Add On Sale" },
  {
    image: `${CDN}/media/wysiwyg/Website_banner_268x350_2x.webp`,
    label: "Gaming Chair",
  },
  { image: `${CDN}/media/wysiwyg/HBD.webp`, label: "Birthday Offer" },
  {
    image: `${CDN}/media/wysiwyg/wedding_package_web_banner_268_x_350.webp`,
    label: "Wedding Package",
  },
];

export const testimonials = [
  {
    name: "Renu",
    city: "Bangalore",
    text: "I had an amazing experience with Royal Furniture Pro. The furniture quality is great and the delivery was smooth. The designs are elegant and exactly as shown online. I'm very happy with my purchase and would definitely recommend it!",
  },
  {
    name: "Priya",
    city: "Gurgaon",
    text: "My experience with Royal Furniture Pro was amazing! The furniture looks elegant and matches my home perfectly. Delivery was smooth and on time, and the installation team did a great job.",
  },
  {
    name: "John",
    city: "Bangalore",
    text: "I had a great experience with Royal Furniture Pro. The furniture quality and finish are impressive, and the delivery process was smooth. I'm really happy with the service.",
  },
  {
    name: "Ravi",
    city: "Hyderabad",
    text: "I'm really impressed with Royal Furniture Pro's service and product quality. The furniture looks amazing, and the delivery team was very professional. Highly recommended!",
  },
  {
    name: "Sharma",
    city: "Delhi",
    text: "I'm very happy with my Royal Furniture Pro purchase. The delivery was on time, and the team handled installation professionally. The quality of the product is excellent.",
  },
  {
    name: "Swetha",
    city: "Delhi",
    text: "Royal Furniture Pro's collection is fantastic! The products are elegant, comfortable, and perfectly fit my space. The furniture quality is excellent.",
  },
  {
    name: "Anjali",
    city: "Mumbai",
    text: "I had a great experience with Royal Furniture Pro. The design and quality are exceptional, and the delivery was handled very professionally.",
  },
];

export const paymentIcons = [
  { name: "Visa", src: `${CDN}/media/wysiwyg/MasCrd.png` },
  { name: "Amex", src: `${CDN}/media/wysiwyg/AmEX.png` },
  { name: "RuPay", src: `${CDN}/media/wysiwyg/Rupay_1_.jpg` },
];

export const footerColumns = {
  company: ["About Us", "Careers", "Blog", "Media", "Sitemap"],
  policies: [
    "Privacy Policy",
    "Terms & Conditions",
    "Return Policy",
    "Shipping Policy",
  ],
  help: ["Contact Us", "FAQs", "Track Order", "Policies", "Franchise Enquiry"],
  categories: ["Living", "Bedroom", "Dining", "Study & Office", "Outdoor", "Decor"],
};

export function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
