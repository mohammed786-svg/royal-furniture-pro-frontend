"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Search, ShoppingBag, User } from "lucide-react";
import { ModernMenuIcon } from "@/components/ui/modern-menu-icon";
import { siteConfig } from "@/config/seo";
import { useNavbar } from "@/hooks/api/use-navbar";
import { accountDisplayName } from "@/lib/auth/display-name";
import { topUtilityLinks } from "@/lib/constants/home";
import {
  activeNavLabelFromItems,
  hasMegaMenuColumns,
  primaryNavHref,
} from "@/lib/navbar/navbar-utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { DeliveryPincodeBar } from "./delivery-pincode-bar";
import { MobileOffcanvasNav } from "./mobile-offcanvas-nav";
import { NavMegaMenuPanel } from "./nav-mega-menu";

const HOVER_CLOSE_MS = 120;
/** Desktop horizontal category nav (mega menu) — below this use hamburger */
const DESKTOP_NAV_MQ = "(min-width: 1024px)";

export function StorefrontHeader() {
  const pathname = usePathname();
  const {
    items,
    menusByLabel,
    categoryLabels,
    labelBySlug,
    isLoading,
    isEmpty,
    emptyMessage,
  } = useNavbar();
  const routeActiveNav = activeNavLabelFromItems(pathname, labelBySlug);
  const cartCount = useCartStore((s) => s.cartItemCount());
  const wishlistCount = useCartStore((s) => s.wishlistItems.length);
  const user = useAuthStore((s) => s.user);
  const [authHydrated, setAuthHydrated] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAuthHydrated(true);
  }, []);

  /** Close mobile UI when resizing to desktop */
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_MQ);
    const onChange = () => {
      if (mq.matches) {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
        setActiveMegaMenu(null);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const openMegaMenu = useCallback(
    (category: string) => {
      const item = items.find((entry) => entry.name === category);
      if (!item || !hasMegaMenuColumns(item)) return;
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setActiveMegaMenu(category);
    },
    [items],
  );

  const scheduleCloseMegaMenu = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
      closeTimerRef.current = null;
    }, HOVER_CLOSE_MS);
  }, []);

  const cancelCloseMegaMenu = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((open) => !open);
    setMobileSearchOpen(false);
  };

  const activeMenu = activeMegaMenu ? menusByLabel[activeMegaMenu] : null;
  const navLabels = categoryLabels.length > 0 ? categoryLabels : [];

  return (
    <header className="storefront-header-sticky w-full">
      {/* Top utility bar — tablet+ */}
      <div className="hidden bg-[var(--royal-navy-deep)] text-xs text-white/90 sm:block">
        <div className="royal-header-inner flex items-center justify-between py-1.5">
          <DeliveryPincodeBar />
          <nav className="flex flex-wrap items-center justify-end gap-3 lg:gap-4">
            {topUtilityLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[var(--royal-gold-brand)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main header — white background, logo centered */}
      <div className="storefront-header-main storefront-header-main--light bg-white text-[var(--royal-navy)]">
        <div className="royal-header-inner relative grid grid-cols-[auto_1fr_auto] items-center gap-2 py-2 lg:grid-cols-3 lg:gap-3 lg:py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="storefront-header-icon-btn storefront-header-mobile-only inline-flex items-center justify-center lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <ModernMenuIcon open={mobileMenuOpen} className="h-6 w-6" />
            </button>

            <button
              type="button"
              className="storefront-header-icon-btn storefront-header-mobile-only inline-flex items-center justify-center lg:hidden"
              aria-label="Search"
              aria-expanded={mobileSearchOpen}
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              <Search className="h-5 w-5" strokeWidth={2} />
            </button>

            <label className="relative hidden w-full max-w-xl lg:block">
              <input
                type="search"
                placeholder="Enter Keyword or Item"
                className="storefront-header-search w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-4 text-sm text-[var(--royal-navy)] placeholder:text-gray-400 focus:border-[var(--royal-gold-brand)] focus:bg-white focus:outline-none"
              />
              <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </label>
          </div>

          <Link
            href="/"
            className="storefront-header-logo-link flex justify-center justify-self-center px-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={siteConfig.logoSrc}
              alt={siteConfig.name}
              className="storefront-header-logo__image"
              width={540}
              height={462}
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4">
            <HeaderAction
              icon={User}
              label={authHydrated && user ? accountDisplayName(user.name) : "LOGIN"}
              href={authHydrated && user ? "/account" : "/login"}
              showLabelFrom="sm"
              labelVariant={authHydrated && user ? "name" : "action"}
              theme="light"
            />
            <HeaderAction
              icon={Heart}
              label="WISHLIST"
              href="/wishlist"
              badge={wishlistCount > 0 ? wishlistCount : undefined}
              showLabelFrom="sm"
              theme="light"
            />
            <HeaderAction
              icon={ShoppingBag}
              label="CART"
              href="/cart"
              badge={cartCount > 0 ? cartCount : undefined}
              showLabelFrom="sm"
              theme="light"
            />
          </div>
        </div>

        <div className="royal-header-inner border-t border-gray-200 py-1.5 sm:hidden">
          <DeliveryPincodeBar />
        </div>

        {mobileSearchOpen && (
          <div className="royal-header-inner border-t border-gray-200 pb-3 lg:hidden">
            <label className="relative block w-full">
              <input
                type="search"
                placeholder="Enter Keyword or Item"
                className="storefront-header-search w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-4 text-sm text-[var(--royal-navy)] placeholder:text-gray-400 focus:border-[var(--royal-gold-brand)] focus:bg-white focus:outline-none"
                autoFocus
              />
              <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </label>
          </div>
        )}

        <div className="lg:hidden">
          <MobileOffcanvasNav
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            items={items}
            menusByLabel={menusByLabel}
            isLoading={isLoading}
            isEmpty={isEmpty}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>

      {/* Desktop category navigation + mega menu (1024px+) */}
      <div
        className="nav-category-bar relative hidden bg-[var(--royal-navy-nav)] lg:block"
        onMouseLeave={scheduleCloseMegaMenu}
      >
        <div className="royal-header-inner">
          {isLoading ? (
            <p className="nav-category-empty" aria-live="polite">
              Loading menu…
            </p>
          ) : isEmpty ? (
            <p className="nav-category-empty" aria-live="polite">
              {emptyMessage}
            </p>
          ) : (
            <ul className="nav-category-list">
              {navLabels.map((cat) => {
                const item = items.find((entry) => entry.name === cat);
                const mega = item ? hasMegaMenuColumns(item) : false;
                const isHoverActive = activeMegaMenu === cat;
                const isRouteActive = routeActiveNav === cat;

                return (
                  <li
                    key={cat}
                    className={`nav-category-item${isHoverActive ? " nav-category-item--active" : ""}${isRouteActive ? " nav-category-item--route-active" : ""}`}
                    onMouseEnter={() => {
                      if (mega) openMegaMenu(cat);
                      else setActiveMegaMenu(null);
                    }}
                  >
                    <Link
                      href={item ? primaryNavHref(item) : "/"}
                      className="nav-category-trigger"
                    >
                      {cat}
                      {mega && (
                        <ChevronDown
                          className="nav-category-trigger__chevron"
                          strokeWidth={2.5}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {activeMenu && activeMenu.columns.length > 0 && (
          <div onMouseEnter={cancelCloseMegaMenu} onMouseLeave={scheduleCloseMegaMenu}>
            <NavMegaMenuPanel
              menu={activeMenu}
              onNavigate={() => setActiveMegaMenu(null)}
            />
          </div>
        )}
      </div>
    </header>
  );
}

function HeaderAction({
  icon: Icon,
  label,
  href,
  badge,
  showLabelFrom = "sm",
  labelVariant = "action",
  theme = "dark",
}: {
  icon: typeof User;
  label: string;
  href: string;
  badge?: number;
  showLabelFrom?: "sm" | "md" | "none";
  labelVariant?: "action" | "name";
  theme?: "dark" | "light";
}) {
  const visibilityClass =
    showLabelFrom === "none"
      ? "hidden"
      : showLabelFrom === "md"
        ? "hidden md:block"
        : "hidden sm:block";

  const textClass =
    labelVariant === "name"
      ? "storefront-header-account-name max-w-[76px] truncate normal-case tracking-normal"
      : "text-[10px] tracking-wider uppercase";

  const iconClass =
    theme === "light"
      ? "h-5 w-5 text-[var(--royal-navy)] transition-colors group-hover:text-[var(--royal-gold-brand)] sm:h-6 sm:w-6"
      : "h-5 w-5 text-white/90 transition-colors group-hover:text-[var(--royal-gold-brand)] sm:h-6 sm:w-6";

  const labelClass =
    theme === "light" ? "text-[10px] text-gray-600" : "text-[10px] text-white/70";

  return (
    <Link href={href} className="group flex max-w-[80px] flex-col items-center gap-0.5">
      <span className="relative">
        <Icon className={iconClass} />
        {badge != null && badge > 0 && (
          <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--royal-red)] px-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </span>
      <span className={`${visibilityClass} ${labelClass} ${textClass}`}>{label}</span>
    </Link>
  );
}
