/** Shared events for connectivity + API server health banners */

export type ServerHealthKind = "unreachable" | "error" | "ok";

export type ServerHealthDetail = {
  kind: ServerHealthKind;
  message: string;
};

const EVENT = "royal-server-health";

let lastNotifyAt = 0;
const THROTTLE_MS = 8000;

export function notifyServerHealth(detail: ServerHealthDetail) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (detail.kind !== "ok" && now - lastNotifyAt < THROTTLE_MS) return;
  lastNotifyAt = now;
  window.dispatchEvent(new CustomEvent<ServerHealthDetail>(EVENT, { detail }));
}

export function subscribeServerHealth(
  handler: (detail: ServerHealthDetail) => void,
): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent<ServerHealthDetail>).detail);
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
