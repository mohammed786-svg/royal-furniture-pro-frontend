"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import type { NavMegaMenu } from "@/lib/constants/nav-mega-menu";
import { resolveMegaMenuHref } from "@/lib/routes/mega-menu-hrefs";

type NavMegaMenuPanelProps = {
  menu: NavMegaMenu;
  onNavigate?: () => void;
};

export function NavMegaMenuPanel({ menu, onNavigate }: NavMegaMenuPanelProps) {
  const columnCount = menu.columns.length;

  return (
    <div
      className="nav-mega-menu-panel"
      role="region"
      aria-label={`${menu.label} menu`}
    >
      <div className="nav-mega-menu-panel__shell">
        <div className="nav-mega-menu-panel__inner">
          <div
            className="nav-mega-menu-grid"
            style={
              columnCount > 0
                ? ({ "--mega-cols": columnCount } as CSSProperties)
                : undefined
            }
          >
            {menu.columns.map((column) => (
              <div key={column.title} className="nav-mega-menu-column">
                <Link
                  href={resolveMegaMenuHref(menu.label, column.title)}
                  className="nav-mega-menu-column__title"
                  onClick={onNavigate}
                >
                  {column.title}
                </Link>
                {column.items.length > 0 ? (
                  <ul className="nav-mega-menu-column__list">
                    {column.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={resolveMegaMenuHref(menu.label, column.title)}
                          className="nav-mega-menu-column__link"
                          onClick={onNavigate}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
