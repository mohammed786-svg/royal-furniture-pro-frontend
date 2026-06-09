import { io, type Socket } from "socket.io-client";
import { env } from "@/lib/env";

export type SocketEvents = Record<string, never>;

let socketInstance: Socket | null = null;

/**
 * Socket.IO client factory — connect when implementing real-time features.
 */
export function createSocketClient(options?: {
  path?: string;
  autoConnect?: boolean;
}): Socket {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  socketInstance = io(env.wsUrl, {
    path: options?.path ?? "/socket.io",
    autoConnect: options?.autoConnect ?? false,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socketInstance;
}

export function getSocketClient(): Socket | null {
  return socketInstance;
}

export function disconnectSocket() {
  socketInstance?.disconnect();
  socketInstance = null;
}
