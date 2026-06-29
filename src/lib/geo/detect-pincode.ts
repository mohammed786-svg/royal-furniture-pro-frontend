export type DetectedPincode = {
  pincode: string;
  city?: string;
};

function normalizeIndianPincode(value: unknown): string | null {
  const digits = String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 6);
  return /^\d{6}$/.test(digits) ? digits : null;
}

export async function reverseGeocodePincode(
  lat: number,
  lon: number,
): Promise<DetectedPincode | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
      },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      address?: {
        postcode?: string;
        city?: string;
        town?: string;
        village?: string;
        state_district?: string;
      };
    };

    const pincode = normalizeIndianPincode(data.address?.postcode);
    if (!pincode) return null;

    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state_district;

    return { pincode, city: city || undefined };
  } catch {
    return null;
  }
}

export function requestGeolocationPincode(): Promise<DetectedPincode | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void reverseGeocodePincode(
          position.coords.latitude,
          position.coords.longitude,
        ).then(resolve);
      },
      () => resolve(null),
      {
        enableHighAccuracy: false,
        timeout: 12_000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  });
}

export async function detectPincodeFromIp(): Promise<DetectedPincode | null> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) return null;

    const data = (await response.json()) as {
      country_code?: string;
      postal?: string;
      city?: string;
    };

    if (data.country_code !== "IN") return null;

    const pincode = normalizeIndianPincode(data.postal);
    if (!pincode) return null;

    return { pincode, city: data.city || undefined };
  } catch {
    return null;
  }
}
