import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { LoginPromoPanel } from "@/components/auth/login-promo-panel";

export const metadata: Metadata = {
  title: "Login | Royal Furniture Pro",
  description: "Sign in with Google to your Royal Furniture Pro account",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-page__card">
        <LoginPromoPanel />
        <div className="login-page__form">
          <h1 className="login-page__title">Sign in</h1>
          <p className="login-page__subtitle">
            Use your Google account to access cart, wishlist, and orders.
          </p>
          <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
            <GoogleSignInButton />
          </Suspense>
          <p className="login-page__footer-note">
            New here? <Link href="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
