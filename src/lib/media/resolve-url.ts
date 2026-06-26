import { buildMediaUrl } from "@/config/media.config";

const INVALID_MEDIA_VALUES = new Set(["", "na", "n/a", "null", "undefined", "none"]);

/** True when the value can be attempted as an image URL. */
export function isValidMediaSrc(url?: string | null): boolean {
  if (url == null) return false;
  const trimmed = String(url).trim();
  if (!trimmed) return false;
  return !INVALID_MEDIA_VALUES.has(trimmed.toLowerCase());
}

/** Resolve DB or API media path to a browser-loadable URL. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!isValidMediaSrc(url)) return null;
  return buildMediaUrl(url);
}
