"use client";

import { useEffect } from "react";
import { PincodeResolver } from "@/components/commerce/pincode-resolver";
import {
  hydrateCustomerAuthToken,
  setCustomerAuthToken,
  setCustomerRefreshToken,
} from "@/lib/axios/customer-auth-token";
import { useAddressStore } from "@/lib/store/address-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";

export function CommerceHydrator() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const hydrateCart = useCartStore((s) => s.hydrate);
  const hydrateAddresses = useAddressStore((s) => s.hydrate);

  useEffect(() => {
    hydrateCustomerAuthToken();
    void useAuthStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (accessToken) {
      setCustomerAuthToken(accessToken);
    }
    if (refreshToken) {
      setCustomerRefreshToken(refreshToken);
    }
    void hydrateCart();
  }, [isHydrated, accessToken, refreshToken, hydrateCart]);

  useEffect(() => {
    if (!isHydrated || !accessToken) return;
    void hydrateAddresses();
  }, [isHydrated, accessToken, hydrateAddresses]);

  return (
    <>
      <PincodeResolver />
    </>
  );
}
