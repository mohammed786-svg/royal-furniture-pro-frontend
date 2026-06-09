"use client";

import { useState } from "react";
import { AccountShell } from "@/components/account/account-shell";
import { royalToast } from "@/lib/toast/royal-toast";

const PREFS = [
  {
    id: "orders",
    label: "Order updates",
    desc: "SMS & email when order status changes",
  },
  {
    id: "offers",
    label: "Offers & sales",
    desc: "Festive sales on sofas, beds & dining",
  },
  {
    id: "wishlist",
    label: "Wishlist price drops",
    desc: "When items in wishlist go on sale",
  },
  { id: "delivery", label: "Delivery alerts", desc: "Out for delivery notifications" },
];

export function AccountNotificationsContent() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    orders: true,
    offers: true,
    wishlist: false,
    delivery: true,
  });

  const toggle = (id: string) => {
    setPrefs((p) => {
      const next = { ...p, [id]: !p[id] };
      royalToast.success("Notification preferences saved");
      return next;
    });
  };

  return (
    <AccountShell
      title="Notifications"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Notifications" },
      ]}
    >
      <ul className="account-notify-list">
        {PREFS.map((pref) => (
          <li key={pref.id} className="account-notify-item">
            <div>
              <p className="account-notify-item__label">{pref.label}</p>
              <p className="account-notify-item__desc">{pref.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[pref.id]}
              className={`account-toggle${prefs[pref.id] ? " account-toggle--on" : ""}`}
              onClick={() => toggle(pref.id)}
            >
              <span className="account-toggle__knob" />
            </button>
          </li>
        ))}
      </ul>
    </AccountShell>
  );
}
