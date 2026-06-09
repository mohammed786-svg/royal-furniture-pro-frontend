import type { Metadata } from "next";
import { LoginPromoPanel } from "@/components/auth/login-promo-panel";
import { RegisterOtpForm } from "@/components/auth/register-otp-form";

export const metadata: Metadata = {
  title: "Register | Royal Furniture Pro",
  description: "Create your Royal Furniture Pro account",
};

export default function RegisterPage() {
  return (
    <main className="login-page">
      <div className="login-page__card">
        <LoginPromoPanel />
        <RegisterOtpForm />
      </div>
    </main>
  );
}
