"use client";

import { useState } from "react";
import { ORDER_REASON_OPTIONS } from "@/lib/orders/order-reasons";

type OrderActionDialogProps = {
  open: boolean;
  title: string;
  submitLabel: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    reasonCode: string;
    reasonText: string;
  }) => void | Promise<void>;
};

export function OrderActionDialog({
  open,
  title,
  submitLabel,
  loading = false,
  onClose,
  onSubmit,
}: OrderActionDialogProps) {
  const [reasonCode, setReasonCode] = useState(ORDER_REASON_OPTIONS[0].code);
  const [reasonText, setReasonText] = useState("");

  if (!open) return null;

  const showCustom = reasonCode === "OTHER";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onSubmit({ reasonCode, reasonText: showCustom ? reasonText : "" });
  };

  return (
    <div className="order-action-dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="order-action-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-action-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="order-action-dialog-title" className="order-action-dialog__title">
          {title}
        </h2>
        <form onSubmit={handleSubmit} className="order-action-dialog__form">
          <fieldset className="order-action-dialog__reasons">
            <legend>Reason</legend>
            {ORDER_REASON_OPTIONS.map((option) => (
              <label key={option.code} className="order-action-dialog__reason">
                <input
                  type="radio"
                  name="reasonCode"
                  value={option.code}
                  checked={reasonCode === option.code}
                  onChange={() => setReasonCode(option.code)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {showCustom ? (
            <div className="order-action-dialog__field">
              <label htmlFor="order-action-custom-reason">Please describe</label>
              <textarea
                id="order-action-custom-reason"
                rows={3}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Tell us more about your reason"
                required
              />
            </div>
          ) : null}
          <div className="order-action-dialog__actions">
            <button
              type="button"
              className="order-action-dialog__btn"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="order-action-dialog__btn order-action-dialog__btn--primary"
              disabled={loading}
            >
              {loading ? "Please wait…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
