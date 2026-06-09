"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type AdminHeaderPanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
};

export function AdminHeaderPanel({
  open,
  onClose,
  title,
  children,
  width = 360,
}: AdminHeaderPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !(target as Element).closest?.("[data-admin-panel-trigger]")
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

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="admin-header-panel"
      style={{ width }}
      role="dialog"
      aria-label={title}
    >
      <div className="admin-header-panel-head">
        <h3>{title}</h3>
        <button type="button" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>
      <div className="admin-header-panel-body">{children}</div>
    </div>
  );
}
