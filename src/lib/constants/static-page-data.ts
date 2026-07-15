import {
  Award,
  BookOpen,
  Building2,
  Camera,
  FileText,
  Headphones,
  HelpCircle,
  Mail,
  MapPin,
  Newspaper,
  Package,
  RotateCcw,
  Shield,
  Sparkles,
  Store,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants/company-info";

export type StaticPageSlug =
  | "stores"
  | "franchise"
  | "about"
  | "customer-support"
  | "careers"
  | "privacy-policy"
  | "policies"
  | "terms-and-conditions"
  | "return-policy"
  | "shipping-policy"
  | "contact"
  | "faqs"
  | "blog"
  | "media"
  | "sitemap";

export type StaticPageLayout = "cms" | "marketing";

export type StaticBlock =
  | { type: "intro"; text: string }
  | { type: "features"; items: { icon: LucideIcon; title: string; text: string }[] }
  | { type: "cards"; items: { title: string; text: string; tag?: string }[] }
  | { type: "prose"; sections: { heading?: string; paragraphs: string[] }[] }
  | { type: "stores"; cities: { city: string; count: number; address: string }[] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "timeline"; items: { year: string; title: string; text: string }[] }
  | { type: "links"; items: { label: string; href: string; desc?: string }[] }
  | {
      type: "cta";
      title: string;
      text: string;
      primary: { label: string; href: string };
      secondary?: { label: string; href: string };
    };

export type StaticPageConfig = {
  slug: StaticPageSlug;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent?: "gold" | "copper" | "navy";
  layout?: StaticPageLayout;
  blocks: StaticBlock[];
};

export const STATIC_PAGES: Record<StaticPageSlug, StaticPageConfig> = {
  stores: {
    slug: "stores",
    title: "Royal Furniture Stores",
    subtitle:
      "More than 8 stores across India — visit Belagavi HQ or a showroom near you",
    icon: Store,
    accent: "gold",
    blocks: [
      {
        type: "intro",
        text: "Touch sofas, compare finishes, and plan entire rooms with our team. Flagship showroom in Azam Nagar, Belagavi — near Basaveshwar Temple.",
      },
      {
        type: "features",
        items: [
          { icon: MapPin, title: "8+ stores in India", text: "Growing city presence" },
          { icon: Sparkles, title: "Live displays", text: "Full room settings" },
          {
            icon: Truck,
            title: "Store + online",
            text: "Buy in store or on the website",
          },
        ],
      },
      {
        type: "stores",
        cities: [
          {
            city: "Belagavi (HQ)",
            count: 1,
            address: `${COMPANY_INFO.addressFull} · Near Basaveshwar Temple, Azam Nagar`,
          },
          {
            city: "Across India",
            count: 8,
            address: "More than 8 Royal Furniture Pro stores serving homes nationwide",
          },
        ],
      },
      {
        type: "cta",
        title: "Find us in Belagavi",
        text: "Prefer online? Contact us for delivery, or visit a Royal Furniture Pro store near you.",
        primary: { label: "Contact us", href: "/contact" },
        secondary: { label: "About us", href: "/about" },
      },
    ],
  },
  franchise: {
    slug: "franchise",
    title: "Franchise Enquiry",
    subtitle:
      "Partner with Royal Furniture Pro — proven brand, premium collections, strong margins",
    icon: Building2,
    accent: "copper",
    blocks: [
      {
        type: "intro",
        text: "Join one of India’s fastest-growing furniture retail networks. We provide merchandising, training, marketing, and supply-chain support.",
      },
      {
        type: "cards",
        items: [
          {
            title: "Investment",
            text: "Showroom from 2,000 sq.ft. | Investment from ₹35L+",
            tag: "Tier 1–3",
          },
          {
            title: "Support",
            text: "Visual merchandising, CRM, digital leads, launch campaigns",
            tag: "360°",
          },
          {
            title: "Catalogue",
            text: "International collections + India-made bestsellers",
            tag: "5000+ SKUs",
          },
        ],
      },
      {
        type: "prose",
        sections: [
          {
            heading: "Who should apply?",
            paragraphs: [
              "Retail entrepreneurs, existing furniture dealers, and investors seeking a differentiated lifestyle brand.",
              "Submit your city, available area, and retail experience — our expansion team responds within 5 business days.",
            ],
          },
        ],
      },
      {
        type: "cta",
        title: "Start your franchise journey",
        text: "Share your details on our contact page with subject “Franchise”.",
        primary: { label: "Apply now", href: "/contact" },
      },
    ],
  },
  about: {
    slug: "about",
    title: "About us",
    subtitle: "International Furniture, Unbeatable Price",
    icon: Award,
    layout: "cms",
    blocks: [],
  },
  "customer-support": {
    slug: "customer-support",
    title: "Customer Support",
    subtitle: "We’re here before, during, and after every furniture purchase",
    icon: Headphones,
    accent: "navy",
    blocks: [
      {
        type: "intro",
        text: "Assembly scheduling, warranty claims, payment verification, and delivery rescheduling — one dedicated team for your peace of mind.",
      },
      {
        type: "features",
        items: [
          { icon: Mail, title: "Email", text: "support@royalfurniturepro.com" },
          { icon: Headphones, title: "Phone", text: "1800-123-4567 (9 AM – 8 PM)" },
          { icon: Package, title: "Orders", text: "Track & modify open orders" },
        ],
      },
      {
        type: "cta",
        title: "Need help right now?",
        text: "Check FAQs or track your order for instant updates.",
        primary: { label: "FAQs", href: "/faqs" },
        secondary: { label: "Track order", href: "/track-order" },
      },
    ],
  },
  careers: {
    slug: "careers",
    title: "Careers",
    subtitle: "Build beautiful homes — build your career with us",
    icon: Users,
    accent: "copper",
    blocks: [
      {
        type: "intro",
        text: "From store stylists to supply chain engineers, we hire passionate people who love design, service, and scale.",
      },
      {
        type: "cards",
        items: [
          {
            title: "Retail & sales",
            text: "Showroom managers, visual merchandisers, CRM executives",
            tag: "Hiring",
          },
          {
            title: "Technology",
            text: "Frontend, backend, data — hybrid & remote roles",
            tag: "Hiring",
          },
          {
            title: "Operations",
            text: "Warehouse, last-mile delivery, assembly partners",
            tag: "Open",
          },
        ],
      },
      {
        type: "cta",
        title: "Send your CV",
        text: "Email careers@royalfurniturepro.com with role preference & city.",
        primary: { label: "Contact HR", href: "/contact" },
      },
    ],
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy & Policy",
    subtitle: "How we collect, use, and protect your personal information",
    icon: Shield,
    layout: "cms",
    blocks: [],
  },
  policies: {
    slug: "policies",
    title: "Policies",
    subtitle: "Delivery, cancellation, returns and more",
    icon: FileText,
    layout: "cms",
    blocks: [],
  },
  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    subtitle: "Please read before using our website or placing an order",
    icon: FileText,
    layout: "cms",
    blocks: [
      {
        type: "prose",
        sections: [
          {
            paragraphs: [
              "By using royalfurniturepro.com you agree to these terms. Prices, offers, and availability may change without notice.",
            ],
          },
          {
            heading: "Orders & payments",
            paragraphs: [
              "Orders are confirmed after payment verification. Bank/UPI payments require valid reference numbers and proof upload.",
              "We reserve the right to cancel orders with incomplete or fraudulent payment details.",
            ],
          },
          {
            heading: "Warranty",
            paragraphs: [
              "Manufacturing defects are covered as per product warranty cards. Normal wear, misuse, and unauthorised modifications are excluded.",
            ],
          },
        ],
      },
    ],
  },
  "return-policy": {
    slug: "return-policy",
    title: "Return Policy",
    subtitle: "Returns and replacement guidelines",
    icon: RotateCcw,
    layout: "cms",
    blocks: [],
  },
  "shipping-policy": {
    slug: "shipping-policy",
    title: "Shipping Policy",
    subtitle: "Delivery information and timelines",
    icon: Truck,
    layout: "cms",
    blocks: [],
  },
  contact: {
    slug: "contact",
    title: "Contact Us",
    subtitle: "Send your comments — we will get back to you",
    icon: Mail,
    layout: "cms",
    blocks: [],
  },
  faqs: {
    slug: "faqs",
    title: "FAQs",
    subtitle: "Quick answers about orders, delivery, EMI, and care",
    icon: HelpCircle,
    accent: "navy",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "How do I track my order?",
            a: "Use Track Order in the header with your order ID (e.g. RF-20260603-1234) or registered mobile.",
          },
          {
            q: "What payment methods do you accept?",
            a: "UPI QR, bank transfer, and Google Pay with UTR/reference submission at checkout.",
          },
          {
            q: "Is assembly included?",
            a: "Selected products include free assembly; others show optional assembly fees at checkout.",
          },
          {
            q: "Can I change delivery address after ordering?",
            a: "Contact support within 24 hours of placing the order if it has not shipped.",
          },
          {
            q: "Do you offer No Cost EMI?",
            a: "Yes on eligible cards and Bajaj EMI — options appear on product and cart pages.",
          },
          {
            q: "How do furniture returns work?",
            a: "See our Return Policy. Defect claims require photos and are picked up from your delivery address.",
          },
        ],
      },
    ],
  },
  blog: {
    slug: "blog",
    title: "Blog",
    subtitle: "Inspiration, styling tips, and buying guides for every room",
    icon: BookOpen,
    accent: "gold",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "5 recliner trends for 2026",
            text: "Power recline, USB ports, and compact footprints for apartments.",
            tag: "Living",
          },
          {
            title: "Dining set size guide",
            text: "4 vs 6 vs 8 seater — measure your room right.",
            tag: "Dining",
          },
          {
            title: "Mattress firmness decoded",
            text: "Orthopedic, memory foam, and hybrid explained.",
            tag: "Bedroom",
          },
        ],
      },
      {
        type: "cta",
        title: "More stories coming soon",
        text: "Subscribe to our newsletter in the footer for new articles.",
        primary: { label: "Shop bestsellers", href: "/" },
      },
    ],
  },
  media: {
    slug: "media",
    title: "Media",
    subtitle: "Press releases, brand assets, and partnership enquiries",
    icon: Camera,
    accent: "copper",
    blocks: [
      {
        type: "intro",
        text: "Journalists and creators — download logos, campaign imagery, and executive bios for Royal Furniture Pro.",
      },
      {
        type: "cards",
        items: [
          {
            title: "Press kit",
            text: "Logos, brand colours, store photography",
            tag: "Download",
          },
          { title: "PR contact", text: "media@royalfurniturepro.com", tag: "Email" },
          {
            title: "Campaigns",
            text: "Jumbo Sale, 200 Stores, Exchange Offer",
            tag: "2026",
          },
        ],
      },
    ],
  },
  sitemap: {
    slug: "sitemap",
    title: "Sitemap",
    subtitle: "Explore every corner of Royal Furniture Pro",
    icon: Newspaper,
    blocks: [
      {
        type: "links",
        items: [
          { label: "Home", href: "/", desc: "Shop furniture" },
          { label: "Track Order", href: "/track-order" },
          { label: "My Account", href: "/account" },
          { label: "Cart", href: "/cart" },
          { label: "Wishlist", href: "/wishlist" },
          { label: "Stores", href: "/stores" },
          { label: "About Us", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "FAQs", href: "/faqs" },
          { label: "Policies", href: "/policies" },
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Living", href: "/living" },
          { label: "Bedroom", href: "/bedroom" },
          { label: "Dining", href: "/dining" },
        ],
      },
    ],
  },
};

export const STATIC_PAGE_SLUGS = Object.keys(STATIC_PAGES) as StaticPageSlug[];
