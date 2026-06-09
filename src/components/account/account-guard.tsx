"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

type AccountGuardProps = {
  children: React.ReactNode;
};

export function AccountGuard({ children }: AccountGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <main className="account-page account-page--loading">
        <div className="royal-section-inner account-page__loading">
          Loading your account…
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="account-page">
        <div className="royal-section-inner account-page__loading">
          <p>Redirecting to login…</p>
          <Link href="/login" className="account-link">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return children;
}
