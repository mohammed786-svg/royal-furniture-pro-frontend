"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { royalToast } from "@/lib/toast/royal-toast";
import { isMissingCustomerMobile } from "@/lib/validators/indian-mobile";

function currentPathWithSearch(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

export function useRequireCustomerLogin() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn());

  return (redirectPath?: string) => {
    if (isLoggedIn) return true;
    const next = redirectPath ?? currentPathWithSearch();
    royalToast.unauthorized("Please sign in to continue");
    router.push(`/login?redirect=${encodeURIComponent(next)}`);
    return false;
  };
}

/** Requires sign-in and a valid mobile on profile (for cart, wishlist, buy now). */
export function useRequireCustomerCommerce() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn());
  const user = useAuthStore((s) => s.user);

  return (redirectPath?: string) => {
    const next = redirectPath ?? currentPathWithSearch();
    if (!isLoggedIn) {
      royalToast.unauthorized("Please sign in to continue");
      router.push(`/login?redirect=${encodeURIComponent(next)}`);
      return false;
    }
    if (isMissingCustomerMobile(user?.mobile)) {
      royalToast.error("Add your mobile number in profile to continue");
      router.push(`/account/profile?redirect=${encodeURIComponent(next)}`);
      return false;
    }
    return true;
  };
}
