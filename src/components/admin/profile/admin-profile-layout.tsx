"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminProfileLayoutProps = {
  children: React.ReactNode;
};

const TABS = [
  { href: "/admin/profile", label: "Profile Settings", exact: true },
  { href: "/admin/profile/password", label: "Change Password", exact: false },
];

export function AdminProfileLayout({ children }: AdminProfileLayoutProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>My Profile</h1>
          <div className="admin-breadcrumb">
            <Link href="/admin/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Profile</span>
          </div>
        </div>
      </div>

      <div className="admin-profile-tabs">
        {TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`admin-profile-tab ${active ? "active" : ""}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </>
  );
}
