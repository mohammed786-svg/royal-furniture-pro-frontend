"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { AccountShell } from "@/components/account/account-shell";

const SUPPORT_CHANNELS = [
  {
    icon: Phone,
    title: "Call us",
    detail: "1800-123-4567",
    sub: "Mon–Sat, 9 AM – 8 PM",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "support@royalfurniturepro.com",
    sub: "Reply within 24 hours",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "+91 82965 65587",
    sub: "Furniture experts on chat",
  },
];

const FAQ = [
  "How long does sofa delivery take?",
  "Can I schedule assembly for wardrobes?",
  "What is the return policy for mattresses?",
  "How do I track my order payment status?",
];

export function AccountSupportContent() {
  return (
    <AccountShell
      title="Help & Support"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Help & Support" },
      ]}
    >
      <div className="account-support-grid">
        {SUPPORT_CHANNELS.map((ch) => (
          <div key={ch.title} className="account-support-card">
            <ch.icon className="account-support-card__icon" />
            <h3>{ch.title}</h3>
            <p className="account-support-card__detail">{ch.detail}</p>
            <p className="account-support-card__sub">{ch.sub}</p>
          </div>
        ))}
      </div>

      <section className="account-section">
        <h2>Common questions</h2>
        <ul className="account-faq-list">
          {FAQ.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>
    </AccountShell>
  );
}
