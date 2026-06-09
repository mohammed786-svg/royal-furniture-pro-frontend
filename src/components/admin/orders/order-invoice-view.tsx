"use client";

import { Printer } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import type { OrderAddress, OrderInvoice } from "@/types/orders";

type OrderInvoiceViewProps = {
  invoice: OrderInvoice;
};

function AddressBlock({ title, address }: { title: string; address: OrderAddress }) {
  return (
    <div className="admin-invoice-address-block">
      <h4>{title}</h4>
      <p className="admin-invoice-address-name">{address.fullName}</p>
      <p>{address.phone}</p>
      <p>{address.addressLine1}</p>
      {address.addressLine2 && <p>{address.addressLine2}</p>}
      <p>
        {address.city}, {address.state} — {address.pincode}
      </p>
    </div>
  );
}

export function OrderInvoiceView({ invoice }: OrderInvoiceViewProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="admin-invoice-document">
      <div className="admin-invoice-print-toolbar">
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handlePrint}
        >
          <Printer size={16} />
          Print Invoice
        </button>
      </div>

      <div className="admin-invoice-print">
        <header className="admin-invoice-header">
          <div className="admin-invoice-brand">
            <span className="admin-invoice-crown">♛</span>
            <div>
              <span className="admin-invoice-royal">ROYAL</span>
              <span className="admin-invoice-sub">FURNITURE PRO</span>
            </div>
          </div>
          <div className="admin-invoice-meta">
            <h2>Tax Invoice</h2>
            <p>
              <strong>Invoice #:</strong> {invoice.invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(invoice.invoiceDate)}
            </p>
            <p>
              <strong>Order #:</strong> {invoice.orderNumber}
            </p>
            <p>
              <strong>Status:</strong> {invoice.currentStatus}
            </p>
          </div>
        </header>

        <section className="admin-invoice-company">
          <h3>{invoice.company.name}</h3>
          <p>{invoice.company.address}</p>
          <p>
            {invoice.company.phone} · {invoice.company.email}
          </p>
        </section>

        <section className="admin-invoice-parties">
          <div className="admin-invoice-party">
            <h4>Bill To</h4>
            <p className="admin-invoice-address-name">{invoice.customer.fullName}</p>
            <p>{invoice.customer.email}</p>
            <p>{invoice.customer.phone}</p>
          </div>
          <div className="admin-invoice-addresses">
            <AddressBlock title="Billing Address" address={invoice.billingAddress} />
            <AddressBlock title="Shipping Address" address={invoice.shippingAddress} />
          </div>
        </section>

        <table className="admin-invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>SKU</th>
              <th>HSN</th>
              <th>GST %</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.sku}</td>
                <td>{item.hsnCode || "—"}</td>
                <td>{item.gstPercent}%</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td>{formatCurrency(item.discountAmount)}</td>
                <td>{formatCurrency(item.taxAmount)}</td>
                <td>{formatCurrency(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="admin-invoice-totals">
          <div className="admin-invoice-totals-grid">
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
            <div className="admin-invoice-grand-total">
              <span>Grand Total</span>
              <strong>{formatCurrency(invoice.totals.grandTotal)}</strong>
            </div>
          </div>
        </section>

        <footer className="admin-invoice-footer">
          <p>
            <strong>Payment Method:</strong> {invoice.paymentMethod}
          </p>
          {invoice.couponCode && (
            <p>
              <strong>Coupon:</strong> {invoice.couponCode}
            </p>
          )}
          {invoice.notes && (
            <p>
              <strong>Notes:</strong> {invoice.notes}
            </p>
          )}
          <p className="admin-invoice-thanks">
            Thank you for shopping with Royal Furniture Pro!
          </p>
        </footer>
      </div>
    </div>
  );
}
