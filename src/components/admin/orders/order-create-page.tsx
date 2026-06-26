"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatCurrency } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { createOrder, fetchOrderOptions } from "@/services/orders-api";
import type {
  OrderCreateFormValues,
  OrderCreateLineItem,
  OrderOptions,
} from "@/types/orders";

const LIST_PATH = "/my-admin/orders";

const emptyLineItem = (): OrderCreateLineItem => ({
  productId: "",
  productVariantId: "",
  quantity: 1,
  unitPrice: 0,
  discountAmount: 0,
  taxAmount: 0,
  lineTotal: 0,
  hsnCode: "",
  warehouseId: "",
});

const emptyForm: OrderCreateFormValues = {
  customerId: "",
  shippingAddressId: "",
  billingAddressId: "",
  statusCode: "CONFIRMED",
  paymentMethod: "QR",
  paymentStatus: "PENDING",
  createPayment: false,
  discountAmount: 0,
  shippingAmount: 0,
  couponCode: "",
  notes: "",
  items: [emptyLineItem()],
};

function recalcLine(
  item: OrderCreateLineItem,
  gstPercent: number,
): OrderCreateLineItem {
  const taxable = item.unitPrice * item.quantity - item.discountAmount;
  const tax =
    item.taxAmount || (gstPercent > 0 ? Math.round(taxable * gstPercent) / 100 : 0);
  return { ...item, taxAmount: tax, lineTotal: taxable + tax };
}

export function OrderCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<OrderCreateFormValues>(emptyForm);
  const [options, setOptions] = useState<OrderOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOptions(await fetchOrderOptions());
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load options"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const customerAddresses = useMemo(
    () => (options?.addresses ?? []).filter((a) => a.customerId === form.customerId),
    [options?.addresses, form.customerId],
  );

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const itemDiscount = form.items.reduce((s, i) => s + i.discountAmount, 0);
    const tax = form.items.reduce((s, i) => s + i.taxAmount, 0);
    const grand =
      subtotal - form.discountAmount - itemDiscount + tax + form.shippingAmount;
    return { subtotal, tax, grand };
  }, [form]);

  function updateItem(index: number, patch: Partial<OrderCreateLineItem>) {
    setForm((prev) => {
      const items = [...prev.items];
      let item = { ...items[index], ...patch };
      const product = options?.products.find((p) => p.id === item.productId);
      if (patch.productId && product) {
        item.unitPrice = product.salePrice;
        item.hsnCode = product.hsnCode;
        item = recalcLine(item, product.gstPercent);
      } else if (product) {
        item = recalcLine(item, product.gstPercent);
      }
      if (
        patch.quantity !== undefined ||
        patch.unitPrice !== undefined ||
        patch.discountAmount !== undefined
      ) {
        item = recalcLine(item, product?.gstPercent ?? 0);
      }
      items[index] = item;
      return { ...prev, items };
    });
  }

  function addItem() {
    setForm((p) => ({ ...p, items: [...p.items, emptyLineItem()] }));
  }

  function removeItem(index: number) {
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.customerId) {
      royalToast.error("Customer is required");
      return;
    }
    if (!form.items.some((i) => i.productId)) {
      royalToast.error("Add at least one product");
      return;
    }
    setSaving(true);
    try {
      const order = await createOrder({
        ...form,
        items: form.items.filter((i) => i.productId),
      });
      royalToast.success("Order created");
      router.push(`/my-admin/orders/${order.id}`);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to create order"));
    } finally {
      setSaving(false);
    }
  }

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
        title="Create Order"
        listPath={LIST_PATH}
        listLabel="Orders"
        sectionLabel="Orders"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Customer & Addresses</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Customer" required>
                <select
                  value={form.customerId}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      customerId: e.target.value,
                      shippingAddressId: "",
                      billingAddressId: "",
                    }))
                  }
                >
                  <option value="">Select customer</option>
                  {(options?.customers ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {c.phone || c.email}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Shipping Address">
                <select
                  value={form.shippingAddressId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, shippingAddressId: e.target.value }))
                  }
                >
                  <option value="">Select address</option>
                  {customerAddresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fullName} — {a.city}, {a.pincode}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Billing Address">
                <select
                  value={form.billingAddressId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, billingAddressId: e.target.value }))
                  }
                >
                  <option value="">Same as shipping</option>
                  {customerAddresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fullName} — {a.city}, {a.pincode}
                    </option>
                  ))}
                </select>
              </ProductFormField>
            </div>
          </section>

          <section className="admin-product-section-card">
            <header>
              <h2>Line Items</h2>
              <button
                type="button"
                className="admin-btn admin-btn-outline admin-btn-sm"
                onClick={addItem}
              >
                <Plus size={14} /> Add Item
              </button>
            </header>
            {form.items.map((item, index) => {
              const variants = (options?.variants ?? []).filter(
                (v) => v.productId === item.productId,
              );
              return (
                <div key={index} className="admin-repeat-row admin-order-line-item">
                  <ProductFormField label="Product">
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        updateItem(index, {
                          productId: e.target.value,
                          productVariantId: "",
                        })
                      }
                    >
                      <option value="">Select product</option>
                      {(options?.products ?? []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                  </ProductFormField>
                  <ProductFormField label="Variant">
                    <select
                      value={item.productVariantId}
                      onChange={(e) =>
                        updateItem(index, { productVariantId: e.target.value })
                      }
                    >
                      <option value="">No variant</option>
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.variantName} ({v.sku})
                        </option>
                      ))}
                    </select>
                  </ProductFormField>
                  <ProductFormField label="Qty">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, { quantity: Number(e.target.value) })
                      }
                    />
                  </ProductFormField>
                  <ProductFormField label="Unit Price">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, { unitPrice: Number(e.target.value) })
                      }
                    />
                  </ProductFormField>
                  <ProductFormField label="Discount">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.discountAmount}
                      onChange={(e) =>
                        updateItem(index, { discountAmount: Number(e.target.value) })
                      }
                    />
                  </ProductFormField>
                  <div className="admin-order-line-total">
                    <span>Line Total</span>
                    <strong>{formatCurrency(item.lineTotal)}</strong>
                  </div>
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-outline admin-btn-sm danger"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </section>

          <section className="admin-product-section-card">
            <header>
              <h2>Payment & Totals</h2>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Status">
                <select
                  value={form.statusCode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, statusCode: e.target.value }))
                  }
                >
                  {(options?.statuses ?? []).map((s) => (
                    <option key={s.id} value={s.statusCode}>
                      {s.statusName}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Payment Method">
                <select
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, paymentMethod: e.target.value }))
                  }
                >
                  {(options?.paymentMethods ?? []).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Order Discount">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.discountAmount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, discountAmount: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Shipping">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.shippingAmount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, shippingAmount: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Coupon Code">
                <input
                  value={form.couponCode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, couponCode: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Notes" className="span-2">
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </ProductFormField>
            </div>
            <div className="admin-order-totals-summary">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(totals.subtotal)}</strong>
              </div>
              <div>
                <span>Tax</span>
                <strong>{formatCurrency(totals.tax)}</strong>
              </div>
              <div className="grand">
                <span>Grand Total</span>
                <strong>{formatCurrency(totals.grand)}</strong>
              </div>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.createPayment}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, createPayment: e.target.checked }))
                  }
                />
                Create payment record
              </label>
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
            {saving ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
