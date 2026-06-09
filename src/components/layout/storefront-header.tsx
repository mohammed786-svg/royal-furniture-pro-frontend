"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Search, ShoppingBag, User } from "lucide-react";
import { ModernMenuIcon } from "@/components/ui/modern-menu-icon";
import { accountDisplayName } from "@/lib/auth/display-name";
import { navCategories, topUtilityLinks } from "@/lib/constants/home";
import { navMegaMenus } from "@/lib/constants/nav-mega-menu";
import { activeNavLabelFromPath, primaryNavCategoryHref } from "@/lib/routes/category";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { DeliveryPincodeBar } from "./delivery-pincode-bar";
import { MobileOffcanvasNav } from "./mobile-offcanvas-nav";
import { NavMegaMenuPanel } from "./nav-mega-menu";

const HOVER_CLOSE_MS = 120;
/** Desktop horizontal category nav (mega menu) — below this use hamburger */
const DESKTOP_NAV_MQ = "(min-width: 1024px)";

function hasMegaMenu(category: string): boolean {
  const menu = navMegaMenus[category];
  return Boolean(menu?.columns?.length);
}

export function StorefrontHeader() {
  const pathname = usePathname();
  const routeActiveNav = activeNavLabelFromPath(pathname);
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

  const openMegaMenu = useCallback((category: string) => {
    if (!hasMegaMenu(category)) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMegaMenu(category);
  }, []);

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

  const activeMenu = activeMegaMenu ? navMegaMenus[activeMegaMenu] : null;

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

      {/* Main header */}
      <div className="storefront-header-main bg-[var(--royal-navy)] text-white">
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
                className="w-full rounded-md border border-white/10 bg-[var(--royal-navy-deep)] py-2.5 pr-10 pl-4 text-sm text-white placeholder:text-white/40 focus:border-[var(--royal-gold-brand)] focus:outline-none"
              />
              <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-white/50" />
            </label>
          </div>

          <Link
            href="/"
            className="flex flex-col items-center justify-self-center px-1 text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="storefront-header-logo__crown">♛</span>
            <span className="storefront-header-logo__royal">ROYAL</span>
            <span className="storefront-header-logo__sub mt-0.5">FURNITURE PRO</span>
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4">
            <HeaderAction
              icon={User}
              label={authHydrated && user ? accountDisplayName(user.name) : "LOGIN"}
              href={authHydrated && user ? "/account" : "/login"}
              showLabelFrom="sm"
              labelVariant={authHydrated && user ? "name" : "action"}
            />
            <HeaderAction
              icon={Heart}
              label="WISHLIST"
              href="/wishlist"
              badge={wishlistCount > 0 ? wishlistCount : undefined}
              showLabelFrom="sm"
            />
            <HeaderAction
              icon={ShoppingBag}
              label="CART"
              href="/cart"
              badge={cartCount > 0 ? cartCount : undefined}
              showLabelFrom="sm"
            />
          </div>
        </div>

        <div className="royal-header-inner border-t border-white/10 py-1.5 sm:hidden">
          <DeliveryPincodeBar />
        </div>

        {mobileSearchOpen && (
          <div className="royal-header-inner border-t border-white/10 pb-3 lg:hidden">
            <label className="relative block w-full">
              <input
                type="search"
                placeholder="Enter Keyword or Item"
                className="w-full rounded-md border border-white/10 bg-[var(--royal-navy-deep)] py-2.5 pr-10 pl-4 text-sm text-white placeholder:text-white/40 focus:border-[var(--royal-gold-brand)] focus:outline-none"
                autoFocus
              />
              <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-white/50" />
            </label>
          </div>
        )}

        <div className="lg:hidden">
          <MobileOffcanvasNav
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Desktop category navigation + mega menu (1024px+) */}
      <div
        className="nav-category-bar relative hidden bg-[var(--royal-navy-nav)] lg:block"
        onMouseLeave={scheduleCloseMegaMenu}
      >
        <div className="royal-header-inner">
          <ul className="nav-category-list">
            {navCategories.map((cat) => {
              const mega = hasMegaMenu(cat);
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
                    href={primaryNavCategoryHref(cat)}
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
}: {
  icon: typeof User;
  label: string;
  href: string;
  badge?: number;
  showLabelFrom?: "sm" | "md" | "none";
  labelVariant?: "action" | "name";
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

  return (
    <Link href={href} className="group flex max-w-[80px] flex-col items-center gap-0.5">
      <span className="relative">
        <Icon className="h-5 w-5 text-white/90 transition-colors group-hover:text-[var(--royal-gold-brand)] sm:h-6 sm:w-6" />
        {badge != null && badge > 0 && (
          <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--royal-red)] px-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </span>
      <span className={`${visibilityClass} text-[10px] text-white/70 ${textClass}`}>
        {label}
      </span>
    </Link>
  );
}
