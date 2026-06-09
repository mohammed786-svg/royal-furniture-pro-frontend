"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { OtpInput } from "@/components/auth/otp-input";
import { isDemoMobile, isDemoOtp } from "@/lib/constants/demo-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  formatIndianMobileDisplay,
  indianMobileError,
  isValidIndianMobile,
  normalizeIndianMobile,
} from "@/lib/validators/indian-mobile";

type Step = "mobile" | "otp";

export function LoginOtpForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);
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

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const err = indianMobileError(mobile);
    if (err) {
      setMobileError(err);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setOtp(Array(6).fill(""));
      setOtpError(null);
      if (isDemoMobile(mobile)) {
        toast("Demo OTP: 123456", { icon: "ℹ️" });
      }
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Enter the 6-digit OTP");
      return;
    }
    if (!isDemoMobile(mobile) || !isDemoOtp(code)) {
      setOtpError("Invalid OTP. Use demo mobile 8296565587 and OTP 123456");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setUser({
        name: "Guest",
        mobile: normalizeIndianMobile(mobile),
      });
      setLoading(false);
      toast.success("Logged in");
      router.push("/account");
    }, 500);
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setOtpError(null);
  };

  const handleChangeMobile = () => {
    setStep("mobile");
    setOtp(Array(6).fill(""));
    setOtpError(null);
  };

  const maskedMobile = formatIndianMobileDisplay(normalizeIndianMobile(mobile));

  return (
    <div className="login-form">
      <h1 className="login-form__title">Login</h1>
      <p className="login-form__tab">Login with OTP</p>

      {step === "mobile" ? (
        <form className="login-form__body" onSubmit={handleSendOtp} noValidate>
          <label className="login-form__label" htmlFor="login-mobile">
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
              id="login-mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98989 89898"
              value={mobile}
              onChange={(e) => handleMobileChange(e.target.value)}
              className="login-form__mobile-input"
              aria-invalid={Boolean(mobileError)}
              aria-describedby="login-mobile-hint login-mobile-error"
            />
          </div>
          <p id="login-mobile-hint" className="login-form__hint">
            Enter Mobile No. Without Country Code i.e 9899989898
          </p>
          {mobileError && (
            <p id="login-mobile-error" className="login-form__error" role="alert">
              {mobileError}
            </p>
          )}

          <p className="login-form__hint login-form__hint--demo">
            Demo: mobile <strong>8296565587</strong>, OTP <strong>123456</strong>
          </p>

          <button
            type="submit"
            className="login-form__submit"
            disabled={loading || !isValidIndianMobile(mobile)}
          >
            {loading ? "SENDING…" : "SEND OTP"}
          </button>
        </form>
      ) : (
        <form className="login-form__body" onSubmit={handleVerifyOtp} noValidate>
          <p className="login-form__otp-sent">
            OTP sent to +91 {maskedMobile}.{" "}
            <button
              type="button"
              className="login-form__link-btn"
              onClick={handleChangeMobile}
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
            {loading ? "VERIFYING…" : "VERIFY & LOGIN"}
          </button>

          <p className="login-form__resend">
            Didn&apos;t receive OTP?{" "}
            <button
              type="button"
              className="login-form__link-btn"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          </p>
        </form>
      )}

      <p className="login-form__register">
        Don&apos;t have an account click here to{" "}
        <Link href="/register" className="login-form__register-link">
          Register
        </Link>
      </p>
    </div>
  );
}
