"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNavbar } from "@/hooks/api/use-navbar";

type DepartmentRedirectProps = {
  department: string;
};

export function DepartmentRedirect({ department }: DepartmentRedirectProps) {
  const router = useRouter();
  const { items, isLoading, isEmpty } = useNavbar();

  useEffect(() => {
    if (isLoading) return;

    const item = items.find((entry) => entry.slug === department);
    if (item?.href) {
      router.replace(item.href);
      return;
    }

    if (isEmpty || !item) {
      router.replace("/");
    }
  }, [department, items, isLoading, isEmpty, router]);

  return (
    <main className="category-listing-page">
      <div className="category-listing-page__inner royal-section-inner py-12 text-center">
        <div className="admin-inline-spinner mx-auto" />
        <p className="mt-4 text-sm text-gray-500">Loading category...</p>
      </div>
    </main>
  );
}
