"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import {
  getFirebaseAuth,
  googleAuthProvider,
  isFirebaseConfigured,
} from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { verifyStorefrontGoogle } from "@/services/storefront-commerce";

type GoogleSignInButtonProps = {
  label?: string;
  className?: string;
};

export function GoogleSignInButton({
  label = "Continue with Google",
  className = "login-google-btn",
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isFirebaseConfigured()) {
      toast.error("Google sign-in is not configured yet.");
      return;
    }

    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      const data = await verifyStorefrontGoogle(idToken);
      setSession(data.user, data.accessToken);
      toast.success("Signed in successfully");

      const redirect = searchParams.get("redirect");
      router.push(redirect && redirect.startsWith("/") ? redirect : "/account");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign-in failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Signing in…" : label}
    </button>
  );
}
