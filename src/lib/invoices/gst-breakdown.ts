import { COMPANY_INFO } from "@/lib/constants/company-info";
import type { OrderInvoice } from "@/types/orders";

export type GstBreakdown = NonNullable<OrderInvoice["totals"]["gstBreakdown"]>;

const DEFAULT_GST_PERCENT = 18;

function normalizeState(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isIntraState(customerState: string, companyState: string) {
  const customer = normalizeState(customerState);
  const company = normalizeState(companyState);
  if (!customer) return true;
  return (
    customer === company || customer.includes(company) || company.includes(customer)
  );
}

function inferGstPercent(taxableAmount: number, taxAmount: number) {
  if (taxableAmount <= 0 || taxAmount <= 0) return DEFAULT_GST_PERCENT;
  const inferred = Math.round((taxAmount / taxableAmount) * 10000) / 100;
  return inferred > 0 ? inferred : DEFAULT_GST_PERCENT;
}

export function buildGstBreakdown(invoice: OrderInvoice): GstBreakdown {
  if (invoice.totals.gstBreakdown) {
    return invoice.totals.gstBreakdown;
  }

  const taxableAmount =
    invoice.totals.taxableAmount ??
    Math.max(invoice.totals.subtotal - invoice.totals.discountAmount, 0);
  const taxAmount = invoice.totals.taxAmount;
  const gstPercent = inferGstPercent(taxableAmount, taxAmount);
  const customerState =
    invoice.billingAddress.state || invoice.shippingAddress.state || "";
  const companyState = invoice.company.state || COMPANY_INFO.state;

  if (isIntraState(customerState, companyState)) {
    const halfRate = Math.round((gstPercent / 2) * 100) / 100;
    const cgstAmount = Math.round((taxAmount / 2) * 100) / 100;
    const sgstAmount = Math.round((taxAmount - cgstAmount) * 100) / 100;
    return {
      mode: "intra",
      gstPercent,
      taxableAmount,
      cgstPercent: halfRate,
      cgstAmount,
      sgstPercent: halfRate,
      sgstAmount,
      igstPercent: 0,
      igstAmount: 0,
    };
  }

  return {
    mode: "inter",
    gstPercent,
    taxableAmount,
    cgstPercent: 0,
    cgstAmount: 0,
    sgstPercent: 0,
    sgstAmount: 0,
    igstPercent: gstPercent,
    igstAmount: taxAmount,
  };
}

export function lineTaxableValue(item: OrderInvoice["lineItems"][number]) {
  if ("taxableValue" in item && typeof item.taxableValue === "number") {
    return item.taxableValue;
  }
  return Math.max(item.lineTotal - item.taxAmount, 0);
}
