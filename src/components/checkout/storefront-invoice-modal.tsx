"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Printer, X } from "lucide-react";
import { StorefrontInvoiceDocument } from "@/components/checkout/storefront-invoice-document";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { printTaxInvoice } from "@/lib/invoices/print-tax-invoice";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchStorefrontOrderInvoice } from "@/services/storefront-commerce";
import type { OrderInvoice } from "@/types/orders";

type StorefrontInvoiceModalProps = {
  orderNumber: string;
  open: boolean;
  onClose: () => void;
};

export function StorefrontInvoiceModal({
  orderNumber,
  open,
  onClose,
}: StorefrontInvoiceModalProps) {
  const [invoice, setInvoice] = useState<OrderInvoice | null>(null);
  const [loading, setLoading] = useState(false);

  const loadInvoice = useCallback(async () => {
    setLoading(true);
    try {
      setInvoice(await fetchStorefrontOrderInvoice(orderNumber));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Could not load invoice"));
      onClose();
    } finally {
      setLoading(false);
    }
  }, [orderNumber, onClose]);

  useEffect(() => {
    if (!open) {
      setInvoice(null);
      return;
    }
    void loadInvoice();
  }, [open, loadInvoice]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function handlePrint() {
    printTaxInvoice();
  }

  if (!open) return null;

  return (
    <div
      className="sf-invoice-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Order invoice"
    >
      <button
        type="button"
        className="sf-invoice-modal__backdrop"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="sf-invoice-modal__panel">
        <div className="sf-invoice-modal__toolbar sf-invoice-print-hide">
          <div>
            <h3>Your Invoice</h3>
            <p>{orderNumber}</p>
          </div>
          <div className="sf-invoice-modal__actions">
            <button
              type="button"
              className="track-order-btn track-order-btn--ghost"
              onClick={handlePrint}
              disabled={!invoice || loading}
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              type="button"
              className="track-order-btn track-order-btn--primary"
              onClick={handlePrint}
              disabled={!invoice || loading}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              type="button"
              className="sf-invoice-modal__close"
              onClick={onClose}
              aria-label="Close invoice"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="sf-invoice-modal__body">
          {loading || !invoice ? (
            <div className="track-order-loading">
              <div className="track-order-loading__spinner" />
              <p>Preparing your invoice…</p>
            </div>
          ) : (
            <StorefrontInvoiceDocument invoice={invoice} />
          )}
        </div>
      </div>
    </div>
  );
}
