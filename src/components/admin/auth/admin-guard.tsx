"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/lib/admin/auth-store";
import { canAccessHref } from "@/lib/admin/permissions";
import { setAdminAuthToken } from "@/lib/axios/admin-auth-token";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const user = useAdminAuthStore((s) => s.user);
  const isHydrated = useAdminAuthStore((s) => s.isHydrated);
  const restoreSession = useAdminAuthStore((s) => s.restoreSession);
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    let cancelled = false;

    async function init() {
      setReady(false);

      if (accessToken && user) {
        setAdminAuthToken(accessToken);
        if (!cancelled) setReady(true);
        return;
      }

      const restored = await restoreSession();
      if (cancelled) return;

      if (!restored) {
        router.replace("/my-admin/login");
        return;
      }

      setReady(true);
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, accessToken, user, restoreSession, router]);

  useEffect(() => {
    if (!ready || !pathname || !user) return;
    if (!canAccessHref(user, pathname)) {
      router.replace("/my-admin/dashboard");
    }
  }, [ready, pathname, user, router]);

  if (!isHydrated || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3D5EE1] border-t-transparent" />
      </div>
    );
  }

  if (!accessToken || !user) return null;

  return <>{children}</>;
}
