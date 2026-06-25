"use client";

import { useEffect } from "react";
import {
  hydrateCustomerAuthToken,
  setCustomerAuthToken,
} from "@/lib/axios/customer-auth-token";
import { useAddressStore } from "@/lib/store/address-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";

export function CommerceHydrator() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrateCart = useCartStore((s) => s.hydrate);
  const hydrateAddresses = useAddressStore((s) => s.hydrate);

  useEffect(() => {
    hydrateCustomerAuthToken();
    if (accessToken) {
      setCustomerAuthToken(accessToken);
    }
    void hydrateCart();
  }, [accessToken, hydrateCart]);

  useEffect(() => {
    if (accessToken) {
      void hydrateAddresses();
    }
  }, [accessToken, hydrateAddresses]);

  return null;
}
