"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/auth/admin-login-form";
import { useAdminAuthStore } from "@/lib/admin/auth-store";

export default function AdminLoginPage() {
  const { isLoggedIn, restoreSession, isHydrated, rememberMe } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    async function check() {
      // Auto-restore only when Remember me credentials/session were saved.
      if (isLoggedIn()) {
        router.replace("/my-admin/dashboard");
        return;
      }
      if (!rememberMe) return;
      if (await restoreSession()) {
        router.replace("/my-admin/dashboard");
      }
    }

    void check();
  }, [isHydrated, isLoggedIn, rememberMe, restoreSession, router]);

  return <AdminLoginForm />;
}
