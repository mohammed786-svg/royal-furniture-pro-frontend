"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { OtpInput } from "@/components/auth/otp-input";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { useAddressStore } from "@/lib/store/address-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import {
  formatIndianMobileDisplay,
  indianMobileError,
  isValidIndianMobile,
  normalizeIndianMobile,
} from "@/lib/validators/indian-mobile";
import { sendStorefrontOtp, verifyStorefrontOtp } from "@/services/storefront-commerce";

type Step = "details" | "otp";

export function RegisterOtpForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const hydrateCart = useCartStore((s) => s.hydrate);
  const hydrateAddresses = useAddressStore((s) => s.hydrate);

  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === "otp") {
      requestAnimationFrame(() => {
        document.querySelector<HTMLInputElement>(".login-otp-boxes__input")?.focus();
      });
    }
  }, [step]);

  const handleMobileChange = (value: string) => {
    const digits = normalizeIndianMobile(value);
    setMobile(formatIndianMobileDisplay(digits));
    if (mobileError) setMobileError(null);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Enter your name");
      return;
    }
    const err = indianMobileError(mobile);
    if (err) {
      setMobileError(err);
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Enter a valid email or leave blank");
      return;
    }
    setFormError(null);
    setLoading(true);
    try {
      const digits = normalizeIndianMobile(mobile);
      await sendStorefrontOtp(digits, "register");
      setStep("otp");
      setOtp(Array(6).fill(""));
      setOtpError(null);
      toast.success("OTP sent to your mobile");
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not send OTP");
      setMobileError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const digits = normalizeIndianMobile(mobile);
      const result = await verifyStorefrontOtp(digits, code, {
        purpose: "register",
        fullName: name.trim(),
        email: email.trim() || undefined,
      });
      setSession(result.user, result.accessToken, result.refreshToken);
      useCartStore.setState({ hydrated: false });
      useAddressStore.setState({ hydrated: false });
      await hydrateCart();
      await hydrateAddresses();
      toast.success("Account created");
      router.push("/account");
    } catch (error) {
      setOtpError(getApiErrorMessage(error, "Could not complete registration"));
    } finally {
      setLoading(false);
    }
  };

  const maskedMobile = formatIndianMobileDisplay(normalizeIndianMobile(mobile));

  return (
    <div className="login-form">
      <h1 className="login-form__title">Register</h1>
      <p className="login-form__tab">Create account with OTP</p>

      {step === "details" ? (
        <form className="login-form__body" onSubmit={handleSendOtp} noValidate>
          <label className="login-form__label" htmlFor="reg-name">
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFormError(null);
            }}
            className="login-form__text-input"
            autoComplete="name"
          />

          <label className="login-form__label" htmlFor="reg-mobile">
            Mobile
          </label>
          <div
            className={`login-form__mobile-wrap${mobileError ? " login-form__mobile-wrap--error" : ""}`}
          >
            <span className="login-form__flag" aria-hidden>
              🇮🇳
            </span>
            <span className="login-form__country-code">+91</span>
            <input
              id="reg-mobile"
              type="tel"
              inputMode="numeric"
              placeholder="98989 89898"
              value={mobile}
              onChange={(e) => handleMobileChange(e.target.value)}
              className="login-form__mobile-input"
            />
          </div>
          {mobileError && (
            <p className="login-form__error" role="alert">
              {mobileError}
            </p>
          )}

          <label className="login-form__label" htmlFor="reg-email">
            Email <span className="login-form__optional">(optional)</span>
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError(null);
            }}
            className="login-form__text-input"
            autoComplete="email"
            placeholder="you@example.com"
          />

          {formError && (
            <p className="login-form__error" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="login-form__submit"
            disabled={loading || !isValidIndianMobile(mobile) || !name.trim()}
          >
            {loading ? "SENDING…" : "SEND OTP"}
          </button>
        </form>
      ) : (
        <form className="login-form__body" onSubmit={handleVerify} noValidate>
          <p className="login-form__otp-sent">
            OTP sent to +91 {maskedMobile}.{" "}
            <button
              type="button"
              className="login-form__link-btn"
              onClick={() => setStep("details")}
            >
              Change
            </button>
          </p>
          <label className="login-form__label login-form__label--otp">Enter OTP</label>
          <OtpInput value={otp} onChange={setOtp} disabled={loading} />
          {otpError && (
            <p className="login-form__error" role="alert">
              {otpError}
            </p>
          )}
          <button
            type="submit"
            className="login-form__submit"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "CREATING…" : "VERIFY & REGISTER"}
          </button>
        </form>
      )}

      <p className="login-form__register">
        Already have an account?{" "}
        <Link href="/login" className="login-form__register-link">
          Login
        </Link>
      </p>
    </div>
  );
}
