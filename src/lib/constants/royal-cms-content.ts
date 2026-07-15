/** CMS page copy — adapted from Royal Oak reference with Royal Furniture Pro branding */

import { COMPANY_INFO, ROYAL_STORE_ADDRESS } from "@/lib/constants/company-info";

export const ROYAL_BRAND = COMPANY_INFO.name;
export const ROYAL_EMAIL = COMPANY_INFO.email;
export const ROYAL_PHONE = COMPANY_INFO.phoneTel;
export const ROYAL_PHONE_DISPLAY = COMPANY_INFO.phone;
export const ROYAL_PHONE_TEL = `tel:${COMPANY_INFO.phoneTel}`;
export const ROYAL_WHATSAPP = COMPANY_INFO.whatsapp;
export const ROYAL_WHATSAPP_DISPLAY = COMPANY_INFO.whatsappDisplay;
export const ROYAL_WHATSAPP_LINK = COMPANY_INFO.whatsappLink;

export const ROYAL_ADDRESS = ROYAL_STORE_ADDRESS;

export const ABOUT_STATS = [
  {
    value: "8+",
    label: "More than 8 furniture stores across India — growing every year.",
  },
  {
    value: "Belagavi HQ",
    label: "Flagship showroom at 1st Cross, Azam Nagar, near Basaveshwar Temple.",
  },
  {
    value: "Home & Living",
    label: "Sofas, beds, dining, wardrobes, recliners and complete home sets.",
  },
  {
    value: "Fair Prices",
    label: "Quality furniture with transparent pricing and local after-sales care.",
  },
  {
    value: "Online + Store",
    label: "Shop on royalfurniturepro.com or visit a store for a hands-on experience.",
  },
  {
    value: "India First",
    label:
      "Built for Indian homes — styles, sizes, and delivery that fit how you live.",
  },
] as const;

export const ABOUT_VISION = [
  "Make stylish, durable furniture easy to buy for every Indian home.",
  "Grow trust through honest pricing, reliable delivery, and store-side support.",
  "Expand carefully across India while staying rooted in Belagavi quality and service.",
] as const;

export const ABOUT_STORY = [
  {
    period: "Beginnings",
    title: "Our beginnings",
    bullets: [
      "Royal Furniture Pro started with a clear goal — bring well-made furniture to homes at fair prices.",
      "Our Belagavi showroom in Azam Nagar became the home base for customers who want to see and feel products before they buy.",
      "Near Basaveshwar Temple, Azam Nagar — a known local landmark for shoppers looking for trusted furniture.",
    ],
  },
  {
    period: "Growth",
    title: "Growing across India",
    bullets: [
      "We expanded to more than 8 stores across India, bringing the same range and service beyond Belagavi.",
      "Each store focuses on living-room, bedroom, and dining collections suited for Indian apartments and villas.",
      "Customers get guided buying help in-store plus support for online orders and delivery.",
    ],
  },
  {
    period: "Today",
    title: "Today",
    bullets: [
      "Shop online at royalfurniturepro.com or walk into a Royal Furniture Pro store near you.",
      "Visit our Belagavi showroom for hours, directions, and a hands-on look at our collections.",
      "We keep adding fresh designs while staying focused on quality, warranty, and after-sales care.",
    ],
  },
] as const;

export const PRIVACY_SECTIONS = [
  {
    heading: "Privacy Policy",
    paragraphs: [
      `${ROYAL_BRAND} takes privacy protection seriously and we set the highest standards in this regard. We value the trust you place in us and ensure the privacy protection of all its users. Please read this document regarding our privacy policy.`,
    ],
  },
  {
    heading: "When And What Information Does Royal Furniture Pro Collect?",
    paragraphs: [
      "We collect basic information required to service your requests, including your name, mailing address, email and phone number. This information is gathered when you purchase products/gift certificates, or sign up for email notifications. Your card information is requested only when you place an order and is submitted via the highest level of encryption to ensure the greatest amount of safety and security.",
    ],
  },
  {
    heading: "Why Do We Collect This Information?",
    paragraphs: [
      "The primary reason we gather information is for order processing, shipping and customer service. For example, we may contact you to provide an update on your purchase, information regarding the shipping status or to clarify questions related to your purchase. Also to provide customers a customized shopping experience, to notify them on updates, new activities, latest contents available on the website, special offers, schemes, other products/services. Along with that we use this information to improve our products, services, website content and navigation.",
    ],
  },
  {
    heading: "With whom your information will be shared",
    paragraphs: [
      `${ROYAL_BRAND} will not use your personal information for any purpose other than to complete a transaction with you. ${ROYAL_BRAND} does not rent, sell or share your personal information and will not disclose any of your personally identifiable information to third parties. In cases where it has your permission to provide products or services you've requested and such information is necessary to provide these products or services the information may be shared with ${ROYAL_BRAND} in-house team. We keep data of your previous transactions and orders including product, price, date of purchase, payment and transaction history etc.`,
      "All credit/debit cards details and personally identifiable information will NOT be stored, sold, shared, rented or leased to any third parties.",
      "We will not pass any debit/credit card details to third parties.",
      `${ROYAL_BRAND} takes appropriate steps to ensure data privacy and security including through various hardware and software methodologies.`,
      "However our website cannot guarantee the security of any information that is disclosed online.",
      `${ROYAL_BRAND} is not responsible for the privacy policies of websites to which it links. If you provide any information to such third parties different rules regarding the collection and use of your personal information may apply. You should contact these entities directly if you have any questions about their use of the information that they collect.`,
      "The Website Policies and Terms & Conditions may be changed or updated occasionally to meet the requirements and standards. Therefore, customers are encouraged to frequently visit these sections to be updated about the changes on the website. Modifications will be effective on the day they are posted.",
    ],
  },
  {
    heading: "Policy updates",
    paragraphs: [
      "Our privacy policy is subject to change regularly/periodically, without notice. To ensure the updates on changes, kindly review the privacy policy periodically. This privacy policy doesn't apply to any of our business partners/franchise/associates or other third parties. Kindly review the privacy policy of other parties with whom you may interact.",
    ],
  },
] as const;

