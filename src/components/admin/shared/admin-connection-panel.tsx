"use client";

import { AlertTriangle, RefreshCw, ServerCrash, WifiOff } from "lucide-react";
import {
  connectionIssueMessage,
  type ConnectionIssueKind,
} from "@/lib/connectivity/connection-issue";

type AdminConnectionPanelProps = {
  kind: ConnectionIssueKind;
  onRetry: () => void;
  loading?: boolean;
  title?: string;
};

export function AdminConnectionPanel({
  kind,
  onRetry,
  loading = false,
  title = "Dashboard unavailable",
}: AdminConnectionPanelProps) {
  if (!kind) return null;

  const Icon =
    kind === "offline" ? WifiOff : kind === "unreachable" ? ServerCrash : AlertTriangle;

  return (
    <div className="admin-connection-panel" role="alert">
      <div
        className={`admin-connection-panel__icon admin-connection-panel__icon--${kind}`}
      >
        <Icon size={22} strokeWidth={2} aria-hidden />
      </div>
      <div className="admin-connection-panel__copy">
        <h3>{title}</h3>
        <p>{connectionIssueMessage(kind)}</p>
      </div>
      <button
        type="button"
        className="admin-btn admin-btn-primary"
        onClick={onRetry}
        disabled={loading}
      >
        <RefreshCw size={16} className={loading ? "admin-spin" : undefined} />
        {loading ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}
