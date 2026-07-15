"use client";

import { siteConfig } from "@/config/seo/metadata.config";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { COMPANY_INFO, COMPANY_LOCATION_LABEL } from "@/lib/constants/company-info";
import { buildGstBreakdown, lineTaxableValue } from "@/lib/invoices/gst-breakdown";
import type { OrderAddress, OrderInvoice } from "@/types/orders";

type TaxInvoiceDocumentProps = {
  invoice: OrderInvoice;
  printId?: string;
  className?: string;
};

function AddressBlock({ title, address }: { title: string; address: OrderAddress }) {
  return (
    <div className="tax-invoice-address">
      <h4>{title}</h4>
      <p className="tax-invoice-address__name">{address.fullName}</p>
      <p>{address.phone}</p>
      <p>{address.addressLine1}</p>
      {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
      <p>
        {address.city}, {address.state} — {address.pincode}
      </p>
    </div>
  );
}

export function TaxInvoiceDocument({
  invoice,
  printId = "tax-invoice-print",
  className,
}: TaxInvoiceDocumentProps) {
  const gst = buildGstBreakdown(invoice);
  const taxableAmount =
    invoice.totals.taxableAmount ??
    Math.max(invoice.totals.subtotal - invoice.totals.discountAmount, 0);

  return (
    <div
      className={`tax-invoice-document tax-invoice-print ${className ?? ""}`.trim()}
      id={printId}
    >
      <header className="tax-invoice-header">
        <div className="tax-invoice-brand">
          <img
            src={siteConfig.logoSrc}
            alt={siteConfig.name}
            className="tax-invoice-brand__logo"
            width={220}
            height={188}
          />
          <p className="tax-invoice-brand__tagline">{COMPANY_LOCATION_LABEL}</p>
        </div>
        <div className="tax-invoice-meta">
          <h2>Tax Invoice</h2>
          <p>
            <strong>Invoice #</strong> {invoice.invoiceNumber}
          </p>
          <p>
            <strong>Date</strong> {formatDate(invoice.invoiceDate)}
          </p>
          <p>
            <strong>Order #</strong> {invoice.orderNumber}
          </p>
        </div>
      </header>

      <section className="tax-invoice-company">
        <h3>{invoice.company.name}</h3>
        <p>{invoice.company.address}</p>
        <p>
          {invoice.company.phone} · {invoice.company.email}
        </p>
      </section>

      <section className="tax-invoice-parties">
        <div className="tax-invoice-party">
          <h4>Bill To</h4>
          <p className="tax-invoice-address__name">{invoice.customer.fullName}</p>
          <p>{invoice.customer.phone}</p>
          {invoice.customer.email ? <p>{invoice.customer.email}</p> : null}
        </div>
        <AddressBlock title="Ship To" address={invoice.shippingAddress} />
      </section>

      <div className="tax-invoice-table-wrap">
        <table className="tax-invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate (₹)</th>
              <th>Taxable (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.hsnCode || "—"}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td>{formatCurrency(lineTaxableValue(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="tax-invoice-totals">
        <div className="tax-invoice-totals__grid">
          <div>
            <span>Subtotal</span>
            <strong>{formatCurrency(invoice.totals.subtotal)}</strong>
          </div>
          {invoice.totals.discountAmount > 0 ? (
            <div>
              <span>Discount</span>
              <strong>-{formatCurrency(invoice.totals.discountAmount)}</strong>
            </div>
          ) : null}
          <div>
            <span>Taxable value</span>
            <strong>{formatCurrency(taxableAmount)}</strong>
          </div>

          {gst.mode === "intra" ? (
            <>
              <div>
                <span>CGST @ {gst.cgstPercent}%</span>
                <strong>{formatCurrency(gst.cgstAmount)}</strong>
              </div>
              <div>
                <span>SGST @ {gst.sgstPercent}%</span>
                <strong>{formatCurrency(gst.sgstAmount)}</strong>
              </div>
            </>
          ) : (
            <div>
              <span>IGST @ {gst.igstPercent}%</span>
              <strong>{formatCurrency(gst.igstAmount)}</strong>
            </div>
          )}

          <div>
            <span>Total GST ({gst.gstPercent}%)</span>
            <strong>{formatCurrency(invoice.totals.taxAmount)}</strong>
          </div>

          {invoice.totals.shippingAmount > 0 ? (
            <div>
              <span>Shipping</span>
              <strong>{formatCurrency(invoice.totals.shippingAmount)}</strong>
            </div>
          ) : null}

          <div className="tax-invoice-totals__grand">
            <span>Grand Total</span>
            <strong>{formatCurrency(invoice.totals.grandTotal)}</strong>
          </div>
        </div>

        <p className="tax-invoice-gst-note">
          {gst.mode === "intra"
            ? `Intra-state supply (${COMPANY_INFO.state}): GST ${gst.gstPercent}% split as CGST ${gst.cgstPercent}% + SGST ${gst.sgstPercent}%.`
            : `Inter-state supply: IGST ${gst.igstPercent}% applicable.`}
        </p>
      </section>

      <footer className="tax-invoice-footer">
        <p>
          <strong>Payment:</strong> {invoice.paymentMethod}
        </p>
        {invoice.couponCode ? (
          <p>
            <strong>Coupon applied:</strong> {invoice.couponCode}
          </p>
        ) : null}
        <p className="tax-invoice-footer__thanks">
          Thank you for shopping with Royal Furniture Pro!
        </p>
      </footer>
    </div>
  );
}
