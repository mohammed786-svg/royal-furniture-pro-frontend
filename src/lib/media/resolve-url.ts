import { env } from "@/lib/env";

const INVALID_MEDIA_VALUES = new Set(["", "na", "n/a", "null", "undefined", "none"]);

/** True when the value can be attempted as an image URL. */
export function isValidMediaSrc(url?: string | null): boolean {
  if (url == null) return false;
  const trimmed = String(url).trim();
  if (!trimmed) return false;
  return !INVALID_MEDIA_VALUES.has(trimmed.toLowerCase());
}

export function resolveMediaUrl(url?: string | null): string | null {
  if (!isValidMediaSrc(url)) return null;
  const trimmed = String(url).trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  const base = env.cdnUrl || env.apiUrl.replace("/api/v1", "");
  return `${base.replace(/\/$/, "")}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}
