"use client";

import { useEffect } from "react";
import Link from "next/link";
import "@/styles/globals/globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Replaces root layout when a critical error occurs */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <div className="error-page error-page--500">
          <header className="error-page__mini-header">
            <Link href="/" className="error-page__logo">
              <span className="error-page__logo-crown">♛</span>
              <span className="error-page__logo-text">ROYAL FURNITURE PRO</span>
            </Link>
          </header>
          <main className="error-page__main">
            <section className="error-hero">
              <div className="error-hero__mesh" aria-hidden />
              <div
                className="error-hero__inner royal-section-inner"
                style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
              >
                <div className="error-hero__code-wrap" aria-hidden>
                  <span className="error-hero__code-digit">5</span>
                  <span className="error-hero__code-crown">♛</span>
                  <span className="error-hero__code-digit">00</span>
                </div>
                <h1
                  className="error-hero__title"
                  style={{ textAlign: "center", color: "#fff", fontSize: "2rem" }}
                >
                  Something went wrong
                </h1>
                <p
                  className="error-hero__subtitle"
                  style={{ textAlign: "center", color: "rgba(255,255,255,0.85)" }}
                >
                  A critical error occurred. Please refresh the page.
                </p>
                <div
                  className="error-hero__actions"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: 24,
                  }}
                >
                  <button
                    type="button"
                    className="error-hero__btn error-hero__btn--primary"
                    onClick={reset}
                    style={{ border: "none", cursor: "pointer" }}
                  >
                    Try again
                  </button>
                  <Link href="/" className="error-hero__btn error-hero__btn--secondary">
                    Home
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
