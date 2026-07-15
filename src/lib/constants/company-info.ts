/** Canonical store / company details — used on invoices, contact, payments, CMS */

export const COMPANY_INFO = {
  name: "Royal Furniture Pro",
  addressLine1: "1st Cross, Azam Nagar,",
  addressLine2: "Belagavi, Karnataka 590010",
  addressFull: "1st Cross, Azam Nagar, Belagavi, Karnataka 590010",
  city: "Belagavi",
  state: "Karnataka",
  pincode: "590010",
  phone: "94483 40678",
  phoneTel: "+919448340678",
  whatsapp: "+919448340678",
  whatsappDisplay: "+91 94483 40678",
  whatsappLink: "https://wa.me/919448340678",
  email: "customercare@royalfurniturepro.com",
} as const;

export const ROYAL_STORE_ADDRESS = {
  company: COMPANY_INFO.name,
  lines: [COMPANY_INFO.addressLine1, COMPANY_INFO.addressLine2],
} as const;

export const COMPANY_LOCATION_LABEL = `${COMPANY_INFO.city}, ${COMPANY_INFO.state}`;
