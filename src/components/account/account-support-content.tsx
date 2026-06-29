"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { AccountShell } from "@/components/account/account-shell";
import {
  ROYAL_EMAIL,
  ROYAL_PHONE_DISPLAY,
  ROYAL_PHONE_TEL,
  ROYAL_WHATSAPP_DISPLAY,
  ROYAL_WHATSAPP_LINK,
} from "@/lib/constants/royal-cms-content";

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
        <a href={ROYAL_PHONE_TEL} className="account-support-card">
          <Phone className="account-support-card__icon" />
          <h3>Call us</h3>
          <p>{ROYAL_PHONE_DISPLAY}</p>
          <span>Mon–Sat, 9 AM – 8 PM</span>
        </a>
        <a href={`mailto:${ROYAL_EMAIL}`} className="account-support-card">
          <Mail className="account-support-card__icon" />
          <h3>Email</h3>
          <p>{ROYAL_EMAIL}</p>
          <span>Reply within 24 hours</span>
        </a>
        <a
          href={ROYAL_WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="account-support-card"
        >
          <MessageCircle className="account-support-card__icon" />
          <h3>WhatsApp</h3>
          <p>{ROYAL_WHATSAPP_DISPLAY}</p>
          <span>Furniture experts on chat</span>
        </a>
      </div>

      <section className="account-faq">
        <h2>Common questions</h2>
        <ul>
          {FAQ.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </AccountShell>
  );
}
