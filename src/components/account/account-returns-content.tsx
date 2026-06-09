"use client";

import { useState } from "react";
import { AccountShell } from "@/components/account/account-shell";
import { useOrderStore } from "@/lib/store/order-store";
import { royalToast } from "@/lib/toast/royal-toast";

export function AccountReturnsContent() {
  const orders = useOrderStore((s) => s.orders);
  const [orderId, setOrderId] = useState(orders[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !reason.trim()) {
      royalToast.error("Select order and reason");
      return;
    }
    royalToast.success(
      "Return request submitted. Our team will contact you within 48 hours.",
    );
    setReason("");
    setNotes("");
  };

  return (
    <AccountShell
      title="Returns & Refunds"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Returns & Refunds" },
      ]}
    >
      <p className="account-lead">
        Furniture returns are accepted within 7 days for manufacturing defects. Large
        items may require doorstep pickup scheduling.
      </p>

      <form className="account-form" onSubmit={handleSubmit}>
        <div className="account-form__field">
          <label htmlFor="return-order">Order ID</label>
          <select
            id="return-order"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="account-form__input"
          >
            <option value="">Select order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id}
              </option>
            ))}
          </select>
        </div>
        <div className="account-form__field">
          <label htmlFor="return-reason">Reason</label>
          <select
            id="return-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="account-form__input"
          >
            <option value="">Select reason</option>
            <option value="damaged">Damaged / defective</option>
            <option value="wrong">Wrong item delivered</option>
            <option value="quality">Quality not as expected</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="account-form__field">
          <label htmlFor="return-notes">Additional notes</label>
          <textarea
            id="return-notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="account-form__input"
            placeholder="Describe the issue with photos reference if any"
          />
        </div>
        <button type="submit" className="account-form__submit">
          Submit return request
        </button>
      </form>
    </AccountShell>
  );
}
