"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { RoyalLoader } from "@/components/ui/royal-loader";

type StorefrontLoadingShellProps = {
  children: React.ReactNode;
};

const INITIAL_MS = 700;
const ROUTE_MS = 380;

export function StorefrontLoadingShell({ children }: StorefrontLoadingShellProps) {
  const pathname = usePathname();
  const [initialLoading, setInitialLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const isFirstPath = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), INITIAL_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), ROUTE_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  const showLoader = initialLoading || routeLoading;

  return (
    <>
      {showLoader && (
        <RoyalLoader
          fullScreen
          label={initialLoading ? "Welcome to Royal Furniture Pro" : "Loading"}
        />
      )}
      <div
        className={`storefront-content-shell${showLoader ? " storefront-content-shell--hidden" : ""}`}
      >
        {children}
      </div>
    </>
  );
}
