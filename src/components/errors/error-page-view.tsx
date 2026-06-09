"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Home,
  Mail,
  RefreshCw,
  Search,
  Sofa,
} from "lucide-react";

export type ErrorPageVariant = "404" | "500" | "coming-soon";

type ErrorPageViewProps = {
  variant: ErrorPageVariant;
  /** When true, page is inside storefront layout (no mini header) */
  embedded?: boolean;
  onRetry?: () => void;
};

const COPY: Record<
  ErrorPageVariant,
  {
    code: string;
    title: string;
    subtitle: string;
    hint: string;
    icon: typeof Sofa;
  }
> = {
  "404": {
    code: "404",
    title: "This room is empty",
    subtitle: "The page you’re looking for was moved, renamed, or never existed.",
    hint: "Check the URL or explore our collections below.",
    icon: Search,
  },
  "500": {
    code: "500",
    title: "Something went wrong",
    subtitle:
      "Our servers stumbled while loading this page. Your cart and account are safe.",
    hint: "Please try again in a moment or contact support if the issue continues.",
    icon: AlertTriangle,
  },
  "coming-soon": {
    code: "SOON",
    title: "Coming soon",
    subtitle:
      "We’re crafting something beautiful for your home — this experience launches shortly.",
    hint: "Subscribe for launch updates or continue shopping our live collections.",
    icon: Clock,
  },
};

export function ErrorPageView({
  variant,
  embedded = false,
  onRetry,
}: ErrorPageViewProps) {
  const copy = COPY[variant];
  const Icon = copy.icon;

  return (
    <div
      className={`error-page error-page--${variant}${embedded ? " error-page--embedded" : ""}`}
    >
      {!embedded && (
        <header className="error-page__mini-header">
          <Link href="/" className="error-page__logo">
            <span className="error-page__logo-crown">♛</span>
            <span className="error-page__logo-text">ROYAL FURNITURE PRO</span>
          </Link>
        </header>
      )}

      <main className="error-page__main">
        <section className="error-hero">
          <div className="error-hero__mesh" aria-hidden />
          <div className="error-hero__particles" aria-hidden>
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="error-hero__particle"
                style={{ "--i": i } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="error-hero__inner royal-section-inner">
            <div className="error-hero__code-wrap" aria-hidden>
              <span className="error-hero__code-digit">{copy.code.charAt(0)}</span>
              <span className="error-hero__code-crown">♛</span>
              <span className="error-hero__code-digit">
                {copy.code.length > 2
                  ? copy.code.slice(1)
                  : (copy.code.charAt(1) ?? "")}
              </span>
            </div>

            <div className="error-hero__icon-wrap">
              <Icon className="error-hero__icon" strokeWidth={1.5} />
            </div>

            <h1 className="error-hero__title">{copy.title}</h1>
            <p className="error-hero__subtitle">{copy.subtitle}</p>
            <p className="error-hero__hint">{copy.hint}</p>

            <div className="error-hero__actions">
              <Link href="/" className="error-hero__btn error-hero__btn--primary">
                <Home className="h-4 w-4" />
                Back to home
              </Link>
              {variant === "500" && onRetry && (
                <button
                  type="button"
                  className="error-hero__btn error-hero__btn--secondary"
                  onClick={onRetry}
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              )}
              {variant === "404" && (
                <Link
                  href="/living/recliners"
                  className="error-hero__btn error-hero__btn--secondary"
                >
                  <Sofa className="h-4 w-4" />
                  Shop recliners
                </Link>
              )}
              {variant === "coming-soon" && (
                <Link href="/" className="error-hero__btn error-hero__btn--secondary">
                  <Sofa className="h-4 w-4" />
                  Browse store
                </Link>
              )}
            </div>
          </div>
        </section>

        <div className="error-page__body royal-section-inner">
          {variant === "coming-soon" && <ComingSoonNotify />}

          <div className="error-links-card">
            <h2>Popular destinations</h2>
            <ul className="error-links-card__grid">
              <li>
                <Link href="/cart">My cart</Link>
              </li>
              <li>
                <Link href="/wishlist">Wishlist</Link>
              </li>
              <li>
                <Link href="/track-order">Track order</Link>
              </li>
              <li>
                <Link href="/contact">Contact us</Link>
              </li>
              <li>
                <Link href="/faqs">FAQs</Link>
              </li>
              <li>
                <Link href="/stores">Find a store</Link>
              </li>
            </ul>
          </div>

          {variant === "500" && (
            <p className="error-page__support">
              Need help?{" "}
              <Link href="/customer-support" className="error-page__support-link">
                Customer support
              </Link>{" "}
              · <Link href="/contact">Contact</Link>
            </p>
          )}
        </div>
      </main>

      {!embedded && (
        <footer className="error-page__mini-footer">
          <p>© {new Date().getFullYear()} Royal Furniture Pro</p>
        </footer>
      )}
    </div>
  );
}

function ComingSoonNotify() {
  return (
    <div className="error-notify-card">
      <div className="error-notify-card__glow" aria-hidden />
      <Mail className="error-notify-card__icon" />
      <h2>Get notified at launch</h2>
      <p>Be the first to know when this section goes live.</p>
      <form
        className="error-notify-card__form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="email"
          placeholder="your@email.com"
          aria-label="Email for launch updates"
        />
        <button type="submit">Notify me</button>
      </form>
      <p className="error-notify-card__note">
        Demo form — hook to newsletter API when ready.
      </p>
    </div>
  );
}
