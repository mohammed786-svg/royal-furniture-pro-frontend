"use client";

import { Toaster } from "react-hot-toast";
import { NetworkStatusBanner } from "@/components/layout/network-status-banner";
import { ScrollToTopOnNavigate } from "@/components/layout/scroll-to-top-on-navigate";
import { QueryProvider } from "@/providers/query/query-provider";
import { ReduxProvider } from "@/providers/redux/redux-provider";
import { SocketProvider } from "@/providers/socket/socket-provider";
import { ThemeProvider } from "@/providers/theme/theme-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ThemeProvider>
          <SocketProvider>
            <ScrollToTopOnNavigate />
            <NetworkStatusBanner />
            {children}
            <Toaster
              position="top-center"
              containerClassName="royal-toast-container"
              containerStyle={{
                top: 20,
                zIndex: 10000,
              }}
              gutter={12}
              toastOptions={{
                duration: 4000,
                className: "royal-toast",
                style: {
                  background: "transparent",
                  boxShadow: "none",
                  padding: 0,
                },
              }}
            />
          </SocketProvider>
        </ThemeProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
