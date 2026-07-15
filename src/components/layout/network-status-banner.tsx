"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ServerCrash, Wifi, WifiOff } from "lucide-react";
import { createPortal } from "react-dom";
import {
  subscribeServerHealth,
  type ServerHealthDetail,
} from "@/lib/connectivity/server-health";

type BannerKind = "offline" | "online" | "unreachable" | "error" | null;

const COPY: Record<Exclude<BannerKind, null>, string> = {
  offline: "No internet available",
  online: "Connected — you're back online",
  unreachable: "Server is unavailable — please try again shortly",
  error: "Internal server error — we're working on it",
};

export function NetworkStatusBanner() {
  const [mounted, setMounted] = useState(false);
  const [kind, setKind] = useState<BannerKind>(null);
  const wasOffline = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const clearHide = () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };

    const showPersistent = (next: Exclude<BannerKind, "online" | null>) => {
      clearHide();
      setKind(next);
    };

    const showTransient = (next: Exclude<BannerKind, null>, ms: number) => {
      clearHide();
      setKind(next);
      hideTimer.current = setTimeout(() => setKind(null), ms);
    };

    const goOffline = () => {
      wasOffline.current = true;
      showPersistent("offline");
    };

    const goOnline = () => {
      if (wasOffline.current) {
        wasOffline.current = false;
        showTransient("online", 2800);
      } else {
        setKind((current) => (current === "offline" ? null : current));
      }
    };

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      goOffline();
    }

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    const unsub = subscribeServerHealth((detail: ServerHealthDetail) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      if (detail.kind === "unreachable") {
        showTransient("unreachable", 4500);
      } else if (detail.kind === "error") {
        showTransient("error", 4500);
      }
    });

    return () => {
      clearHide();
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      unsub();
    };
  }, []);

  if (!mounted || !kind) return null;

  const Icon =
    kind === "offline"
      ? WifiOff
      : kind === "online"
        ? Wifi
        : kind === "unreachable"
          ? ServerCrash
          : AlertTriangle;

  const tone =
    kind === "online"
      ? "network-status-banner--online"
      : kind === "offline"
        ? "network-status-banner--offline"
        : "network-status-banner--server";

  return createPortal(
    <div className={`network-status-banner ${tone}`} role="status" aria-live="polite">
      <Icon size={16} strokeWidth={2.25} aria-hidden />
      <span>{COPY[kind]}</span>
    </div>,
    document.body,
  );
}
