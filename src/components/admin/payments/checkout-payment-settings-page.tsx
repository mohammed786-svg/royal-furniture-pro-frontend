"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { MediaImage } from "@/components/ui/media-image";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { fileToDataUrl } from "@/services/catalog-categories";
import {
  fetchAdminCheckoutPaymentSettings,
  updateAdminCheckoutPaymentSettings,
} from "@/services/checkout-payment-api";
import type { CheckoutPaymentFormValues } from "@/types/checkout-payment";

const emptyForm: CheckoutPaymentFormValues = {
  qrImageUrl: "",
  accountName: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  branch: "",
  upiId: "",
};

export function CheckoutPaymentSettingsPage() {
  const [form, setForm] = useState<CheckoutPaymentFormValues>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setForm(await fetchAdminCheckoutPaymentSettings());
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load payment details"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleQr(file?: File) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      royalToast.error("QR image must be under 4 MB");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setForm((p) => ({ ...p, qrImageUrl: dataUrl }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    try {
      const saved = await updateAdminCheckoutPaymentSettings(form);
      setForm(saved);
      royalToast.success("Checkout payment details saved");
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to save payment details"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-product-form-loading">
        <div className="admin-inline-spinner" />
        <p>Loading payment details…</p>
      </div>
    );
  }

  const qrPreview = resolveMediaUrl(form.qrImageUrl) ?? form.qrImageUrl;

  return (
    <form onSubmit={handleSubmit} className="admin-product-form-card">
      <div className="admin-product-form-body">
        <section className="admin-product-section-card">
          <header>
            <h2>QR code</h2>
            <p>Shown on the customer checkout payment page for UPI / QR payments.</p>
          </header>
          <div className="admin-product-section-grid">
            <ProductFormField label="Payment QR image">
              <div className="admin-product-image-upload">
                {qrPreview ? (
                  <div className="admin-checkout-qr-preview">
                    <MediaImage
                      src={qrPreview}
                      alt="Checkout QR"
                      fill
                      fit="contain"
                      placeholderSize="md"
                      resolveUrl={false}
                    />
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => void handleQr(e.target.files?.[0])}
                />
              </div>
            </ProductFormField>
          </div>
        </section>

        <section className="admin-product-section-card">
          <header>
            <h2>Bank details</h2>
            <p>Account details customers use for bank transfer / UPI.</p>
          </header>
          <div className="admin-product-section-grid">
            {(
              [
                ["accountName", "Account name"],
                ["bankName", "Bank name"],
                ["accountNumber", "Account number"],
                ["ifsc", "IFSC"],
                ["upiId", "UPI ID"],
                ["branch", "Branch / address"],
              ] as const
            ).map(([key, label]) => (
              <ProductFormField key={key} label={label}>
                <input
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={label}
                />
              </ProductFormField>
            ))}
          </div>
        </section>
      </div>
      <div className="admin-product-form-footer">
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save payment details"}
        </button>
      </div>
    </form>
  );
}
