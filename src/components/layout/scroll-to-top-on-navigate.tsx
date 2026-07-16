"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollWindowToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Scrolls to top on every client-side route change (storefront + admin). */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    scrollWindowToTop();
    const frame = window.requestAnimationFrame(scrollWindowToTop);
    const timer = window.setTimeout(scrollWindowToTop, 0);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
