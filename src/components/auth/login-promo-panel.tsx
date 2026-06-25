import Image from "next/image";
import { siteConfig } from "@/config/seo/metadata.config";

/** Left panel — brand logo (promo layout commented out for now) */
export function LoginPromoPanel() {
  return (
    <div className="login-promo">
      {/* Promo + USE CODE layout — kept for later
      <div className="login-promo__top">
        <div className="login-promo__copy">
          <p className="login-promo__headline">
            SIGN UP &amp; REDEEM
            <br />
            <span className="login-promo__amount">500/-</span> ON YOUR
            <br />
            FIRST PURCHASE
          </p>
          <Link href="/login" className="login-promo__cta">
            SIGN UP NOW
          </Link>
        </div>
        <div className="login-promo__coupon" aria-hidden>
          <span className="login-promo__coupon-code">USE CODE</span>
          <strong className="login-promo__coupon-strong">ROYAL500</strong>
          <span className="login-promo__coupon-bar" />
          <span className="login-promo__coupon-tnc">
            T&amp;C MIN PURCHASE AMOUNT ₹25,000/-
          </span>
        </div>
      </div>

      <div className="login-promo__image-wrap">
        <img
          src="/images/home/categories/recliner.webp"
          alt="Premium recliner collection"
          className="login-promo__image"
          width={520}
          height={320}
        />
      </div>
      */}

      <div className="login-promo__logo-wrap">
        <Image
          src={siteConfig.logoSrc}
          alt={siteConfig.name}
          width={320}
          height={120}
          className="login-promo__logo"
          priority
        />
      </div>
    </div>
  );
}