export type PolicySection = {
  id: string;
  title: string;
  blocks: { heading?: string; paragraphs?: string[]; list?: string[] }[];
};

export const POLICIES_HUB_SECTIONS: PolicySection[] = [
  {
    id: "delivery",
    title: "Delivery Policy",
    blocks: [
      {
        heading: "1. Order Confirmation & Processing",
        list: [
          "Once your online order is placed and confirmed, you will receive an order confirmation email with the order ID details. Also available under My Account section in your profile.",
          "Order processing typically begins within 24-48 hours of order confirmation.",
        ],
      },
      {
        heading: "2. Delivery Area & Charges",
        list: [
          "We deliver to most locations within India.",
          "Delivery charges may apply based on your location and the size/weight of your order.",
          "Specific delivery charges will be calculated and displayed during the checkout process for select locations.",
          "Free shipping may be offered on select orders or during promotional periods to select locations only.",
          "For NE and JK regions, 5% additional delivery charges are applicable.",
        ],
      },
      {
        heading: "3. Delivery Timeframes",
        list: [
          "Estimated delivery times will be provided during the checkout process and on product pages via pincode check.",
          "These are estimates and may vary due to unforeseen circumstances.",
          "For remote locations, delivery may take longer than usual.",
        ],
      },
      {
        heading: "8. Contact Us",
        paragraphs: [
          `If you have any questions regarding your delivery, please contact our customer service team at ${ROYAL_PHONE} or email us at ${ROYAL_EMAIL}`,
        ],
      },
      {
        heading: "10. Disclaimer",
        paragraphs: [
          "We reserve the right to modify this delivery policy at any time without prior notice.",
          "The most up-to-date version of this policy will always be available on our website.",
          "All disputes valid only at Bangalore Jurisdiction.",
        ],
      },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    blocks: [
      {
        paragraphs: [
          `At ${ROYAL_BRAND}, we strive to offer you a seamless shopping experience. Please take note of our cancellation policy regarding furniture orders:`,
        ],
      },
      {
        heading: "Cancellation",
        paragraphs: [
          `To cancel your order, please contact our customer care team at ${ROYAL_PHONE} or email us at ${ROYAL_EMAIL}. Kindly note that once an order is placed and the invoice is generated, cancellation is subject to approval.`,
        ],
      },
      {
        heading: "Cancellation Conditions",
        list: [
          "If invoicing has occurred but the order hasn't shipped, you may still cancel it. However, approval for cancellation is at the discretion of our team.",
          "Once the order is shipped, cancellations are not permitted.",
          "Installed products fall under warranty and cannot be canceled.",
        ],
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Replacement",
    blocks: [
      {
        paragraphs: [
          `Your satisfaction is paramount at ${ROYAL_BRAND}. Should you need to return a furniture or home décor item, here's our guide to the returns process:`,
        ],
      },
      {
        heading: "Initiate the Return",
        list: [
          "Log in to your account and navigate to 'Order History'.",
          "Select the relevant order and follow the prompts to initiate the return process.",
        ],
      },
      {
        heading: "Refund/Exchange",
        paragraphs: [
          "Eligible refunds will be issued to your original payment method within 7-21 days, or you may opt for a replacement item.",
        ],
      },
      {
        heading: "Eligibility for Return or Replacement",
        list: [
          "Faulty products are eligible for return.",
          "Discrepancies between the delivered product and its description may qualify for replacement.",
        ],
      },
      {
        heading: "Items NOT Eligible for Return or Replacement",
        list: [
          "Damage claims must be made upon delivery or assembly.",
          "We are not liable for damage post-delivery due to relocation.",
        ],
      },
    ],
  },
];

export const POLICY_QUICK_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
] as const;
