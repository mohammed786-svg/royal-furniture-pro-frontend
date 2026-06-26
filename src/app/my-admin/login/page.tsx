"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/auth/admin-login-form";
import { useAdminAuthStore } from "@/lib/admin/auth-store";

export default function AdminLoginPage() {
  const { isLoggedIn, restoreSession, isHydrated } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    async function check() {
      if (isLoggedIn() || (await restoreSession())) {
        router.replace("/my-admin/dashboard");
      }
    }
    check();
  }, [isHydrated, isLoggedIn, restoreSession, router]);

  return <AdminLoginForm />;
}
