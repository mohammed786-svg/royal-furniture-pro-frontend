"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut, Settings, User } from "lucide-react";
import { useAdminAuthStore } from "@/lib/admin/auth-store";

type AdminProfileDropdownProps = {
  open: boolean;
  onClose: () => void;
  initials: string;
};

export function AdminProfileDropdown({
  open,
  onClose,
  initials,
}: AdminProfileDropdownProps) {
  const user = useAdminAuthStore((s) => s.user);
  const logout = useAdminAuthStore((s) => s.logout);
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !(target as Element).closest?.("[data-admin-profile-trigger]")
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !user) return null;

  return (
    <div ref={panelRef} className="admin-profile-dropdown" role="menu">
      <div className="admin-profile-dropdown-head">
        <div className="admin-header-avatar">{initials}</div>
        <div>
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-xs text-[var(--admin-muted)]">{user.email}</p>
          <span className="admin-profile-role-badge">{user.roleName}</span>
        </div>
      </div>
      <div className="admin-profile-dropdown-menu">
        <Link
          href="/my-admin/profile"
          className="admin-profile-menu-item"
          onClick={onClose}
          role="menuitem"
        >
          <User size={16} />
          Profile Settings
        </Link>
        <Link
          href="/my-admin/profile/password"
          className="admin-profile-menu-item"
          onClick={onClose}
          role="menuitem"
        >
          <KeyRound size={16} />
          Change Password
        </Link>
        <Link
          href="/my-admin/settings"
          className="admin-profile-menu-item"
          onClick={onClose}
          role="menuitem"
        >
          <Settings size={16} />
          Store Settings
        </Link>
      </div>
      <div className="admin-profile-dropdown-footer">
        <button
          type="button"
          className="admin-profile-menu-item danger w-full"
          onClick={async () => {
            await logout();
            onClose();
            router.replace("/my-admin/login");
          }}
          role="menuitem"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
