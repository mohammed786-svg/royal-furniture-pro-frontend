"use client";

import { useEffect, useRef } from "react";
import { resolveDeliveryPincode } from "@/lib/delivery/resolve-pincode";
import { useAddressStore } from "@/lib/store/address-store";
import { useAuthStore } from "@/lib/store/auth-store";

export function PincodeResolver() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const addressesHydrated = useAddressStore((s) => s.hydrated);
  const addressCount = useAddressStore((s) => s.addresses.length);
  const ranRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (accessToken && !addressesHydrated) return;

    if (ranRef.current && !accessToken) return;
    ranRef.current = true;

    void resolveDeliveryPincode();
  }, [isHydrated, accessToken, addressesHydrated]);

  useEffect(() => {
    if (!isHydrated || !accessToken || !addressesHydrated || addressCount === 0) return;
    void resolveDeliveryPincode();
  }, [isHydrated, accessToken, addressesHydrated, addressCount]);

  return null;
}
