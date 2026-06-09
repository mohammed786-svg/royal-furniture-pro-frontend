"use client";

import { useEffect } from "react";
import { useAdminAuthStore } from "@/lib/admin/auth-store";
import { setAdminAuthToken } from "@/lib/axios/admin-auth-token";
import { setTokenRefreshHandler } from "@/lib/axios/instance";
import { adminRefresh } from "@/services/admin-auth";

function configureTokenRefresh() {
  setTokenRefreshHandler(async () => {
    const result = await adminRefresh();
    useAdminAuthStore.setState({
      user: result.user,
      accessToken: result.accessToken,
    });
    setAdminAuthToken(result.accessToken);
    return result.accessToken;
  });
}

export function AdminAuthInitializer() {
  useEffect(() => {
    configureTokenRefresh();

    const unsubscribe = useAdminAuthStore.persist.onFinishHydration(() => {
      const { accessToken } = useAdminAuthStore.getState();
      if (accessToken) {
        setAdminAuthToken(accessToken);
      }
      useAdminAuthStore.setState({ isHydrated: true });
    });

    void useAdminAuthStore.persist.rehydrate();

    return unsubscribe;
  }, []);

  return null;
}
