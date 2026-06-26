const HEX_KEY_REGEX = /^[0-9a-fA-F]{64}$/;

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

let cachedKey: CryptoKey | null = null;

async function importKey(hexKey: string): Promise<CryptoKey> {
  if (cachedKey) {
    return cachedKey;
  }
  const keyData = new Uint8Array(hexToBytes(hexKey));
  cachedKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
  return cachedKey;
}

export function isCryptoEnabled(): boolean {
  const key = process.env.NEXT_PUBLIC_API_CRYPTO_KEY ?? "";
  return HEX_KEY_REGEX.test(key);
}

export async function encryptPayload(data: unknown): Promise<{ payload: string }> {
  const hexKey = process.env.NEXT_PUBLIC_API_CRYPTO_KEY ?? "";
  if (!HEX_KEY_REGEX.test(hexKey)) {
    throw new Error("NEXT_PUBLIC_API_CRYPTO_KEY must be 64 hex characters");
  }

  const key = await importKey(hexKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    encoded,
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return { payload: bytesToBase64(combined) };
}

export async function decryptPayload(payload: string): Promise<unknown> {
  const hexKey = process.env.NEXT_PUBLIC_API_CRYPTO_KEY ?? "";
  if (!HEX_KEY_REGEX.test(hexKey)) {
    throw new Error("NEXT_PUBLIC_API_CRYPTO_KEY must be 64 hex characters");
  }

  const key = await importKey(hexKey);
  const raw = base64ToBytes(payload);
  const iv = raw.slice(0, 12);
  const ciphertext = raw.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    new Uint8Array(ciphertext),
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}
