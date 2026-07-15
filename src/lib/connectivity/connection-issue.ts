import { isAxiosError } from "axios";

export type ConnectionIssueKind = "offline" | "unreachable" | "error" | null;

export function classifyConnectionIssue(error: unknown): ConnectionIssueKind {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "offline";
  }
  if (!isAxiosError(error)) return null;

  const status = error.response?.status;
  if (status && status >= 500) return "error";
  if (!error.response) {
    if (
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      error.message === "Network Error"
    ) {
      return "unreachable";
    }
  }
  return null;
}

export function connectionIssueMessage(kind: ConnectionIssueKind): string {
  switch (kind) {
    case "offline":
      return "No internet available. Check your Wi‑Fi or mobile data.";
    case "unreachable":
      return "Server is unavailable. Please try again shortly.";
    case "error":
      return "Internal server error. We're working on it.";
    default:
      return "Unable to load data.";
  }
}
