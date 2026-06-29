import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { LoginPromoPanel } from "@/components/auth/login-promo-panel";

export const metadata: Metadata = {
  title: "Register | Royal Furniture Pro",
  description: "Create your Royal Furniture Pro account with Google",
};

export default function RegisterPage() {
  return (
    <main className="login-page">
      <div className="login-page__card">
        <LoginPromoPanel />
        <div className="login-page__form">
          <h1 className="login-page__title">Create account</h1>
          <p className="login-page__subtitle">
            Sign up with Google to shop, save wishlists, and track orders.
          </p>
          <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
            <GoogleSignInButton label="Sign up with Google" />
          </Suspense>
          <p className="login-page__footer-note">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
