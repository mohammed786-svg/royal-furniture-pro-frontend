import {
  detectPincodeFromIp,
  requestGeolocationPincode,
} from "@/lib/geo/detect-pincode";
import { useAddressStore } from "@/lib/store/address-store";
import { isValidPincode, useDeliveryStore } from "@/lib/store/delivery-store";

function pickAddressPincode() {
  const { addresses, getSelectedAddress } = useAddressStore.getState();
  const selected = getSelectedAddress();
  const defaultAddress = addresses.find((item) => item.isDefault);
  const candidate = selected ?? defaultAddress ?? addresses[0];
  if (!candidate || !isValidPincode(candidate.pincode)) return null;
  return { pincode: candidate.pincode, city: candidate.city };
}

export async function resolveDeliveryPincode(options?: {
  force?: boolean;
  preferGeo?: boolean;
}) {
  const store = useDeliveryStore.getState();
  if (!options?.force && store.pincodeSource === "manual") return false;

  store.setDetecting(true);
  try {
    if (!options?.preferGeo) {
      const fromAddress = pickAddressPincode();
      if (fromAddress) {
        store.applyDetectedPincode(fromAddress.pincode, "address", fromAddress.city);
        return true;
      }
    }

    const fromGeo = await requestGeolocationPincode();
    if (fromGeo && isValidPincode(fromGeo.pincode)) {
      store.applyDetectedPincode(fromGeo.pincode, "geo", fromGeo.city);
      return true;
    }

    const fromIp = await detectPincodeFromIp();
    if (fromIp && isValidPincode(fromIp.pincode)) {
      store.applyDetectedPincode(fromIp.pincode, "geo", fromIp.city);
      return true;
    }

    return false;
  } finally {
    store.setDetecting(false);
  }
}
