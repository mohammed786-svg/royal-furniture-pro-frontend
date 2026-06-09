"use client";

import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { AccountGuard } from "./account-guard";
import { AccountSidebar } from "./account-sidebar";

type AccountShellProps = {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
};

export function AccountShell({ title, breadcrumbs, children }: AccountShellProps) {
  const crumbs = breadcrumbs ?? [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/account" },
    { label: title },
  ];

  return (
    <AccountGuard>
      <main className="account-page">
        <div className="account-page__inner royal-section-inner">
          <CategoryBreadcrumbs items={crumbs} />
          <div className="account-page__layout">
            <AccountSidebar />
            <div className="account-page__content">
              <h1 className="account-page__title">{title}</h1>
              {children}
            </div>
          </div>
        </div>
      </main>
    </AccountGuard>
  );
}
