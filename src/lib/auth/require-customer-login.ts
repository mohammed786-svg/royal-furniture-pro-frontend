"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { royalToast } from "@/lib/toast/royal-toast";

export function useRequireCustomerLogin() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn());

  return (redirectPath?: string) => {
    if (isLoggedIn) return true;
    const next =
      redirectPath ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    royalToast.unauthorized("Please sign in to continue");
    router.push(`/login?redirect=${encodeURIComponent(next)}`);
    return false;
  };
}
