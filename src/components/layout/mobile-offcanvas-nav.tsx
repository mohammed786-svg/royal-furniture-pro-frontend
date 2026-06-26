"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import {
  hasMegaMenuColumns,
  primaryNavHref,
  resolveNavCategoryIcon,
} from "@/lib/navbar/navbar-utils";
import type { NavbarCategoryItem, NavMegaMenu } from "@/types/navbar";

type MobileOffcanvasNavProps = {
  open: boolean;
  onClose: () => void;
  items: NavbarCategoryItem[];
  menusByLabel: Record<string, NavMegaMenu>;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
};

export function MobileOffcanvasNav({
  open,
  onClose,
  items,
  menusByLabel,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No categories available",
}: MobileOffcanvasNavProps) {
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
        {isLoading && items.length === 0 ? (
          <p className="px-4 py-3 text-sm text-white/70">Loading menu…</p>
        ) : isEmpty ? (
          <p className="px-4 py-3 text-sm text-white/70">{emptyMessage}</p>
        ) : null}
        <ul className="mobile-nav-list">
          {items.map((item) => {
            const menu = menusByLabel[item.name];
            const mega = hasMegaMenuColumns(item);
            const isExpanded = expanded === item.name;

            return (
              <li key={item.id} className="mobile-nav-item">
                {mega && menu ? (
                  <>
                    <button
                      type="button"
                      className="mobile-nav-row"
                      aria-expanded={isExpanded}
                      onClick={() => setExpanded(isExpanded ? null : item.name)}
                    >
                      <CategoryIcon item={item} />
                      <span className="mobile-nav-row__label">{item.name}</span>
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
                              href={column.href}
                              className="mobile-nav-submenu__heading"
                              onClick={onClose}
                            >
                              {column.title}
                            </Link>
                            {column.items.length > 0 && (
                              <ul className="mobile-nav-submenu__links">
                                {column.items.map((sub) => (
                                  <li key={sub.label}>
                                    <Link
                                      href={sub.href}
                                      className="mobile-nav-submenu__link"
                                      onClick={onClose}
                                    >
                                      {sub.label}
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
                    href={primaryNavHref(item)}
                    className="mobile-nav-row"
                    onClick={onClose}
                  >
                    <CategoryIcon item={item} />
                    <span className="mobile-nav-row__label">{item.name}</span>
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

function CategoryIcon({ item }: { item: NavbarCategoryItem }) {
  const icon = resolveNavCategoryIcon(item);
  return (
    <span className="mobile-nav-row__icon">
      <MediaImage
        src={icon}
        alt=""
        width={40}
        height={40}
        fit="contain"
        placeholderSize="xs"
        resolveUrl
      />
    </span>
  );
}
