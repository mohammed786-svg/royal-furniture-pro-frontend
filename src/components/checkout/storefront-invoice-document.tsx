"use client";

import { siteConfig } from "@/config/seo/metadata.config";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import type { OrderAddress, OrderInvoice } from "@/types/orders";

type StorefrontInvoiceDocumentProps = {
  invoice: OrderInvoice;
  printId?: string;
};

function AddressBlock({ title, address }: { title: string; address: OrderAddress }) {
  return (
    <div className="sf-invoice-address">
      <h4>{title}</h4>
      <p className="sf-invoice-address__name">{address.fullName}</p>
      <p>{address.phone}</p>
      <p>{address.addressLine1}</p>
      {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
      <p>
        {address.city}, {address.state} — {address.pincode}
      </p>
    </div>
  );
}

export function StorefrontInvoiceDocument({
  invoice,
  printId = "storefront-invoice-print",
}: StorefrontInvoiceDocumentProps) {
  return (
    <div className="sf-invoice-document" id={printId}>
      <header className="sf-invoice-header">
        <div className="sf-invoice-brand">
          <img
            src={siteConfig.logoSrc}
            alt={siteConfig.name}
            width={180}
            height={154}
          />
          <p className="sf-invoice-brand__tagline">Premium furniture · Bengaluru</p>
        </div>
        <div className="sf-invoice-meta">
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

      <section className="sf-invoice-company">
        <h3>{invoice.company.name}</h3>
        <p>{invoice.company.address}</p>
        <p>
          {invoice.company.phone} · {invoice.company.email}
        </p>
      </section>

      <section className="sf-invoice-parties">
        <div className="sf-invoice-party">
          <h4>Bill To</h4>
          <p className="sf-invoice-address__name">{invoice.customer.fullName}</p>
          <p>{invoice.customer.email}</p>
          <p>{invoice.customer.phone}</p>
        </div>
        <div className="sf-invoice-addresses">
          <AddressBlock title="Billing Address" address={invoice.billingAddress} />
          <AddressBlock title="Shipping Address" address={invoice.shippingAddress} />
        </div>
      </section>

      <div className="sf-invoice-table-wrap">
        <table className="sf-invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.sku}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td>{formatCurrency(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="sf-invoice-totals">
        <div>
          <span>Subtotal</span>
          <strong>{formatCurrency(invoice.totals.subtotal)}</strong>
        </div>
        <div>
          <span>Discount</span>
          <strong>-{formatCurrency(invoice.totals.discountAmount)}</strong>
        </div>
        <div>
          <span>Tax (GST)</span>
          <strong>{formatCurrency(invoice.totals.taxAmount)}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <strong>{formatCurrency(invoice.totals.shippingAmount)}</strong>
        </div>
        <div className="sf-invoice-totals__grand">
          <span>Grand Total</span>
          <strong>{formatCurrency(invoice.totals.grandTotal)}</strong>
        </div>
      </section>

      <footer className="sf-invoice-footer">
        <p>
          <strong>Payment Method:</strong> {invoice.paymentMethod}
        </p>
        {invoice.couponCode ? (
          <p>
            <strong>Coupon:</strong> {invoice.couponCode}
          </p>
        ) : null}
        <p className="sf-invoice-footer__thanks">
          Thank you for shopping with Royal Furniture Pro!
        </p>
      </footer>
    </div>
  );
}
