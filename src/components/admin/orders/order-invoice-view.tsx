"use client";

import { Printer } from "lucide-react";
import { TaxInvoiceDocument } from "@/components/invoices/tax-invoice-document";
import { printTaxInvoice } from "@/lib/invoices/print-tax-invoice";
import type { OrderInvoice } from "@/types/orders";

type OrderInvoiceViewProps = {
  invoice: OrderInvoice;
};

export function OrderInvoiceView({ invoice }: OrderInvoiceViewProps) {
  function handlePrint() {
    printTaxInvoice("admin-tax-invoice-print");
  }

  return (
    <div className="admin-invoice-document">
      <div className="admin-invoice-print-toolbar tax-invoice-print-hide">
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handlePrint}
        >
          <Printer size={16} />
          Print Invoice
        </button>
      </div>

      <TaxInvoiceDocument invoice={invoice} printId="admin-tax-invoice-print" />
    </div>
  );
}
