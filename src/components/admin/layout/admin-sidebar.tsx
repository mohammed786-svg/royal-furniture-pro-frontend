"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, X } from "lucide-react";
import { AdminIcon } from "@/components/admin/layout/admin-icon";
import { useAdminAuthStore } from "@/lib/admin/auth-store";
import { getVisibleMenuGroups } from "@/lib/admin/permissions";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const user = useAdminAuthStore((s) => s.user);
  const { resolvedTheme, setTheme } = useTheme();
  const groups = getVisibleMenuGroups(user);

  const isActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {open && (
        <div className="admin-sidebar-overlay" onClick={onClose} role="presentation" />
      )}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
              <rect width="32" height="32" rx="8" fill="#3D5EE1" />
              <path
                d="M8 22V12l8-4 8 4v10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Royal Pro
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-sidebar-store">
          <div className="admin-sidebar-store-avatar">RF</div>
          <span>Royal Furniture India</span>
        </div>

        <nav className="admin-sidebar-nav">
          {groups.map((group) => (
            <div key={group.id}>
              <div className="admin-nav-group-label">{group.label}</div>
              {group.items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`admin-nav-item ${isActive(item.href) ? "active" : ""}`}
                  onClick={onClose}
                >
                  <AdminIcon name={item.icon} size={16} />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="admin-nav-group-label">LAYOUT</div>
          <button
            type="button"
            className="admin-nav-item w-full border-0 bg-transparent text-left"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      </aside>
    </>
  );
}
