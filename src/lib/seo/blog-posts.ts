import { COMPANY_INFO } from "@/lib/constants/company-info";

export type BlogPostSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  heroLabel: string;
  sections: BlogPostSection[];
  faqs?: { question: string; answer: string }[];
};

/**
 * SEO blog posts targeting local + brand furniture queries.
 * Content is Belagavi / Karnataka focused for “near me” relevance.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-furniture-store-near-me-belagavi",
    title: "Best Furniture Store Near Me in Belagavi | Royal Furniture Pro",
    description:
      "Looking for the best furniture store near me in Belagavi? Visit Royal Furniture Pro for sofas, beds, dining sets, free delivery options, and showroom guidance.",
    keywords: [
      "best furniture store near me",
      "furniture store near me Belagavi",
      "furniture shop Belgaum",
      "Royal Furniture Pro Belagavi",
    ],
    category: "Local Guide",
    publishedAt: "2026-07-01",
    updatedAt: "2026-07-20",
    readingMinutes: 6,
    heroLabel: "Belagavi · Local guide",
    sections: [
      {
        paragraphs: [
          `If you searched “best furniture store near me” or “furniture shop in Belagavi,” you want a nearby showroom with quality pieces, fair pricing, and delivery you can trust. Royal Furniture Pro is based at ${COMPANY_INFO.addressFull} — a convenient destination for families across Belagavi (Belgaum) and nearby areas.`,
          "From living room sofas and recliners to bedroom sets and dining tables, our Belagavi team helps you compare materials, sizes, and budgets in one visit — online or in-store.",
        ],
      },
      {
        heading: "Why Belagavi shoppers choose Royal Furniture Pro",
        paragraphs: [
          "Local presence means faster support, easier returns guidance, and advice tailored to Karnataka homes — compact apartments and spacious family houses alike.",
          "Shop bestsellers online, then confirm finish and comfort at our Belagavi location. Call or WhatsApp for store timings and directions.",
        ],
      },
      {
        heading: "What to buy when you need furniture near me",
        paragraphs: [
          "Start with your room measurements, then shortlist sofas, beds, or dining sets that fit width and walkway clearance. Our catalog highlights sale price, MRP, and GST-inclusive checkout so there are fewer surprises at payment.",
          "Need same-week inspiration? Browse Living, Bedroom, and Dining categories, or visit the store to see fabrics and wood finishes in person.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where is the Royal Furniture Pro store in Belagavi?",
        answer: `We are at ${COMPANY_INFO.addressFull}. Call ${COMPANY_INFO.phone} for directions.`,
      },
      {
        question: "Do you deliver furniture near Belagavi?",
        answer:
          "Yes. We arrange delivery across Belagavi and surrounding areas. Delivery timelines depend on product and location — confirm at checkout or with our team.",
      },
    ],
  },
  {
    slug: "furniture-near-me-belagavi-buying-guide",
    title: "Furniture Near Me in Belagavi — How to Choose the Right Store",
    description:
      "Furniture near me search tips for Belagavi: what to check for sofas, beds, dining, warranty, delivery, and why Royal Furniture Pro is a top local choice.",
    keywords: [
      "furniture near me",
      "furniture near me Belagavi",
      "buy furniture Belgaum",
      "sofa store near me",
    ],
    category: "Buying Guide",
    publishedAt: "2026-07-05",
    updatedAt: "2026-07-20",
    readingMinutes: 7,
    heroLabel: "Buying guide",
    sections: [
      {
        paragraphs: [
          "“Furniture near me” results should lead you to a store that is close, stocked, and transparent on price. In Belagavi, Royal Furniture Pro combines an online catalog with a physical HQ so you can order with confidence.",
          "Use this guide before you buy — whether you are upgrading a living room or furnishing a new home.",
        ],
      },
      {
        heading: "Checklist for furniture near me searches",
        paragraphs: [
          "1) Confirm the store address and phone on Google Maps. 2) Check product categories you need (sofa, bed, dining, office). 3) Ask about warranty, installation, and payment proof for UPI/bank transfer. 4) Compare GST-inclusive totals.",
          "Royal Furniture Pro checkout supports UPI QR and bank transfer with payment screenshot verification — clear for prepaid online orders.",
        ],
      },
      {
        heading: "Popular rooms Belagavi customers furnish first",
        paragraphs: [
          "Living rooms: sofas, sofa-cum-beds, and recliners. Bedrooms: beds and mattresses. Dining: 4–8 seater sets. Study & office: chairs and desks for work-from-home setups.",
          "Explore category pages from our homepage sitelinks-style navigation: Living, Bedroom, Dining, Study & Office, Outdoor, and Decor.",
        ],
      },
    ],
  },
  {
    slug: "royal-furniture-pro-belagavi-showroom",
    title: "Royal Furniture Pro Belagavi — Showroom, Contact & Online Shopping",
    description:
      "Royal Furniture Pro Belagavi showroom details, phone, address, and how to shop furniture online with delivery across Karnataka.",
    keywords: [
      "Royal Furniture Pro",
      "Royal Furniture Pro Belagavi",
      "Royal Furniture Belgaum",
      "furniture showroom Belagavi",
    ],
    category: "Brand",
    publishedAt: "2026-07-08",
    updatedAt: "2026-07-20",
    readingMinutes: 5,
    heroLabel: "Brand · Belagavi",
    sections: [
      {
        paragraphs: [
          "Royal Furniture Pro is a furniture brand headquartered in Belagavi, Karnataka. We sell sofas, beds, dining, office furniture, and décor online — with store support for customers who prefer to see products first.",
          `Visit us at ${COMPANY_INFO.addressFull}. Phone: ${COMPANY_INFO.phone}. Email: ${COMPANY_INFO.email}.`,
        ],
      },
      {
        heading: "Shop online or visit the showroom",
        paragraphs: [
          "Browse royalfurniturepro.com (or your live storefront URL) for current prices, GST, and stock. Track orders from your account after checkout.",
          "For franchise or multi-store enquiries, use our Franchise page. For store listing and hours-related questions, see Stores and Contact Us.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Royal Furniture Pro the same as Royal Oak?",
        answer:
          "No. Royal Furniture Pro is an independent furniture brand based in Belagavi. We are not affiliated with Royaloak.",
      },
    ],
  },
  {
    slug: "sofa-store-near-me-belagavi",
    title: "Sofa Store Near Me in Belagavi — Sofas & Recliners",
    description:
      "Find a sofa store near me in Belagavi. Shop sofas, sofa-cum-beds, and recliners at Royal Furniture Pro with local showroom support.",
    keywords: [
      "sofa store near me",
      "sofa shop Belagavi",
      "recliner Belgaum",
      "sofa cum bed near me",
    ],
    category: "Living Room",
    publishedAt: "2026-07-10",
    updatedAt: "2026-07-20",
    readingMinutes: 5,
    heroLabel: "Living room",
    sections: [
      {
        paragraphs: [
          "Searching sofa store near me? Belagavi shoppers visit Royal Furniture Pro for fabric and leatherette sofas, compact sofa-cum-beds, and single-seater recliners.",
          "Measure your wall length and doorway before ordering. Our Living category lists bestsellers with clear MRP and sale prices.",
        ],
      },
      {
        heading: "Sofa buying tips for Karnataka homes",
        paragraphs: [
          "Prefer stain-resistant fabrics for family rooms. Choose recliner depth carefully for apartments. Confirm delivery path for large corner units.",
          "Need help choosing? Call or WhatsApp our Belagavi team with room photos.",
        ],
      },
    ],
  },
  {
    slug: "bedroom-furniture-near-me-belagavi",
    title: "Bedroom Furniture Near Me — Beds & Mattresses in Belagavi",
    description:
      "Bedroom furniture near me in Belagavi: beds, mattresses, and storage options from Royal Furniture Pro with showroom and online checkout.",
    keywords: [
      "bedroom furniture near me",
      "bed store Belagavi",
      "mattress Belgaum",
      "bedroom set near me",
    ],
    category: "Bedroom",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-20",
    readingMinutes: 5,
    heroLabel: "Bedroom",
    sections: [
      {
        paragraphs: [
          "Upgrade sleep quality with beds and mattresses from a trusted Belagavi furniture store. Royal Furniture Pro’s Bedroom range covers everyday and premium options.",
          "Match mattress firmness to sleeper preference and bed size (queen/king). Ask our team for orthopedic and foam guidance.",
        ],
      },
    ],
  },
  {
    slug: "dining-furniture-store-belagavi",
    title: "Dining Furniture Store in Belagavi — Tables & Sets",
    description:
      "Dining furniture store in Belagavi for 4–8 seater dining sets. Shop Royal Furniture Pro online or visit our Azam Nagar showroom.",
    keywords: [
      "dining furniture Belagavi",
      "dining table near me",
      "dining set Belgaum",
      "furniture store Karnataka",
    ],
    category: "Dining",
    publishedAt: "2026-07-14",
    updatedAt: "2026-07-20",
    readingMinutes: 4,
    heroLabel: "Dining",
    sections: [
      {
        paragraphs: [
          "A dining furniture store near you should help size the set to your room. Royal Furniture Pro offers dining tables and chairs suited to Belagavi homes.",
          "Leave 90 cm walkway around the table when possible. Solid builds and easy-clean tops work well for daily family meals.",
        ],
      },
    ],
  },
  {
    slug: "office-furniture-near-me-belagavi",
    title: "Office Furniture Near Me — Chairs & Desks in Belagavi",
    description:
      "Office furniture near me in Belagavi: ergonomic chairs and study desks from Royal Furniture Pro for home offices and small businesses.",
    keywords: [
      "office furniture near me",
      "office chair Belagavi",
      "study table Belgaum",
      "ergonomic chair near me",
    ],
    category: "Office",
    publishedAt: "2026-07-16",
    updatedAt: "2026-07-20",
    readingMinutes: 4,
    heroLabel: "Study & office",
    sections: [
      {
        paragraphs: [
          "Work-from-home setups need durable chairs and desks. Browse Study & Office at Royal Furniture Pro — a practical furniture store near Belagavi customers.",
          "Look for lumbar support, adjustable height, and stable bases. Pair with a desk that fits your room depth.",
        ],
      },
    ],
  },
  {
    slug: "buy-furniture-online-india-belagavi-delivery",
    title: "Buy Furniture Online in India with Belagavi Delivery Support",
    description:
      "Buy furniture online in India from Royal Furniture Pro — sofas, beds, dining, EMI-friendly prepaid options, and Belagavi-based customer support.",
    keywords: [
      "buy furniture online India",
      "online furniture store",
      "furniture delivery Belagavi",
      "prepaid furniture India",
    ],
    category: "Online Shopping",
    publishedAt: "2026-07-18",
    updatedAt: "2026-07-20",
    readingMinutes: 6,
    heroLabel: "Online shopping",
    sections: [
      {
        paragraphs: [
          "Buying furniture online in India is easier when the brand has a real local presence. Royal Furniture Pro lists products with images, pricing, and GST at checkout, plus Belagavi support if you need help after delivery.",
          "Add to cart, choose address, pay via UPI QR or bank transfer, upload payment screenshot, then track your order.",
        ],
      },
      {
        heading: "Why local SEO content matters for furniture brands",
        paragraphs: [
          "Searches like “furniture near me” and “best furniture store near me” reward businesses with clear NAP (name, address, phone), helpful blogs, and fast pages. This blog and our Stores / Contact pages are built for that.",
          "Claim and keep your Google Business Profile updated with photos, hours, and reviews — that powers the map pack and knowledge panel next to search results.",
        ],
      },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
