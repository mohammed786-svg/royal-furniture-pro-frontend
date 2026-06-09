"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { navCategories, navCategoryIcons } from "@/lib/constants/home";
import { navMegaMenus } from "@/lib/constants/nav-mega-menu";
import { primaryNavCategoryHref } from "@/lib/routes/category";
import { resolveMegaMenuHref } from "@/lib/routes/mega-menu-hrefs";

type MobileOffcanvasNavProps = {
  open: boolean;
  onClose: () => void;
};

function hasMegaMenu(category: string): boolean {
  const menu = navMegaMenus[category];
  return Boolean(menu?.columns?.length);
}

export function MobileOffcanvasNav({ open, onClose }: MobileOffcanvasNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setExpanded(null);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="mobile-nav-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Shop menu"
    >
      <nav className="mobile-nav-sheet__inner">
        <ul className="mobile-nav-list">
          {navCategories.map((cat) => {
            const menu = navMegaMenus[cat];
            const mega = hasMegaMenu(cat);
            const isExpanded = expanded === cat;

            return (
              <li key={cat} className="mobile-nav-item">
                {mega && menu ? (
                  <>
                    <button
                      type="button"
                      className="mobile-nav-row"
                      aria-expanded={isExpanded}
                      onClick={() => setExpanded(isExpanded ? null : cat)}
                    >
                      <CategoryIcon category={cat} />
                      <span className="mobile-nav-row__label">{cat}</span>
                      <ChevronDown
                        className={`mobile-nav-row__chevron${isExpanded ? " mobile-nav-row__chevron--open" : ""}`}
                        strokeWidth={2}
                      />
                    </button>
                    {isExpanded && (
                      <div className="mobile-nav-submenu">
                        {menu.columns.map((column) => (
                          <div key={column.title} className="mobile-nav-submenu__group">
                            <Link
                              href={resolveMegaMenuHref(cat, column.title)}
                              className="mobile-nav-submenu__heading"
                              onClick={onClose}
                            >
                              {column.title}
                            </Link>
                            {column.items.length > 0 && (
                              <ul className="mobile-nav-submenu__links">
                                {column.items.map((item) => (
                                  <li key={item.label}>
                                    <Link
                                      href={resolveMegaMenuHref(cat, column.title)}
                                      className="mobile-nav-submenu__link"
                                      onClick={onClose}
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={primaryNavCategoryHref(cat)}
                    className="mobile-nav-row"
                    onClick={onClose}
                  >
                    <CategoryIcon category={cat} />
                    <span className="mobile-nav-row__label">{cat}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function CategoryIcon({ category }: { category: (typeof navCategories)[number] }) {
  const src = navCategoryIcons[category];
  return (
    <span className="mobile-nav-row__icon">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={40} height={40} loading="lazy" />
    </span>
  );
}
