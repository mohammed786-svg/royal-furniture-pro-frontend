"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { createFaq, fetchFaq, updateFaq } from "@/services/marketing-api";
import type { FaqFormValues, FaqItem } from "@/types/marketing";

const LIST_PATH = "/my-admin/marketing/faqs";

const emptyForm: FaqFormValues = {
  category: "",
  question: "",
  answer: "",
  displayOrder: 0,
  isActive: true,
};

function itemToForm(item: FaqItem): FaqFormValues {
  return {
    category: item.category,
    question: item.question,
    answer: item.answer,
    displayOrder: item.displayOrder,
    isActive: item.isActive,
  };
}

type Props = { mode: "create" | "edit"; faqId?: string };

export function FaqFormPage({ mode, faqId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FaqFormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (mode !== "edit" || !faqId) return;
    setLoading(true);
    try {
      setForm(itemToForm(await fetchFaq(faqId)));
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load FAQ"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [mode, faqId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.question.trim()) e.question = "Question is required";
    if (!form.answer.trim()) e.answer = "Answer is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (mode === "edit" && faqId) {
        await updateFaq(faqId, form);
        royalToast.success("FAQ updated");
      } else {
        await createFaq(form);
        royalToast.success("FAQ created");
      }
      router.push(LIST_PATH);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "edit" ? "Edit FAQ" : "Add FAQ";

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
        listLabel="FAQs"
        sectionLabel="Marketing"
      />
      <form onSubmit={handleSubmit} className="admin-product-form-card">
        <div className="admin-product-form-body">
          <section className="admin-product-section-card">
            <header>
              <h2>FAQ Details</h2>
              <p>faqtbl — category, question and answer</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Category" required error={errors.category}>
                <input
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g. Shipping, Returns"
                />
              </ProductFormField>
              <ProductFormField label="Display Order">
                <input
                  type="number"
                  min={0}
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))
                  }
                />
              </ProductFormField>
            </div>
            <ProductFormField
              label="Question"
              required
              error={errors.question}
              className="span-2"
            >
              <input
                value={form.question}
                onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
              />
            </ProductFormField>
            <ProductFormField
              label="Answer"
              required
              error={errors.answer}
              className="span-2"
            >
              <textarea
                rows={5}
                value={form.answer}
                onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
              />
            </ProductFormField>
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
