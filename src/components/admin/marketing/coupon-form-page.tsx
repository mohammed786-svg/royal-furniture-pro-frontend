"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { createCoupon, fetchCoupon, updateCoupon } from "@/services/marketing-api";
import type { CouponFormValues, CouponItem } from "@/types/marketing";

const LIST_PATH = "/my-admin/marketing/coupons";

const emptyForm: CouponFormValues = {
  couponCode: "",
  couponName: "",
  discountType: "PERCENTAGE",
  discountValue: 0,
  maxDiscountAmount: 0,
  minimumOrderAmount: 0,
  usageLimit: 0,
  usagePerCustomer: 1,
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

function itemToForm(item: CouponItem): CouponFormValues {
  return {
    couponCode: item.couponCode,
    couponName: item.couponName,
    discountType: item.discountType,
    discountValue: item.discountValue,
    maxDiscountAmount: item.maxDiscountAmount,
    minimumOrderAmount: item.minimumOrderAmount,
    usageLimit: item.usageLimit,
    usagePerCustomer: item.usagePerCustomer,
    startsAt: item.startsAt ?? "",
    expiresAt: item.expiresAt ?? "",
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; couponId?: string };

export function CouponFormPage({ mode, couponId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CouponFormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (mode !== "edit" || !couponId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchCoupon(couponId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load coupon"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, couponId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.couponCode.trim()) e.couponCode = "Coupon code is required";
    if (!form.couponName.trim()) e.couponName = "Coupon name is required";
    if (form.discountValue <= 0)
      e.discountValue = "Discount value must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && couponId) {
        await updateCoupon(couponId, form);
        royalToast.success("Coupon updated");
      } else {
        await createCoupon(form);
        royalToast.success("Coupon created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit Coupon" : "Add Coupon";

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
        listLabel="Coupons"
        sectionLabel="Marketing"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>Coupon Details</h2>
              <p>coupontbl — code, discount and usage limits</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Coupon Code" required error={errors.couponCode}>
                <input
                  value={form.couponCode}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, couponCode: e.target.value.toUpperCase() }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Coupon Name" required error={errors.couponName}>
                <input
                  value={form.couponName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, couponName: e.target.value }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Discount Type">
                <select
                  value={form.discountType}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      discountType: e.target.value as CouponFormValues["discountType"],
                    }))
                  }
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                </select>
              </ProductFormField>
              <ProductFormField
                label="Discount Value"
                required
                error={errors.discountValue}
              >
                <input
                  type="number"
                  min={0}
                  step={form.discountType === "PERCENTAGE" ? 1 : 0.01}
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, discountValue: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Max Discount Amount">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.maxDiscountAmount}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      maxDiscountAmount: Number(e.target.value),
                    }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Minimum Order Amount">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.minimumOrderAmount}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      minimumOrderAmount: Number(e.target.value),
                    }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Usage Limit">
                <input
                  type="number"
                  min={0}
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, usageLimit: Number(e.target.value) }))
                  }
                  placeholder="0 = unlimited"
                />
              </ProductFormField>
              <ProductFormField label="Usage Per Customer">
                <input
                  type="number"
                  min={1}
                  value={form.usagePerCustomer}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, usagePerCustomer: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Starts At">
                <input
                  type="datetime-local"
                  value={form.startsAt ? form.startsAt.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      startsAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    }))
                  }
                />
              </ProductFormField>
              <ProductFormField label="Expires At">
                <input
                  type="datetime-local"
                  value={form.expiresAt ? form.expiresAt.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      expiresAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    }))
                  }
                />
              </ProductFormField>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
              <label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isActive: e.target.checked }))
                  }
                />{" "}
                Active
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
            {saving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
