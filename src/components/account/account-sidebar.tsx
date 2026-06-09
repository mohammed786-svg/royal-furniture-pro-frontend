"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { accountDisplayName } from "@/lib/auth/display-name";
import {
  ACCOUNT_MENU_LOGOUT,
  ACCOUNT_MENU_MAIN,
  ACCOUNT_MENU_SHOPPING,
  ACCOUNT_MENU_SUPPORT,
  isAccountPath,
} from "@/lib/constants/account-menu";
import { useAuthStore } from "@/lib/store/auth-store";
import { royalToast } from "@/lib/toast/royal-toast";

function MenuSection({
  title,
  items,
  pathname,
  onLogout,
}: {
  title: string;
  items: typeof ACCOUNT_MENU_MAIN;
  pathname: string;
  onLogout?: () => void;
}) {
  return (
    <div className="account-sidebar__section">
      <p className="account-sidebar__section-title">{title}</p>
      <ul className="account-sidebar__list">
        {items.map((item) => {
          const active = !item.external && isAccountPath(pathname, item.href);
          const Icon = item.icon;

          if (item.id === "logout") {
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="account-sidebar__link account-sidebar__link--logout"
                  onClick={onLogout}
                >
                  <Icon className="account-sidebar__icon" strokeWidth={2} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`account-sidebar__link${active ? " account-sidebar__link--active" : ""}`}
              >
                <Icon className="account-sidebar__icon" strokeWidth={2} />
                <span className="account-sidebar__link-text">
                  <span className="account-sidebar__link-label">{item.label}</span>
                  {item.description && (
                    <span className="account-sidebar__link-desc">
                      {item.description}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    royalToast.success("Logged out successfully");
    router.push("/");
  };

  if (!user) return null;

  return (
    <aside className="account-sidebar">
      <div className="account-sidebar__user">
        <div className="account-sidebar__avatar" aria-hidden>
          {accountDisplayName(user.name).charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="account-sidebar__name">{user.name}</p>
          <p className="account-sidebar__mobile">+91 {user.mobile}</p>
          {user.email && <p className="account-sidebar__email">{user.email}</p>}
        </div>
      </div>

      <MenuSection title="My account" items={ACCOUNT_MENU_MAIN} pathname={pathname} />
      <MenuSection title="Shopping" items={ACCOUNT_MENU_SHOPPING} pathname={pathname} />
      <MenuSection title="Support" items={ACCOUNT_MENU_SUPPORT} pathname={pathname} />

      <div className="account-sidebar__section">
        <ul className="account-sidebar__list">
          <li>
            <button
              type="button"
              className="account-sidebar__link account-sidebar__link--logout"
              onClick={handleLogout}
            >
              <ACCOUNT_MENU_LOGOUT.icon
                className="account-sidebar__icon"
                strokeWidth={2}
              />
              <span>{ACCOUNT_MENU_LOGOUT.label}</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
