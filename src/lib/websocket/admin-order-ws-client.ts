import type { AdminOrderNotificationPayload } from "@/components/admin/notifications/admin-order-notification-types";
import { getAdminOrderWsUrl } from "@/lib/websocket/admin-order-ws";

type MessageHandler = (payload: AdminOrderNotificationPayload) => void;

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let disconnectTimer: ReturnType<typeof setTimeout> | null = null;
const handlers = new Set<MessageHandler>();

const RECENT_TTL_MS = 5000;
const recentKeys = new Map<string, number>();

function notificationKey(payload: AdminOrderNotificationPayload): string {
  return `${payload.orderId}:${payload.action}`;
}

function isDuplicate(payload: AdminOrderNotificationPayload): boolean {
  const key = notificationKey(payload);
  const now = Date.now();
  const last = recentKeys.get(key);
  if (last !== undefined && now - last < RECENT_TTL_MS) {
    return true;
  }
  recentKeys.set(key, now);
  for (const [k, ts] of recentKeys) {
    if (now - ts > RECENT_TTL_MS) recentKeys.delete(k);
  }
  return false;
}

function dispatch(payload: AdminOrderNotificationPayload) {
  if (isDuplicate(payload)) return;
  for (const handler of handlers) {
    handler(payload);
  }
}

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect() {
  clearReconnectTimer();
  if (handlers.size === 0) return;
  reconnectTimer = setTimeout(connect, 3000);
}

function connect() {
  const wsUrl = getAdminOrderWsUrl();
  if (!wsUrl || handlers.size === 0) return;
  if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
    return;
  }

  ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(String(event.data)) as {
        event?: string;
        payload?: AdminOrderNotificationPayload;
      };
      if (data.event !== "order.notification" || !data.payload) return;
      dispatch(data.payload);
    } catch {
      /* ignore malformed payloads */
    }
  };

  ws.onclose = () => {
    ws = null;
    scheduleReconnect();
  };

  ws.onerror = () => {
    ws?.close();
  };
}

function disconnect() {
  clearReconnectTimer();
  if (disconnectTimer) {
    clearTimeout(disconnectTimer);
    disconnectTimer = null;
  }
  ws?.close();
  ws = null;
}

/** Single shared WebSocket — avoids duplicate connections from React Strict Mode remounts. */
export function subscribeAdminOrderNotifications(handler: MessageHandler): () => void {
  if (disconnectTimer) {
    clearTimeout(disconnectTimer);
    disconnectTimer = null;
  }

  handlers.add(handler);
  connect();

  return () => {
    handlers.delete(handler);
    if (handlers.size === 0) {
      disconnectTimer = setTimeout(disconnect, 250);
    }
  };
}
