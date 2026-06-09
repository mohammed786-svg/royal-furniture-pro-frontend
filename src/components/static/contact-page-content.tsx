"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import {
  ROYAL_ADDRESS,
  ROYAL_EMAIL,
  ROYAL_PHONE_DISPLAY,
  ROYAL_PHONE_TEL,
} from "@/lib/constants/royal-cms-content";
import { royalToast } from "@/lib/toast/royal-toast";

export function ContactPageContent() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      royalToast.success("Thank you! We will get back to you shortly.");
      e.currentTarget.reset();
    }, 600);
  };

  return (
    <main className="royal-contact-page">
      <div className="royal-contact-page__inner royal-section-inner">
        <CategoryBreadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        />

        <h1 className="royal-contact-page__title">Contact Us</h1>

        <div className="royal-contact-panel">
          <h2 className="royal-contact-panel__heading">Contact Us</h2>

          <div className="royal-contact-layout">
            <section className="royal-contact-form-col">
              <h3 className="royal-contact-form-col__title">Send your comments</h3>
              <p className="royal-contact-form-col__subtitle">
                Please share your query with us, we will get back to you
              </p>

              <form className="royal-contact-form" onSubmit={handleSubmit} noValidate>
                <div className="royal-contact-field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="royal-contact-field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="royal-contact-field">
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    required
                    autoComplete="tel"
                  />
                </div>
                <div className="royal-contact-field">
                  <label htmlFor="contact-message">What&apos;s on your mind?</label>
                  <textarea id="contact-message" name="message" rows={6} required />
                </div>
                <button
                  type="submit"
                  className="royal-contact-form__submit"
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit"}
                </button>
              </form>
            </section>

            <aside className="royal-contact-info-col">
              <div className="royal-contact-info-item">
                <Mail
                  className="royal-contact-info-item__icon"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <a
                  href={`mailto:${ROYAL_EMAIL}`}
                  className="royal-contact-info-item__link"
                >
                  {ROYAL_EMAIL}
                </a>
              </div>

              <div className="royal-contact-info-item">
                <Phone
                  className="royal-contact-info-item__icon"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <a href={ROYAL_PHONE_TEL} className="royal-contact-info-item__link">
                  {ROYAL_PHONE_DISPLAY}
                </a>
              </div>

              <div className="royal-contact-address">
                <h5 className="royal-contact-address__title">Address</h5>
                <p className="royal-contact-address__company">
                  {ROYAL_ADDRESS.company}
                </p>
                <p>
                  {ROYAL_ADDRESS.lines[0]}
                  <br />
                  {ROYAL_ADDRESS.lines[1]}
                </p>
              </div>

              <div className="royal-contact-social">
                <h5 className="royal-contact-social__title">Connect Us On</h5>
                <ul className="royal-contact-social__list">
                  <li>
                    <a
                      href="#"
                      aria-label="Facebook"
                      className="royal-contact-social__fb"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                        <path
                          fill="currentColor"
                          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      aria-label="Instagram"
                      className="royal-contact-social__ig"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                        <path
                          fill="currentColor"
                          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      aria-label="YouTube"
                      className="royal-contact-social__yt"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                        <path
                          fill="currentColor"
                          d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
