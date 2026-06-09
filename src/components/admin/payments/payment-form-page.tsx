"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createPayment,
  fetchPayment,
  fetchPaymentMetaOptions,
  updatePayment,
} from "@/services/payments-api";
import type { PaymentFormValues, PaymentItem } from "@/types/payments";

const LIST_PATH = "/admin/payments";

const emptyForm: PaymentFormValues = {
  orderId: "",
  customerId: "",
  paymentMethod: "QR",
  paymentAmount: 0,
  currency: "INR",
  paymentStatus: "PENDING",
  transactionRef: "",
  paidAt: "",
};

function itemToForm(item: PaymentItem): PaymentFormValues {
  return {
    orderId: item.orderId,
    customerId: item.customerId,
    paymentMethod: item.paymentMethod,
    paymentAmount: item.paymentAmount,
    currency: item.currency,
    paymentStatus: item.paymentStatus,
    transactionRef: item.transactionRef ?? "",
    paidAt: item.paidAt ?? "",
  };
}

type Props = { mode: "create" | "edit"; paymentId?: string };

export function PaymentFormPage({ mode, paymentId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PaymentFormValues>(emptyForm);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>([]);
  const [orders, setOrders] = useState<
    {
      id: string;
      orderNumber: string;
      customerId: string;
      customerName: string;
      totalAmount: number;
    }[]
  >([]);
  const [customers, setCustomers] = useState<{ id: string; fullName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const meta = await fetchPaymentMetaOptions();
      setOrders(meta.orders);
      setCustomers(meta.customers.map((c) => ({ id: c.id, fullName: c.fullName })));
      setPaymentMethods(meta.paymentMethods);
      setPaymentStatuses(meta.paymentStatuses);
      if (mode === "edit" && paymentId) {
        setForm(itemToForm(await fetchPayment(paymentId)));
      }
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load payment"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, paymentId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleOrderChange(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    setForm((p) => ({
      ...p,
      orderId,
      customerId: order?.customerId ?? p.customerId,
      paymentAmount: order?.totalAmount ?? p.paymentAmount,
    }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.orderId) e.orderId = "Order is required";
    if (!form.customerId) e.customerId = "Customer is required";
    if (!form.paymentMethod) e.paymentMethod = "Payment method is required";
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
        paidAt: form.paidAt || undefined,
        transactionRef: form.transactionRef || undefined,
      };
      if (mode === "edit" && paymentId) {
        await updatePayment(paymentId, payload);
        royalToast.success("Payment updated");
      } else {
        await createPayment(payload);
        royalToast.success("Payment created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Payment" : "Add Payment";

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
        listLabel="Payments"
        sectionLabel="Payments"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Payment Details</h2>
              <p>paymenttbl — order, method, amount and status</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Order" required error={errors.orderId}>
                <select
                  value={form.orderId}
                  onChange={(e) => handleOrderChange(e.target.value)}
                >
                  <option value="">Select order</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} — {o.customerName}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Customer" required error={errors.customerId}>
                <select
                  value={form.customerId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerId: e.target.value }))
                  }
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField
                label="Payment Method"
                required
                error={errors.paymentMethod}
              >
                <select
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, paymentMethod: e.target.value }))
                  }
                >
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
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
              <ProductFormField label="Currency">
                <input
                  value={form.currency}
                  onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                />
              </ProductFormField>
              <ProductFormField label="Status">
                <select
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, paymentStatus: e.target.value }))
                  }
                >
                  {paymentStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Transaction Ref">
                <input
                  value={form.transactionRef}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, transactionRef: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Paid At">
                <input
                  type="datetime-local"
                  value={form.paidAt ? form.paidAt.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      paidAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    }))
                  }
                />
              </ProductFormField>
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
