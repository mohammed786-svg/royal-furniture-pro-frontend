"use client";

import { useEffect } from "react";
import { useAdminAuthStore } from "@/lib/admin/auth-store";
import { setAdminAuthToken, setAdminRefreshToken } from "@/lib/axios/admin-auth-token";
import { setTokenRefreshHandler } from "@/lib/axios/instance";
import { adminRefresh } from "@/services/admin-auth";

function configureTokenRefresh() {
  setTokenRefreshHandler(async () => {
    const { refreshToken } = useAdminAuthStore.getState();
    const result = await adminRefresh(refreshToken);
    useAdminAuthStore.setState({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken ?? refreshToken,
    });
    setAdminAuthToken(result.accessToken);
    setAdminRefreshToken(result.refreshToken ?? refreshToken ?? null);
    return result.accessToken;
  });
}

export function AdminAuthInitializer() {
  useEffect(() => {
    configureTokenRefresh();

    const unsubscribe = useAdminAuthStore.persist.onFinishHydration(() => {
      const { accessToken, refreshToken } = useAdminAuthStore.getState();
      if (accessToken) {
        setAdminAuthToken(accessToken);
      }
      if (refreshToken) {
        setAdminRefreshToken(refreshToken);
      }
      useAdminAuthStore.setState({ isHydrated: true });
    });

    void useAdminAuthStore.persist.rehydrate();

    return unsubscribe;
  }, []);

  return null;
}
