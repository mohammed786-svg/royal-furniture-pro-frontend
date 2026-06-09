"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Socket } from "socket.io-client";
import { getSocketClient } from "@/lib/socket";

type SocketContextValue = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

type SocketProviderProps = {
  children: ReactNode;
};

/**
 * Socket provider shell — wire createSocketClient() when implementing WebSockets.
 */
export function SocketProvider({ children }: SocketProviderProps) {
  const value = useMemo<SocketContextValue>(
    () => ({
      socket: getSocketClient(),
      isConnected: getSocketClient()?.connected ?? false,
    }),
    [],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  return useContext(SocketContext);
}
