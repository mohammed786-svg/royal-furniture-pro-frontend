"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { royalToast } from "@/lib/toast/royal-toast";
import { fileToDataUrl } from "@/services/catalog-categories";
import {
  createPaymentVerification,
  fetchPayments,
  fetchPaymentVerification,
  updatePaymentVerification,
} from "@/services/payments-api";
import type {
  PaymentItem,
  PaymentVerificationFormValues,
  PaymentVerificationItem,
} from "@/types/payments";

const LIST_PATH = "/my-admin/payments/verification";

const emptyForm: PaymentVerificationFormValues = {
  paymentId: "",
  orderId: "",
  utrNumber: "",
  paymentAmount: 0,
  screenshotUrl: "",
  remarks: "",
};

function itemToForm(item: PaymentVerificationItem): PaymentVerificationFormValues {
  return {
    paymentId: item.paymentId,
    orderId: item.orderId,
    utrNumber: item.utrNumber,
    paymentAmount: item.paymentAmount,
    screenshotUrl: item.screenshotUrl ?? "",
    remarks: item.remarks ?? "",
  };
}

type Props = { mode: "create" | "edit"; verificationId?: string };

export function PaymentVerificationFormPage({ mode, verificationId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PaymentVerificationFormValues>(emptyForm);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const paymentData = await fetchPayments({ page: 1, pageSize: 500 });
      setPayments(paymentData.items);
      if (mode === "edit" && verificationId) {
        setForm(itemToForm(await fetchPaymentVerification(verificationId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load verification"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, verificationId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function handlePaymentChange(paymentId: string) {
    const payment = payments.find((p) => p.id === paymentId);
    setForm((prev) => ({
      ...prev,
      paymentId,
      orderId: payment?.orderId ?? prev.orderId,
      paymentAmount: payment?.paymentAmount ?? prev.paymentAmount,
    }));
  }

  async function handleScreenshot(file?: File) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((p) => ({ ...p, screenshotUrl: dataUrl }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.paymentId) e.paymentId = "Payment is required";
    if (!form.utrNumber.trim()) e.utrNumber = "UTR number is required";
    if (form.paymentAmount <= 0) e.paymentAmount = "Amount must be greater than zero";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        remarks: form.remarks || undefined,
        screenshotUrl: form.screenshotUrl || undefined,
      };
      if (mode === "edit" && verificationId) {
        await updatePaymentVerification(verificationId, payload);
        royalToast.success("Verification updated");
      } else {
        await createPaymentVerification(payload);
        royalToast.success("Verification created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Verification" : "Add Verification";
  const screenshotPreview = resolveMediaUrl(form.screenshotUrl);

  if (loading) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={title}
        listPath={LIST_PATH}
        listLabel="Verification"
        sectionLabel="Payments"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Verification Details</h2>
              <p>paymentverificationtbl — UTR, amount and screenshot</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Payment" required error={errors.paymentId}>
                <select
                  value={form.paymentId}
                  onChange={(e) => handlePaymentChange(e.target.value)}
                >
                  <option value="">Select payment</option>
                  {payments.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.orderNumber} — {p.customerName} ({p.paymentStatus})
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="UTR Number" required error={errors.utrNumber}>
                <input
                  value={form.utrNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, utrNumber: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Amount" required error={errors.paymentAmount}>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.paymentAmount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, paymentAmount: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Remarks" className="span-2">
                <textarea
                  rows={3}
                  value={form.remarks}
                  onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))}
                />
              </ProductFormField>
            </div>
          </section>
          <section className="admin-product-section-card">
            <header>
              <h2>Payment Screenshot</h2>
            </header>
            <div className="admin-product-image-upload">
              {screenshotPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={screenshotPreview}
                  alt="Payment screenshot"
                  className="admin-product-image-preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void handleScreenshot(e.target.files?.[0])}
              />
            </div>
          </section>
        </div>
        <div className="admin-product-form-footer">
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => router.push(LIST_PATH)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
