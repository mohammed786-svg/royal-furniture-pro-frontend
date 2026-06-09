import type { Metadata } from "next";
import { LoginOtpForm } from "@/components/auth/login-otp-form";
import { LoginPromoPanel } from "@/components/auth/login-promo-panel";

export const metadata: Metadata = {
  title: "Login | Royal Furniture Pro",
  description: "Login with OTP to your Royal Furniture Pro account",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-page__card">
        <LoginPromoPanel />
        <LoginOtpForm />
      </div>
    </main>
  );
}
